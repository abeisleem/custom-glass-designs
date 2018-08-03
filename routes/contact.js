let express = require('express');
let bodyParser = require('body-parser');
let csrf = require('csurf');
let { body, validationResult } = require('express-validator/check');
let { sanitizeBody } = require('express-validator/filter');
let nodemailer = require('nodemailer');
let router = express.Router();

var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

var util = require('util');

/* GET CONTACT page. */
router.get('/', csrfProtection, function(req, res) {
    res.render('contact', {API_KEY:global.API_KEY, csrfToken: req.csrfToken()});
});

/* POST to contact form*/
router.post('/', parseForm, csrfProtection, [

    // Validate fields.
    body('firstName').isLength({min: 1}).withMessage('first name is required').trim(),
    body('lastName').isLength({min: 1}).withMessage('last name is required').trim(),
    body('email').isEmail().withMessage('must be an email').normalizeEmail().trim(),
    body('phone').isLength({min: 0}).trim(),
    body('message').isLength({min: 1}).withMessage('message is required').trim(),

    // Sanitize fields.
    sanitizeBody('firstName').trim().escape(),
    sanitizeBody('lastName').trim().escape(),
    sanitizeBody('email').trim().normalizeEmail(),
    sanitizeBody('phone').trim().escape(),
    sanitizeBody('message').trim().escape(),

    (req, res) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // There are errors. Render form again with sanitized values/errors messages.
        if (!errors.isEmpty()) {

            // for debugging purposes
            // return res.status(422).json({ errors: errors.array() });
            // console.log("\n\nError: " + util.inspect(errors, {showHidden: false, depth: null}) + "\n\n");
            // console.log("\n\nError: " + util.inspect(errors.array(), {showHidden: false, depth: null}) + "\n\n");

            req.flash('error', 'There was an error in sending your message.\nPlease try again, we\'d love to hear from you!');
            res.render('contact', {API_KEY:global.API_KEY, csrfToken: req.csrfToken()});

        }
        else {
            // On successful parsing of body, sending message as an email.
            let mailOpts, smtpTrans;

            smtpTrans = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: "healthystoner@gmail.com",
                    pass: "fenderc2\'_\'"
                }
            });
            // TODO: encrypt email pass ^^

            //TODO: Maybe reformat email layout
            mailOpts = {
                from: req.body.email,
                to: "a.f_isleem@hotmail.com",
                replyTo: req.body.email,
                subject: `Contact from Custom Glass Designs`,
                text: `Name: ${req.body.firstName} ${req.body.lastName}\n\nEmail: ${req.body.email}\n\nPhone: ${req.body.phone}\n\nMessage: ${req.body.message}`
                // html: '<p>Hello world</p>'
                // can have an html field here to format the message html style .. -> https://nodemailer.com/message/
            };

            smtpTrans.sendMail(mailOpts, function (error, response) {
                if (error) {
                    // console.log("2-- ERROR IN SENDING EMAIL");
                    req.flash('error', 'There was an error in sending your message.\nPlease try again, we\'d love to hear from you!');
                    res.render('contact', {API_KEY:global.API_KEY, csrfToken: req.csrfToken()});
                }
                else {
                    // console.log("2-- SUCCESS IN SENDING EMAIL");
                    req.flash('success', 'Thanks for the message! We\'ll be in touch soon. ');
                    res.render('contact', {API_KEY:global.API_KEY, csrfToken: req.csrfToken()});
                }
            });
        }
    }
]);

module.exports = router;
