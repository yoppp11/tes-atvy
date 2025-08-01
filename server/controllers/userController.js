const { comparePassword } = require("../helpers/bcrypt")
const { signToken } = require("../helpers/jwt")
const { user } = require("../models/")

module.exports = class UserController {
    static async routeLogin(req, res, next){
        try {
            const { username, password } = req.body
            console.log(username, password, '<<<====username and password');
            
            if(!username) throw { name: 'BadRequest', message: 'Username is required' }
            if(!password) throw { name: 'BadRequest', message: 'Password is required' }

            const userData = await user.findOne({
                where: { username }
            })
            
            if(!userData) throw { name: 'BadRequest', message: 'Invalid username or password' }

            const isPasswordValid = comparePassword(password, userData.password)
            if(!isPasswordValid) throw { name: 'BadRequest', message: 'Invalid username or password' }

            const access_token = signToken({ id: userData.id, username: userData.username })

            return res.status(200).send({
                access_token,
                id: userData.id,
                username: userData.username
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async routeRegister(req, res, next){
        try {
            const { username, password } = req.body
            
            const newUser = await user.create({
                username,
                password
            })

            return res.status(201).send({
                id: newUser.id,
                username: newUser.username
            })
            
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}