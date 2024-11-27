import { Global, Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';
import { formatEmailReceiver, Notify, NOTIFY_TOKEN } from './notify';

@Global()
@Module({
    controllers: [NotifyController],
    providers: [
        NotifyService,
        {
            provide: NOTIFY_TOKEN,
            useFactory() {
                const SMTP_HOST = 'smtp.office365.com';
                const SMTP_PORT = '587';
                const SMTP_USER = 'noreply@wandermate.me';
                const SMTP_PASS = 'Belb@ri8';
                const notify = new Notify({
                    transportOption: {
                        debug: true,
                        host: SMTP_HOST,
                        port: +SMTP_PORT,
                        secure: false,
                        tls: {
                            ciphers: 'SSLv3',
                        },
                        // from: formatEmailReceiver(
                        //     'Mero Pasal Dashboard',
                        //     SMTP_USER,
                        // ),
                        headers: {
                            'BIMI-Location':
                                'https://amplify.valimail.com/bimi/valimail/ekURFPbPVyt-valimail_inc_256301583.svg',
                        },
                        from: {
                            name: 'Mero Pasal Dashboard',
                            address: SMTP_USER,
                            // Optionally, include the thumbnail in the "From" field
                        },
                        auth: {
                            user: SMTP_USER,
                            pass: SMTP_PASS,
                        },
                    },
                });

                return notify;
            },
        },
    ],
    exports: [NotifyService],
})
export class NotifyModule {}
