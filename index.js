const AWS = require('aws-sdk');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
});

exports.handler = async (event) => {
  // 解析从SNS传来的消息
  const message = JSON.parse(event.Records[0].Sns.Message);
  const email = message.email;
  const firstName = message.firstName;
  const token = message.token; // 现在令牌是从SNS消息中获取的

  try {
    // 使用Mailgun发送验证邮件
    const emailResponse = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: 'no-reply@yourdomain.com',
      to: [email],
      subject: "Welcome to our website! Please confirm your email",
      text: `Hello ${firstName},

      Welcome to our website! We're excited to have you here.

      Please click on the following link to verify your email address: demo.rubyw.xyz/verify?user=${email}&token=${token}

      If you did not request this, please ignore this email.

      Best Regards,
      Your Company Name`,
      html: `<p>Hello ${firstName},</p>

      <p>Welcome to our website! We're excited to have you here.</p>

      <p>Please click on the following link to verify your email address: <a href="demo.rubyw.xyz/verify?user=${email}&token=${token}">demo.rubyw.xyz/verify?user=${email}&token=${token}</a></p>

      <p>If you did not request this, please ignore this email.</p>

      <p>Best Regards,<br>Your Company Name</p>`
    });
    console.log('Email sent:', emailResponse);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
