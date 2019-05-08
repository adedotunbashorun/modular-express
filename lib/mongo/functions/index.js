var passport = require('passport')
var User = require('../Modules/User/Models/User')
module.exports = {
    isValidUser: function(req, res, next) {
        if (passport.authenticate('jwt', { session: false })) {
            User.findOne({ temporarytoken: req.headers.authorization }).then(function(user) {
                if (user) next()
                else return res.status(401).json({ "success": false, "message": "token is undefined " })
            }, function(error) {
                return res.status(401).json({ "success": false, "message": error })
            })
        } else return res.status(401).json({ 'msg': 'UnAuthorized Request!' })
    }
}