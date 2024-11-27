import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
    NotifyMePayload,
    NotifyOption,
    SMTPTransporter,
    TransformerReturnType,
} from './notify.type';

//

export const NOTIFY_TOKEN = Symbol('Notify_token');

export class Notify {
    private readonly transporter: SMTPTransporter;

    constructor(private option: NotifyOption) {
        this.transporter = createTransport(option.transportOption);
    }

    /**
     * @deprecated use notify method instead.
     */
    notifyMe<Data>() {
        console.log(this.option);
        return <T extends (...args: unknown[]) => NotifyMePayload<Data>>(
            cb: T,
        ) => notifyMe<Data>()(cb, this.transporter, this.option);
    }

    getOption() {
        return this.option;
    }

    notify<Data>(
        data: Data,
        transformer: (data: Data) => NotifyMePayload<Data>,
    ) {
        return _notify(data, transformer)(
            this.transporter,
            this.option.transportOption,
        );
    }
}

function notifyMe<Data>() {
    return <T extends (...args: unknown[]) => NotifyMePayload<Data>>(
        cb: T,
        transporter: SMTPTransporter,
        option: NotifyOption,
    ) => {
        return (...args: unknown[]) => {
            const data = cb(args);

            const defaultTransformerReturn = {
                ...option.transportOption,
                to: data.to,
                subject: data.subject,
            };

            return (
                transformer: (_data: typeof data) => TransformerReturnType = (
                    data,
                ) => {
                    return {
                        text: JSON.stringify(data.data),
                    };
                },
            ) => {
                transporter.sendMail(
                    {
                        ...defaultTransformerReturn,
                        ...transformer(data),
                    },
                    (err: Error, info: SMTPTransport.SentMessageInfo) => {
                        console.log(err, info);
                    },
                );
                return data.data;
            };
        };
    };
}

export function formatEmailReceiver(username: string, email: string) {
    return `${username} <${email}>` as const;
}

function _notify<Data>(
    data: Data,
    transformer: (data: Data) => NotifyMePayload<Data>,
) {
    const transformed = transformer(data);
    return (
            transporter: SMTPTransporter,
            option: NotifyOption['transportOption'],
        ) =>
        (
            modeler: (
                data: ReturnType<typeof transformer>,
            ) => TransformerReturnType = (data) => ({
                text: data.data,
            }),
        ) => {
            const opts = {
                ...option,
                to: transformed.to,
                subject: transformed.subject,
                ...modeler(transformed),
            };
            transporter.sendMail(
                opts,
                (err: Error, info: SMTPTransport.SentMessageInfo) => {
                    console.log(err, info);
                },
            );
            return transformed.data;
        };
}
