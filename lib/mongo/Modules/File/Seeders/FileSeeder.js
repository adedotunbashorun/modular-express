'use strict'

const User = require('../Models/User')
const UserSeeder = {}
const crypto = require('crypto')
const Activity = require('../../../functions/activity')

UserSeeder.seedUser = (req, res) => {
    try {
        // use the User model to insert/save
        var user = new User()
        user.title = "Mr"
        user.user_type = 'admin'
        user.first_name = 'Dev'
        user.last_name = 'Admin'
        user.email = 'adedotunolawale@gmail.com'
        user.temporarytoken = crypto.randomBytes(20).toString('hex')
        user.password = User.hashPassword('123456')
        user.save()

        // User.findOne({ email: 'adedotunolawale@gmail.com' }, function(error, users) {
        //     if (error) {
        //         res.json(error)
        //     } else if (!users) {
        //         res.json({ 'msg': 'token do not math' })
        //     } else {
        //         users.temporarytoken = null
        //         users.is_active = true
        //         Activity.Email(user, 'Account Activated', 'Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for registering at Brax Map. Your Account has been activated successfully.')
        //         //getting mail data
        //         users.save()
        //         return res.status(201).json(users)
        //     }

        // })

        // seeded!
        return res.status(201).json({ msg: 'User Seeded', user: user })
    } catch (err) {
        return res.status(422).json({ error: err, msg: err.message })
    }
}

module.exports = UserSeeder