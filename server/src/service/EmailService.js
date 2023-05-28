const nodemailer = require('nodemailer')
const UserService = require('./UserService')
const Product = require('../model/Product')
require('dotenv').config()

class EmailService {
    async sendEmail(email, subject, body) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        })
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            html: body,
        }

        await transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.log(err)
            else console.log(`Email was sent: ` + info.response)
        })
    }
    htmlEmailVerificationCodeRegister(code, name) {
        return (
            '<!DOCTYPE html>\n' +
            '<html>\n' +
            '\n' +
            '<head>\n' +
            '    <title></title>\n' +
            '    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
            '    <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
            '    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n' +
            '    <style type="text/css">\n' +
            '        @media screen {\n' +
            '            @font-face {\n' +
            "                font-family: 'Lato';\n" +
            '                font-style: normal;\n' +
            '                font-weight: 400;\n' +
            "                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');\n" +
            '            }\n' +
            '\n' +
            '            @font-face {\n' +
            "                font-family: 'Lato';\n" +
            '                font-style: normal;\n' +
            '                font-weight: 700;\n' +
            "                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');\n" +
            '            }\n' +
            '\n' +
            '            @font-face {\n' +
            "                font-family: 'Lato';\n" +
            '                font-style: italic;\n' +
            '                font-weight: 400;\n' +
            "                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');\n" +
            '            }\n' +
            '\n' +
            '            @font-face {\n' +
            "                font-family: 'Lato';\n" +
            '                font-style: italic;\n' +
            '                font-weight: 700;\n' +
            "                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');\n" +
            '            }\n' +
            '        }\n' +
            '\n' +
            '        /* CLIENT-SPECIFIC STYLES */\n' +
            '        body,\n' +
            '        table,\n' +
            '        td,\n' +
            '        a {\n' +
            '            -webkit-text-size-adjust: 100%;\n' +
            '            -ms-text-size-adjust: 100%;\n' +
            '        }\n' +
            '\n' +
            '        table,\n' +
            '        td {\n' +
            '            mso-table-lspace: 0pt;\n' +
            '            mso-table-rspace: 0pt;\n' +
            '        }\n' +
            '\n' +
            '        img {\n' +
            '            -ms-interpolation-mode: bicubic;\n' +
            '        }\n' +
            '\n' +
            '        /* RESET STYLES */\n' +
            '        img {\n' +
            '            border: 0;\n' +
            '            height: auto;\n' +
            '            line-height: 100%;\n' +
            '            outline: none;\n' +
            '            text-decoration: none;\n' +
            '        }\n' +
            '\n' +
            '        table {\n' +
            '            border-collapse: collapse !important;\n' +
            '        }\n' +
            '\n' +
            '        body {\n' +
            '            height: 100% !important;\n' +
            '            margin: 0 !important;\n' +
            '            padding: 0 !important;\n' +
            '            width: 100% !important;\n' +
            '        }\n' +
            '\n' +
            '        /* iOS BLUE LINKS */\n' +
            '        a[x-apple-data-detectors] {\n' +
            '            color: inherit !important;\n' +
            '            text-decoration: none !important;\n' +
            '            font-size: inherit !important;\n' +
            '            font-family: inherit !important;\n' +
            '            font-weight: inherit !important;\n' +
            '            line-height: inherit !important;\n' +
            '        }\n' +
            '\n' +
            '        /* MOBILE STYLES */\n' +
            '        @media screen and (max-width:600px) {\n' +
            '            h1 {\n' +
            '                font-size: 32px !important;\n' +
            '                line-height: 32px !important;\n' +
            '            }\n' +
            '        }\n' +
            '\n' +
            '        /* ANDROID CENTER FIX */\n' +
            '        div[style*="margin: 16px 0;"] {\n' +
            '            margin: 0 !important;\n' +
            '        }\n' +
            '    </style>\n' +
            '</head>\n' +
            '\n' +
            '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">\n' +
            '    <!-- HIDDEN PREHEADER TEXT -->\n' +
            //                "    <div style=\"display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;\"> We're thrilled to have you here! Get ready to dive into your new account.\n" +
            //                "    </div>\n" +
            '    <table border="0" cellpadding="0" cellspacing="0" width="100%">\n' +
            '        <!-- LOGO -->\n' +
            '        <tr>\n' +
            '            <td bgcolor="#FFA73B" align="center">\n' +
            '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
            '                    <tr>\n' +
            '                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>\n' +
            '                    </tr>\n' +
            '                </table>\n' +
            '            </td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">\n' +
            '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">\n' +
            '                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />\n' +
            '                        </td>\n' +
            '                    </tr>\n' +
            '                </table>\n' +
            '            </td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">\n' +
            '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
            '                            <p style="margin: 0;">Hi ' +
            name +
            ',</p>\n' +
            '                          <p>Mã xác thực để đăng ký thành viên ở bên dưới:</p>\n' +
            '                        </td>\n' +
            '                    </tr>\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left">\n' +
            '                            <table width="100%" border="0" cellspacing="0" cellpadding="0">\n' +
            '                                <tr>\n' +
            '                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">\n' +
            '                                        <table border="0" cellspacing="0" cellpadding="0">\n' +
            '                                            <tr>\n' +
            '                                                <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><div target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block; letter-spacing: 10px; font-size: 50px;">' +
            code +
            '</div></td>\n' +
            '                                            </tr>\n' +
            '                                        </table>\n' +
            '                                    </td>\n' +
            '                                </tr>\n' +
            '                            </table>\n' +
            '                        </td>\n' +
            '                    </tr> <!-- COPY -->\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
            '                            <p style="margin: 0;">Vui lòng quay trở lại trang UTE Fast Food và nhập mã xác thực để hoàn tất quá trình!</p>\n' +
            '                        </td>\n' +
            '                    </tr> <!-- COPY -->\n' +
            '                    \n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
            '                            <p style="margin-top: 20px;">Nếu bạn có bất kỳ thắc mắc nào, hãy trả lời email này&mdash;Chúng tôi luôn sẵn lòng hỗ trợ bạn.</p>\n' +
            '                        </td>\n' +
            '                    </tr>\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
            '                          <p style="margin: 0;">Cheers,</p>\n' +
            '                          \n' +
            '                          <h3 style="margin-top:10px;">The UTE Fast Food Store</h3>\n' +
            '                        </td>\n' +
            '                    </tr>\n' +
            '                </table>\n' +
            '            </td>\n' +
            '        </tr>\n' +
            '                         \n' +
            '    </table>\n' +
            '</body>\n' +
            '\n' +
            '</html>'
        )
    }

    htmlEmailVerificationCodeForgotPasswor(code, name) {
        return (
            '<!DOCTYPE html>\n' +
            '<html>\n' +
            '\n' +
            '<head>\n' +
            '    <title></title>\n' +
            '    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n' +
            '    <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
            '    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n' +
            '    <style type="text/css">\n' +
            '        @media screen {\n' +
            '            @font-face {\n' +
            "                font-family: 'Lato';\n" +
            '                font-style: normal;\n' +
            '                font-weight: 400;\n' +
            "                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');\n" +
            '            }\n' +
            '\n' +
            '            @font-face {\n' +
            "                font-family: 'Lato';\n" +
            '                font-style: normal;\n' +
            '                font-weight: 700;\n' +
            "                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');\n" +
            '            }\n' +
            '\n' +
            '            @font-face {\n' +
            "                font-family: 'Lato';\n" +
            '                font-style: italic;\n' +
            '                font-weight: 400;\n' +
            "                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');\n" +
            '            }\n' +
            '\n' +
            '            @font-face {\n' +
            "                font-family: 'Lato';\n" +
            '                font-style: italic;\n' +
            '                font-weight: 700;\n' +
            "                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');\n" +
            '            }\n' +
            '        }\n' +
            '\n' +
            '        /* CLIENT-SPECIFIC STYLES */\n' +
            '        body,\n' +
            '        table,\n' +
            '        td,\n' +
            '        a {\n' +
            '            -webkit-text-size-adjust: 100%;\n' +
            '            -ms-text-size-adjust: 100%;\n' +
            '        }\n' +
            '\n' +
            '        table,\n' +
            '        td {\n' +
            '            mso-table-lspace: 0pt;\n' +
            '            mso-table-rspace: 0pt;\n' +
            '        }\n' +
            '\n' +
            '        img {\n' +
            '            -ms-interpolation-mode: bicubic;\n' +
            '        }\n' +
            '\n' +
            '        /* RESET STYLES */\n' +
            '        img {\n' +
            '            border: 0;\n' +
            '            height: auto;\n' +
            '            line-height: 100%;\n' +
            '            outline: none;\n' +
            '            text-decoration: none;\n' +
            '        }\n' +
            '\n' +
            '        table {\n' +
            '            border-collapse: collapse !important;\n' +
            '        }\n' +
            '\n' +
            '        body {\n' +
            '            height: 100% !important;\n' +
            '            margin: 0 !important;\n' +
            '            padding: 0 !important;\n' +
            '            width: 100% !important;\n' +
            '        }\n' +
            '\n' +
            '        /* iOS BLUE LINKS */\n' +
            '        a[x-apple-data-detectors] {\n' +
            '            color: inherit !important;\n' +
            '            text-decoration: none !important;\n' +
            '            font-size: inherit !important;\n' +
            '            font-family: inherit !important;\n' +
            '            font-weight: inherit !important;\n' +
            '            line-height: inherit !important;\n' +
            '        }\n' +
            '\n' +
            '        /* MOBILE STYLES */\n' +
            '        @media screen and (max-width:600px) {\n' +
            '            h1 {\n' +
            '                font-size: 32px !important;\n' +
            '                line-height: 32px !important;\n' +
            '            }\n' +
            '        }\n' +
            '\n' +
            '        /* ANDROID CENTER FIX */\n' +
            '        div[style*="margin: 16px 0;"] {\n' +
            '            margin: 0 !important;\n' +
            '        }\n' +
            '    </style>\n' +
            '</head>\n' +
            '\n' +
            '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">\n' +
            '    <!-- HIDDEN PREHEADER TEXT -->\n' +
            //                "    <div style=\"display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;\"> We're thrilled to have you here! Get ready to dive into your new account.\n" +
            //                "    </div>\n" +
            '    <table border="0" cellpadding="0" cellspacing="0" width="100%">\n' +
            '        <!-- LOGO -->\n' +
            '        <tr>\n' +
            '            <td bgcolor="#FFA73B" align="center">\n' +
            '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
            '                    <tr>\n' +
            '                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>\n' +
            '                    </tr>\n' +
            '                </table>\n' +
            '            </td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">\n' +
            '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">\n' +
            '                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />\n' +
            '                        </td>\n' +
            '                    </tr>\n' +
            '                </table>\n' +
            '            </td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">\n' +
            '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
            '                            <p style="margin: 0;">Hi ' +
            name +
            ',</p>\n' +
            '                          <p>Mã xác thực để đặt lại mật khẩu ở bên dưới:</p>\n' +
            '                        </td>\n' +
            '                    </tr>\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left">\n' +
            '                            <table width="100%" border="0" cellspacing="0" cellpadding="0">\n' +
            '                                <tr>\n' +
            '                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">\n' +
            '                                        <table border="0" cellspacing="0" cellpadding="0">\n' +
            '                                            <tr>\n' +
            '                                                <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><div target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block; letter-spacing: 10px; font-size: 50px;">' +
            code +
            '</div></td>\n' +
            '                                            </tr>\n' +
            '                                        </table>\n' +
            '                                    </td>\n' +
            '                                </tr>\n' +
            '                            </table>\n' +
            '                        </td>\n' +
            '                    </tr> <!-- COPY -->\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
            '                            <p style="margin: 0;">Vui lòng quay trở lại trang UTE Fast Food và nhập mã xác thực để hoàn tất quá trình!</p>\n' +
            '                        </td>\n' +
            '                    </tr> <!-- COPY -->\n' +
            '                    \n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
            '                            <p style="margin-top: 20px;">Nếu bạn có bất kỳ thắc mắc nào, hãy trả lời email này&mdash;Chúng tôi luôn sẵn lòng hỗ trợ bạn</p>\n' +
            '                        </td>\n' +
            '                    </tr>\n' +
            '                    <tr>\n' +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\n' +
            '                          <p style="margin: 0;">Cheers,</p>\n' +
            '                          \n' +
            '                          <h3 style="margin-top:10px;">The UTE Fast Food Store</h3>\n' +
            '                        </td>\n' +
            '                    </tr>\n' +
            '                </table>\n' +
            '            </td>\n' +
            '        </tr>\n' +
            '                         \n' +
            '    </table>\n' +
            '</body>\n' +
            '\n' +
            '</html>'
        )
    }

    htmlResetPassword(password) {
        return `<h1>Dear my friend,</h1><h2>Mật khẩu mới của bạn</h2><h3>${password}</h3><p>Bạn nên thay đổi mật khẩu sau khi đăng nhập</p><p>Vui lòng KHÔNG chia sẻ mật khẩu này với bất kỳ ai để bảo mật tài khoản của bạn!</p>`
    }

    async htmlOrderConfirmation(order) {
        try {
            var user
            var items = order['items']
            var content = ``
            const date = order['dateOrder']
            const estimate =
                new Date(date).getTime() +
                (Math.floor(Math.random() * 31) + 15) * 1000 * 60
            for (var index = 0; index < items.length; index++) {
                const product = await Product.findById(items[index]['product'])
                content += `<tr>
          <td width="25%" align="left"
              style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px 10px;">
              ${product['name']} (${items[index]['quantity']})
          </td>
          <td width="25%" align="left"
              style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px 10px;">
              ${this.formatCurrency(
                  items[index]['price'] * items[index]['quantity']
              )} 
          </td>
      </tr>`
            }
            user = await UserService.getUserById(order['user'])

            const start = `<!DOCTYPE html>
        <html>
        
        <head>
            <title></title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <style type="text/css">
                body,
                table,
                td,
                a {
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }
        
                table,
                td {
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                }
        
                img {
                    -ms-interpolation-mode: bicubic;
                }
        
                img {
                    border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
                }
        
                table {
                    border-collapse: collapse !important;
                }
        
                body {
                    height: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                }
        
        
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }
        
                @media screen and (max-width: 480px) {
                    .mobile-hide {
                        display: none !important;
                    }
        
                    .mobile-center {
                        text-align: center !important;
                    }
                }
        
                div[style*="margin: 16px 0;"] {
                    margin: 0 !important;
                }
            </style>
        
        <body style="margin: 0 !important; padding: 0 !important; background-color: #eeeeee;"
            bgcolor="#eeeeee">
        
        
            <div
                style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Open Sans, Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                For what reason would it be advisable for me to think about business content? That might be
                little bit risky to have crew member like them.
            </div>
        
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="background-color: #eeeeee;" bgcolor="#eeeeee">
        
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                            style="max-width:600px;">
                            <tr>
                                <td align="center" valign="top" style="font-size:0; padding: 35px;"
                                    bgcolor="#F44336">
        
                                    <div
                                        style="display:inline-block; max-width:50%; min-width:100px; vertical-align:top; width:100%;">
                                        <table align="left" border="0" cellpadding="0" cellspacing="0"
                                            width="100%" style="max-width:300px;">
                                            <tr>
                                                <td align="left" valign="top"
                                                    style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 36px; font-weight: 800; line-height: 48px;"
                                                    class="mobile-center">
                                                    <h1
                                                        style="font-size: 32px; font-weight: 800; margin: 0; color: #ffffff;">
                                                        UTE Fast Food</h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
        
                                    <div style="display:inline-block; max-width:50%; min-width:100px; vertical-align:top; width:100%;"
                                        class="mobile-hide">
                                        <table align="left" border="0" cellpadding="0" cellspacing="0"
                                            width="100%" style="max-width:300px;">
                                            <tr>
                                                <!-- <td align="right" valign="top"
                                                    style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; line-height: 48px;">
                                                    <table cellspacing="0" cellpadding="0" border="0"
                                                        align="right">
                                                        <tr>
                                                            <td
                                                                style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400;">
                                                                <p
                                                                    style="font-size: 18px; font-weight: 400; margin: 0; color: #ffffff;">
                                                                    <a href="#" target="_blank"
                                                                        style="color: #ffffff; text-decoration: none;">Website
                                                                        &nbsp;</a>
                                                                </p>
                                                            </td>
                                                            <td
                                                                style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 24px;">
                                                                <a href="#" target="_blank"
                                                                    style="color: #ffffff; text-decoration: none;"><img
                                                                        src="https://i.pinimg.com/474x/50/e9/b8/50e9b88bc4414ee161093b2c6e60d230.jpg"
                                                                        width="27" height="23"
                                                                        style="display: block; border: 0px;" /></a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td> -->
                                            </tr>
                                        </table>
                                    </div>
        
                                </td>
                            </tr>
                            <tr>
                                <td align="center"
                                    style="padding: 35px 35px 20px 35px; background-color: #ffffff;"
                                    bgcolor="#ffffff">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0"
                                        width="100%" style="max-width:600px;">
                                        <tr>
                                            <td align="center"
                                                style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding-top: 25px;">
                                                <img src="https://img.icons8.com/carbon-copy/100/000000/checked-checkbox.png"
                                                    width="125" height="120"
                                                    style="display: block; border: 0px;" /><br>
                                                <h2
                                                    style="font-size: 30px; font-weight: 800; line-height: 36px; color: #333333; margin: 0;">
                                                    Cảm ơn bạn vì đã đặt hàng!
                                                </h2>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="left"
                                                style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding-top: 10px;">
                                                <p
                                                    style="font-size: 16px; font-weight: 400; line-height: 24px; color: #777777;">
                                                    Hi ${user['fullName']}, UTE Fast Food xin gửi lời cảm ơn đến bạn vì đã
                                                    tin tưởng và ủng hộ cửa hàng. UTE Fast Food cam kết phục
                                                    vụ và mang lại trải nghiệm tốt nhất có thể dành cho bạn.
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="left" style="padding-top: 20px;">
                                                <table cellspacing="0" cellpadding="0" border="0"
                                                    width="100%">
                                                    <tr>
                                                        <td width="75%" align="left" bgcolor="#eeeeee"
                                                            style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px;">
                                                            Mã đơn hàng
                                                        </td>
                                                        <td width="25%" align="left" bgcolor="#eeeeee"
                                                            style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px;">
                                                            2345678
                                                        </td>
                                                    </tr>`
            const end = `<tr>
    <td width="75%" align="left"
        style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px;">
        Phí vận chuyển
    </td>
    <td width="25%" align="left"
        style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px;">
        ${this.formatCurrency(order['feeShip'])}
    </td>
</tr>
<tr>
    <td width="75%" align="left"
        style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px;">
        Chiết khấu
    </td>
    <td width="25%" align="left"
        style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px;">
        ${this.formatCurrency(order['discount'])}
    </td>
</tr>
<tr>
    <td width="75%" align="left"
        style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px;">
        VAT
    </td>
    <td width="25%" align="left"
        style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px;">
        ${this.formatCurrency(order['vat'])}
    </td>
</tr>
</table>
</td>
</tr>
<tr>
<td align="left" style="padding-top: 20px;">
<table cellspacing="0" cellpadding="0" border="0"
width="100%">
<tr>
    <td width="75%" align="left"
        style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px; border-top: 3px solid #eeeeee; border-bottom: 3px solid #eeeeee;">
        TỔNG CỘNG
    </td>
    <td width="25%" align="left"
        style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px; border-top: 3px solid #eeeeee; border-bottom: 3px solid #eeeeee;">
        ${this.formatCurrency(order['subtotal'])}
    </td>
</tr>
</table>
</td>
</tr>
</table>

</td>
</tr>
<tr>
<td align="center" height="100%" valign="top" width="100%"
style="padding: 0 35px 35px 35px; background-color: #ffffff;"
bgcolor="#ffffff">
<table align="center" border="0" cellpadding="0" cellspacing="0"
width="100%" style="max-width:660px;">
<tr>
<td align="center" valign="top" style="font-size:0;">
<div
style="display:inline-block; max-width:50%; min-width:240px; vertical-align:top; width:100%;">

<table align="left" border="0" cellpadding="0"
    cellspacing="0" width="100%"
    style="max-width:300px;">
    <tr>
        <td align="left" valign="top"
            style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">
            <p style="font-weight: 800;">Địa chỉ giao
                hàng</p>
            <p>${order['contact']['address']}<br>${
                order['contact']['ward']
            }<br> ${order['contact']['district']}
                <br>TP.HCM
            </p>

        </td>
    </tr>
</table>
</div>
<div
style="display:inline-block; max-width:50%; min-width:240px; vertical-align:top; width:100%;">
<table align="left" border="0" cellpadding="0"
    cellspacing="0" width="100%"
    style="max-width:300px;">
    <tr>
        <td align="left" valign="top"
            style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">
            <p style="font-weight: 800;">Dự kiến giao
                hàng</p>
            <p>${order['estimatedDelivery']}</p>
        </td>
    </tr>
</table>
</div>
</td>
</tr>
</table>
</td>
</tr>


</table>
</td>
</tr>
</table>

</body>

</html>`
            return start + ' \n' + content + ' \n' + end
        } catch (error) {
            throw error
        }
    }
    formatCurrency(value) {
        return Number(value).toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
        })
    }
}

module.exports = new EmailService()
