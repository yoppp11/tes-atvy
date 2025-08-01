const { verifyToken } = require("../helpers/jwt");

async function authenticationMidlleware(req, res, next){
    try {
        const { authorization } = req.headers
        if(!authorization) {
            throw { name: 'Unauthorized', message: 'Invalid token' }
        }

        const [type, token] = authorization.split(' ')

        if(type !== 'Bearer' || !token) {
            throw { name: 'Unauthorized', message: 'Invalid token' }
        }
        console.log(token, '<<<<<< TOKEN');

        const payload = verifyToken(token)
        if(!payload) {
            throw { name: 'Unauthorized', message: 'Invalid token' }
        }

        console.log(payload);

        req.user = {
            id: payload.id,
            username: payload.username
        }

        next()
        
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = { 
    authenticationMidlleware
}