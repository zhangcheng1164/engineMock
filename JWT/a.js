const JWTUtils = require('./JWTUtil');

const signature = JWTUtils.createJWT();

setTimeout(() => {
  console.log(JWTUtils.verify(signature));
}, 1000 * 60 * 15);
