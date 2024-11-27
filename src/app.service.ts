import { Injectable } from '@nestjs/common';
import { DhittoService } from './dhitto/dhitto.service';
import { SalesService } from './sales/sales.service';
import { PrismaService } from './prisma.service';
import nodemailer from 'nodemailer';

@Injectable()
export class AppService {
    constructor(
        private readonly dhittoService: DhittoService,
        private readonly salesService: SalesService,
        private readonly prisma: PrismaService,
    ) {}

    async getEmail(data: string) {
        try {
            // Configure SMTP transport
            const transporter = nodemailer.createTransport({
                host: 'smtp.office365.com', // Replace with your SMTP server host
                port: 587, // SMTP port (typically 587 for TLS)
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'BraveLender@sewakgautam.com.np', // Replace with your SMTP user
                    pass: '#TimeForSkill', // Replace with your SMTP password
                },
                tls: {
                    ciphers: 'SSLv3',
                },
            });

            // Email options
            const mailOptions = {
                from: '"Sender Name" <your-email@example.com>', // Sender address
                to: data, // Receiver's email
                subject: 'Your Subject Here',
                text: 'Hello, this is a test email!', // Plain text body
                html: '<b>Hello, this is a test email!</b>', // HTML body
            };
            // Send email
            const info = await transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async getDashboardInfo(userId: string) {
        this.dhittoService.loanConversionAndInterestCalculation(userId);
        const totalCustomers = await this.dhittoService.countCustomers(userId);

        // const totalLilami = await this.prisma.dhitto.count({
        //     where: { status: 'LILAMI', Customer: { userId } },
        // });

        const totalSales = await this.salesService.totalSalesAmount(userId);

        const { totalPrincipal, totalInterest } =
            await this.dhittoService.getActiveTotalPrincipalAndInterest(userId);

        return {
            totalCustomers,
            totalPrincipal,
            totalInterest,
            totalLilami: 0,
            totalSales: totalSales._sum.total,
        };
    }
}
