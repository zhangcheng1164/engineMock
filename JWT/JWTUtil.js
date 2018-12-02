const jws = require('jws');

class JWTUtil {
  static createJWT() {
    const payload = {
      exp: Math.round(new Date().getTime()) + 60 * 30 * 1000, // 过期时间为30分钟
    };

    const header = {
      typ: 'JWT',
      alg: 'HS256',
    };

    return jws.sign({
      payload,
      header,
      secret: JWTUtil.secret,
    });
  }

  static verify(signature) {
    try {
      if (jws.verify(signature, 'HS256', JWTUtil.secret)) {
        const { payload } = jws.decode(signature);
        return payload.exp > Math.round(new Date().getTime());
      }
    } catch (e) {
      // ignore...
    }

    return false;
  }
}

JWTUtil.secret = 'massclouds mock JWT';

module.exports = JWTUtil;
