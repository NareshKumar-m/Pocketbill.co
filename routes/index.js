const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const plus = google.plus('v1');
const ClientId = "767760587428-3aoogu56n1qulpdkkovdn3cknhkrgsq2.apps.googleusercontent.com";
const ClientSecret = "gTR_8NQf06N4BztBUxLbWS4t";
const RedirectionUrl = "http://localhost:3000/auth/google/done";

const  express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const asyncMiddleware = require('../controllers/asyncMiddleware');

const User = require('../models/User');



const TOKEN_SECRET = require('../config').TOKEN_SECRET;
router.post('/login', async (req, res)=> {
    try {
        let email = req.body.email; // email in JSON
        let password = req.body.password; // password in JSON
        if (!await User.validate(email, password)) {
            return res.json({
                'token': await jwt.sign({email: email}, TOKEN_SECRET, {expiresIn: '1d'}),
                'success': true
            });
        }
        throw 'ValueError : Invalid Username / Password';
    }
    catch (e) {
        return res.json({'success': false,});
    }
});

router.get('/auth/google', async (req, res)=> {
   let url = getAuthUrl();
   res.json({'url' : url});
});


router.post('/register', async (req, res)=> {
    let email = req.body.email; // email in JSON
    let password = req.body.password; // password in JSON
    try {
        if(!email || !password) throw Error;

        let result = await User.create({
            email: email,
            password: await User.hash(password)
        });

        if (result) {
            return res.json({'success': true});
        }
    }
    catch (e) {
        return res.json({'success' : false});
    }

});

function getOAuthClient () {
    return new OAuth2(ClientId ,  ClientSecret, RedirectionUrl);
}

function getAuthUrl () {
    let oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    let scopes = [
        'https://www.googleapis.com/auth/plus.me'
    ];

    let url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes // If you only need one scope you can pass it as string
    });

    return url;
}

module.exports = router;
