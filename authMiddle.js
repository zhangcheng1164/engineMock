const JWTUtils = require('./JWT/JWTUtil');

function isAuthorized(req) {
	if (req.url && req.url.endsWith('token')) return true;
	const bearer = req.header('Authorization') || '';
    const reg1 = /Bearer (.*)/;
    const matches = reg1.exec(bearer);

	if (matches && matches[1]) {
		return JWTUtils.verify(matches[1]);
	}

	return false;
}

module.exports = (req, res, next) => {
    if (isAuthorized(req)) {
        next();
    } else {
        res.status(401).jsonp({
            error: 'auth failed',
        });
    }
};
