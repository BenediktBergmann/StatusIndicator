const { EMAIL_ON, EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_TO } = require('./../helper/config');
import nodemailer from 'nodemailer';

export class mailService {
    sendEmail(to: string, subject: string, text: string): void{
        if(EMAIL_ON === "true"){
            const transporter = this.setup();
    
            const message = {
                from: "statusindicator@benediktbergmann.eu",
                to: to,
                subject: subject,
                text: text
            }
        
            transporter.sendMail(message, function(err: any, info: any) {
                if (err) {
                  console.log(err)
                } else {
                  console.log(info);
                }
            });
        }
    };

    sendLoginEmail(expiresOn: string, message: string): void {
        var message = `Hej,
this is your StatusIndicator light.
You need to login otherwise I am unable to display your current status.
${message}
The key expires on ${expiresOn}.

Best regards
Your SatusIndicator`;
        this.sendEmail(EMAIL_TO, "StatusIdicator: Please Login", message);
    };

    private setup() {
        return nodemailer.createTransport({
            host: EMAIL_HOST,
            port: EMAIL_PORT,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD
            }
        });
    }
}