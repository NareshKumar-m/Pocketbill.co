const  express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const asyncMiddleware = require('../controllers/asyncMiddleware');

const User = require('../models/User');

const TOKEN_SECRET = require('../config').TOKEN_SECRET;
router.post('/login', asyncMiddleware(async (req, res)=> {
    let email = req.body.email; // email in JSON
    let password = req.body.password; // password in JSON
    if(await User.validate(email, password)) {
        return res.json({
            'token': await jwt.sign({email: 'hackmypc'}, TOKEN_SECRET, {expiresIn: '1d'}),
            'success': true
        });
    }
    return res.json({'success' : false});

}));

router.post('/register', asyncMiddleware(async (req, res)=> {
    let email = req.body.email; // email in JSON
    let password = req.body.password; // password in JSON
    let result = await User.create({
        email : email,
        password : await User.hash(password)
    });
    if(result) {
        return res.json({'success' : true});
    }
    return res.json({'success' : false});

}));
module.exports = router;
