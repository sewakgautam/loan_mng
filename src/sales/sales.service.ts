import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { PrismaService } from 'src/prisma.service';
import { renderHtmlFromFile } from 'src/utils/read-file';
import { burn } from 'src/utils/burn';
import { ReturnValue, currencyToWords } from 'src/utils/number';
import { formatDate } from 'src/utils/date';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalesService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(userId: string) {
        const saleUsers = await this.prisma.paginationHelper(
            this.prisma.saleUser,
            {
                where: {
                    userId,
                },
                include: {
                    saleGoods: true,
                },
            } satisfies Prisma.SaleUserFindManyArgs,
        );

        const result = saleUsers.data.map((saleUser) => {
            const totalAmount = saleUser.saleGoods.reduce(
                (sum, saleGood) => sum + saleGood.total,
                0,
            );

            return {
                ...saleUser,
                totalAmount: totalAmount,
            };
        });

        return { data: result, count: saleUsers.count };
    }

    async totalSalesAmount(userId: string) {
        return await this.prisma.saleGood.aggregate({
            where: {
                SaleUser: {
                    User: {
                        id: userId,
                    },
                },
            },
            _sum: {
                total: true,
            },
        });
    }

    async createSale(
        { goods, ...createSaleDto }: CreateSaleDto,
        userId: string,
    ) {
        const computedGoods = goods.map((good) => {
            // const perGram = good.rate / 11.664;
            //
            // const costOfWeight = perGram * good.weight;
            //
            // const mfgCost = costOfWeight * 0.09;
            //
            // const total = costOfWeight + mfgCost + good.makingCharge;
            //
            return {
                ...good,
                amount: ReturnValue(good.amount),
                total: ReturnValue(good.total),
                mfgCost: ReturnValue(good.mfgCost),
            };
        });

        const sale = await this.prisma.saleUser.create({
            data: {
                ...createSaleDto,
                userId,
                saleGoods: {
                    create: computedGoods,
                },
            },
        });

        return burn(sale.id + '');
    }

    async deleteSale(saleUserId: string, clientId: string) {
        return await this.prisma.saleUser.delete({
            where: {
                id: saleUserId,
                userId: clientId,
            },
        });
    }

    async findSaleById(id: string) {
        const sale = await this.prisma.saleUser.findFirst({
            where: { id },
            include: {
                saleGoods: true,
                User: true,
            },
        });

        const totalAmount = sale.saleGoods.reduce((prev, curr) => {
            return prev + curr.total;
        }, 0);

        return { ...sale, totalAmount };
    }

    async generateSalesBillHTML(id: string) {
        try {
            const { saleGoods: sales, ...user } = await this.findSaleById(id);

            const rendered = renderHtmlFromFile(
                'sales-bill-template.mustache',
                {
                    meta: {
                        companyName: 'Ramesh Jwellary',
                        companyAddress: 'Kathmandu',
                    },
                    heading: [
                        'SN',
                        'Description',
                        'Weight',
                        'Rate',
                        'Amount',
                        'mfgCost',
                        'makingCharge',
                        'Total',
                    ],
                    user: {
                        ...user,
                        totalAmount: ReturnValue(user.totalAmount),
                        date: formatDate(user.date),
                    },
                    sales: sales.map((sale, index) => ({
                        ...sale,
                        id: index + 1,
                        amount: sale.amount.toFixed(2),
                        mfgCost: sale.mfgCost.toFixed(2),
                        total: sale.total.toFixed(2),
                    })),
                    amountInWord: currencyToWords(user.totalAmount),
                    terms: [
                        'गहना सादा वा बिक्री गर्दा बिल अनिवार्य रुपमा लिई आउनु पर्नेछ ।',
                        'विक्री गर्दा वा सादा ज्याला, जर्ति, रसायन, पत्थरको मूल्य फिर्ता हुनेछैन ।',
                        'रसायनवाला माल पसलले खरिद गर्दा गहना अनुसार ५% देखि १०% सम्म काटिने छ ।',
                    ],
                },
            );
            return rendered;
        } catch (err) {
            throw err;
        }
    }
}
