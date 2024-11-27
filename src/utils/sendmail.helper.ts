// import { SMTP } from 'config';
import { createTransport, SendMailOptions } from 'nodemailer';

const transporter = createTransport({
    host: 'smtp.office365.com', 
    port: 587,
    secure: false, 
    auth: {
        user: 'BraveLender@sewakgautam.com.np', 
        pass: '#TimeForSkill', 
    },
    tls: {
        ciphers: 'SSLv3',
    },
});

export const sendMail = async (options: SendMailOptions) => {
    console.log('Mail Sending Process initiated');
    try {
        options.from = `BraveLenderNoreply BraveLender@sewakgautam.com.np`; // '"project name" "mail sender email"'
        options.html = options.text;
        const result = await transporter.sendMail(options);
        // console.error(
        //     '------------------- [[ SEND MAIL RESULT START ]] -------------------\n',
        //     result,
        //     '\n-------------------- [[ SEND MAIL RESULT END ]] ------------------- ',
        // );
    } catch (err) {
        // console.error(
        //     '------------------- [[ SEND MAIL ERROR START ]] -------------------\n',
        //     err,
        //     '\n-------------------- [[ SEND MAIL ERROR END ]] ------------------- ',
        // );
    }
};
