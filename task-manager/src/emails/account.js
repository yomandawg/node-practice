const sgMail = require('@sendgrid/mail')
const { model } = require('mongoose')
 
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'yomandawgshit@gmail.com',
    subject: `Thank for joining in! ${Date()}`,
    text: `Welcome to the app, ${name}.`
    // can contain html script here
  })
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'yomandawgshit@gmail.com',
    subject: 'Sorry to see you go!',
    text: `Goodbye, ${name}.`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}