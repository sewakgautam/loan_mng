import { Injectable } from '@nestjs/common';
import { DhittoStatus, Prisma } from '@prisma/client';
import { formatEmailReceiver } from 'src/notify/notify';
import { NotifyService } from 'src/notify/notify.service';
import { PrismaService } from 'src/prisma.service';
import { CommonGetterType } from 'src/types/common.type';
import { paginationOption } from 'src/utils/common';
import { tag } from 'src/utils/html-helper';
import { CreateLilamiDto } from './dto/create-lilami.dto';

@Injectable()
export class LilamiService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notify: NotifyService,
    ) {}

    // async totallilami(userId: string) {
    //     return this.prisma.lilami.count({ where: { id: userId } });
    // }

    async getLilamiDhittos(option: CommonGetterType) {
        return await this.prisma.paginationHelper(this.prisma.lilami, {
            ...paginationOption(option),
            orderBy: {
                createdAt: 'desc',
            },
            where: { dhitto: { status: DhittoStatus.LILAMI } },
            include: {
                dhitto: {
                    include: {
                        Customer: true,
                    },
                },
            },
        } satisfies Prisma.LilamiFindManyArgs);
    }

    async getOneLilami(lilamiId: string, userId: string) {
        return await this.prisma.lilami.findUnique({
            where: {
                id: lilamiId,
                dhitto: {
                    Customer: {
                        userId,
                    },
                },
            },
            include: {
                dhitto: true,
            },
        });
    }

    async deleteLilami(lilamiId: string, userId: string) {
        return await this.prisma.lilami.delete({
            where: {
                id: lilamiId,
                dhitto: {
                    Customer: {
                        userId,
                    },
                },
            },
        });
    }

    async lilamiThisDhitto(
        createLilamiDto: CreateLilamiDto,
        clientEmail: string,
        clientName: string,
    ) {
        const data = (
            await this.prisma.$transaction([
                this.prisma.dhitto.update({
                    where: {
                        id: createLilamiDto.dhittoId,
                    },
                    data: {
                        status: DhittoStatus.LILAMI,
                    },
                }),
                this.prisma.lilami.create({
                    data: createLilamiDto,
                    include: {
                        dhitto: {
                            include: {
                                Customer: true,
                            },
                        },
                    },
                }),
            ])
        )[1];

        return this.notify.notify(data, (d) => ({
            data: d,
            subject: `Customer ${d.dhitto.Customer.fullName} with Loan Id. ${d.dhitto.id} Is Auctioned`,
            to: formatEmailReceiver(clientName, clientEmail),
        }))((d) => {
            return {
                html: `

${tag('p', `Dear ${clientName},`)}
${tag('p', 'Warm greetings from Mero Pasal.')}
${tag('br')}
${tag('br')}
${tag(
    'b',
    `
धित्तो नं :- ${d.data.dhitto.id} 
${tag('br')}
${tag('br')}
सामन बिवरण:- ${d.data.dhitto.productName} 
${tag('br')}
${tag('br')}
आजको दर:- ${d.data.rate}
${tag('br')}
${tag('br')}
कैफियत:- ${d.data.remarks}
${tag('br')}
${tag('br')}

माथी उल्लेखित बिवरणहरु ग्रहक नं ${d.data.dhitto.customerId} को श्री ${
        d.data.dhitto.Customer.fullName
    } को रहेको छ, साथै माथी उल्लेखित सामान आज मिती ${
        d.data.bsDate
    } मा लीलाम गरीएको छ |
    `,
)}

${tag('br')}
${tag('br')}
${tag('br')}

${tag(
    'p',
    `
At your service,
${tag('br')}
Mero Pasal Dashboard
      `,
)}
${tag('br')}
${tag('br')}
${tag(
    'i',
    ' ATTN : This is a system generated email. Please do not reply to this mail id. Please discard this mail if you have already received the mail.',
)}
                `,
            };
        });
    }
}
