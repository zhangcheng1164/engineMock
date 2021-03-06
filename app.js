const path = require('path');
const enableDestroy = require('server-destroy');
const jsonServer = require('json-server');
const fs = require('fs');
const jsonFormat = require('json-format');
const _ = require('lodash');
const chalk = require('chalk');
const reload = require('require-reload')(require);
const JWTUtils = require('./JWT/JWTUtil');
const authMiddle = require('./authMiddle');

let app;
let server;

//function assembleJsonFiles() {
//    const db = {};
//    fs.readdirSync(path.join(__dirname, 'json_dir')).forEach(file => {
//        if (file.endsWith('json')) {
//            const temp = reload(path.join(__dirname, 'json_dir', file));
//            Object.assign(db, temp);
//        }
//    });
//    
//    return db;
//}

function start(cb) {
    app = jsonServer.create();
    //let db = {};
    //try {
    //    db = assembleJsonFiles();
    //} catch(e) {
    //    console.error(e.message);
    //    console.log(chalk.red('read json data from json_dir error, check your json format !'));
    //    process.exit(-1);
    //}
    //fs.writeFileSync('./db.json', jsonFormat(db), 'utf8');
    const router = jsonServer.router(path.join(__dirname, 'db.json'));
    app.db = router.db;

    const middlewares = jsonServer.defaults();
    app.use(middlewares);
    app.use(jsonServer.bodyParser);
    //app.use(authMiddle);

    app.use(jsonServer.rewriter({
      '/mock/*': '/$1',
      '/api/*': '/$1',
      '/mock/api/*': '/$1',
    }));

    /* 
     *注册相关组件的顺序是要要求的 
     * middlewares > 自定义router > db router 
     */
    app.post('/sso/oauth/token', (req, res) => {
        if ( req.body.username === 'admin@internal' && req.body.password === 'admin==1' ) {
            res.jsonp({
                access_token: JWTUtils.createJWT(),
            });
        } else {
            res.status(401).jsonp({
                error: 'auth failed',
            });
    	}
    });


    //自定义路由
    app.post('/vms/:id/start', (req, res) => {
        const vmId = req.params.id;
        setTimeout(() => {
            app.db.get('vms').find({id: vmId}).assign({status: 'uping'}).write();
            setTimeout(() => {
                app.db.get('vms').find({id: vmId}).assign({status: 'up'}).write();
            }, 20000);
        }, 20000);

        res.jsonp({result: 'ok'});
    });


    app.use(router);
    server =  app.listen(3000, '0.0.0.0', () => {
      console.log(chalk.green('Massclouds Engine Mock Server is running'));
      console.log('Home http://0.0.0.0:3000');
    });

    enableDestroy(server);
    cb && cb();
}


start(() => {
    let readError = false;
    
    fs.watch(path.join(__dirname, 'db.json'), (event, file) => {
        if(file.endsWith('json')) {
            try {
                const newDB = reload('./db.json');
                if (readError) {
                    readError = false;
                    console.log(chalk.green(`  Read error has been fixed :)`));
                }
                const isDatabaseDifferent = !_.isEqual(newDB, app.db.getState());
                if (isDatabaseDifferent) {
                    console.log(chalk.gray(`${file} has changed, reloading...`));
                    server.destroy();
                    start();
                }
            } catch(e) {
                readError = true;
                console.log(chalk.red(`  Error reading ${file}`));
                console.error(e.message);
            } 
        }
    });
});


