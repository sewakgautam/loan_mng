import { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export type SMTPTransporter = Transporter<SMTPTransport.SentMessageInfo>;

export type TransformerReturnType = Mail.Options;

export type NotifyOption = {
    transportOption: SMTPTransport.Options;
};

export type NotifyMePayload<T> = {
    data: T;
    subject: string;
    to: TransformerReturnType['to'];
};
