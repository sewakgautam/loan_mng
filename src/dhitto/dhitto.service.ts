import { Injectable } from '@nestjs/common';
import { CreateCustomerDto, CreateDhittoDto } from './dto/create-dhitto.dto';
import { UpdateCustomerDto } from './dto/update-dhitto.dto';
import { PrismaService } from 'src/prisma.service';
import {
    Dhitto,
    DhittoAccumulation,
    DhittoStatus,
    Prisma,
} from '@prisma/client';
import { CreateStatementDto } from './dto/create-statement.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

import { currencyToWords, fixed } from 'src/utils/number';
import { renderHtmlFromFile } from 'src/utils/read-file';
import { dayjs, formatDate } from 'src/utils/date';
import { burn } from 'src/utils/burn';
import { NotifyService } from 'src/notify/notify.service';
import { formatEmailReceiver } from '../notify/notify';
import { CommonGetterType } from 'src/types/common.type';
import { defaultPaginationOption } from 'src/utils/default';
import { changePageCapToSkip, paginationOption } from 'src/utils/common';
import { LogicalError } from 'src/utils/error';
import { tag } from 'src/utils/html-helper';

@Injectable()
export class DhittoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notify: NotifyService,
    ) {}
    async createDhitto(
        createDhittoDto: CreateDhittoDto,
        customerId: string,
        clientEmail: string,
        clientName: string,
    ) {
        const days = this.dateDiffInDay(dayjs(createDhittoDto.date).utc()) + 1;
        const perDayAccum = this.calculatePerDayInterest(
            createDhittoDto.principalAmount,
            createDhittoDto.interestPercentage,
        );
        const calculated = this.calculateTransactionOnCycle(
            days,
            createDhittoDto.principalAmount,
            0,
            createDhittoDto.interestPercentage,
        );

        const createArray = [
            {
                credit: 0,
                debit: createDhittoDto.principalAmount,
                remark: `Loan granted for product ${createDhittoDto.productName}.`,
                bsDate: createDhittoDto.bsDate,
                interest: fixed(() => perDayAccum),
            },
        ];

        if (calculated.cycle > 0) {
            const statementData = {
                debit: calculated.principalIncremented,
                credit: 0,
                remark: `Unpaid interest for ${
                    calculated.cycle * 90
                } days added to principal`,
                bsDate: createDhittoDto.bsDate,
                interest: calculated.interest,
            };
            createArray.push(statementData);
        }

        /*
         *
         * this should not occur. If it is the case, we need to fix the bug.
         * */
        if (calculated.principal < 0 || calculated.interest < 0) {
            console.log(
                'LOGICAL ERROR: this is possibly a error plase contact to the admin.',
            );
            throw new LogicalError(
                'SYS_ERR: this is a system error, please contact to admin.',
                {
                    calculated,
                },
            );
        }

        const data = await this.prisma.dhitto.create({
            data: {
                ...createDhittoDto,
                customerId,
                statements: {
                    create: createArray,
                },
                DhittoAccumulation: {
                    create: {
                        accPrincipal: calculated.principal,
                        accInterest: calculated.interest,
                        /*
                         * if cycle has occured, it means the accumulated interest will be added to the the principal.
                         * If that happens, we will assume that 90 days cycle will start from today.
                         *
                         * Previously, it was not the case, and we get negative value, which was a bug.
                         * */
                        updatedAt:
                            calculated.cycle > 0
                                ? dayjs.utc().toDate()
                                : dayjs.utc(createDhittoDto.date).toDate(),
                        accumTill: dayjs.utc().add(1, 'day').toDate(),
                    },
                },
            },
            include: {
                Customer: true,
            },
        });

        return this.notify.notify(data, (data) => {
            return {
                to: formatEmailReceiver(clientName, clientEmail),
                subject: `ग्रहक श्री ${data.Customer.fullName} को नाममा नायँ धितो जारी गरीएको छ `,
                data,
            };
        })((data) => {
            return {
                html: `

${tag('p', `Dear ${clientName},`)}
${tag('p', 'Warm greetings from Mero Pasal Dashboard.')}
${tag('br')}
${tag('br')}

ग्रहाक नं: ${data.data.Customer.identity}, श्री ${
                    data.data.Customer.fullName
                } ले 
आज मिती का दिन (${data.data.productName}) यो उल्लेखित सामान धितो राखी रु ${
                    data.data.principalAmount
                },  ${
                    data.data.interestPercentage
                }% ब्यजदर मा हाम्रो पसल वाट रकम लिनु भएको छ |        
    

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

    async createCustomer(createCustomerDto: CreateCustomerDto, userId: string) {
        return await this.prisma.customer.create({
            data: { ...createCustomerDto, userId },
        });
    }

    async deleteStatement(
        customerId: string,
        dhittoId: string,
        statementId: string,
    ) {
        return await this.prisma.dhittoStatement.delete({
            where: {
                id: statementId,
                Dhitto: {
                    id: dhittoId,
                    customerId,
                },
            },
        });
    }

    async findCustomerDhittos(
        customerId: string,
        option: CommonGetterType,
        userId: string,
    ) {
        const dhittos = await this.prisma.paginationHelper(this.prisma.dhitto, {
            ...paginationOption(option),
            orderBy: {
                createdAt: 'desc',
            },
            where: { customerId, Customer: { userId } },
        } satisfies Prisma.DhittoFindManyArgs);
        return dhittos;
    }

    async findCustomerDetail(
        customerId: string,
        userId: string,
        option: CommonGetterType,
    ) {
        const count = await this.prisma.dhitto.count({
            where: {
                Customer: {
                    id: customerId,
                    userId,
                },
            },
        });
        const customer = await this.prisma.customer.findFirst({
            where: { id: customerId, userId },
            include: {
                dhitto: {
                    ...paginationOption(option),
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        DhittoAccumulation: true,
                    },
                },
            },
        });

        const { totalPrincipal, totalInterest } =
            await this.getActiveTotalPrincipalAndInterest(userId, customerId);

        return { ...customer, count, totalPrincipal, totalInterest };
    }

    async countCustomers(userId: string) {
        return await this.prisma.customer.count({ where: { userId } });
    }

    async getActiveTotalPrincipalAndInterest(
        userId: string,
        customerId?: string,
    ) {
        const data = await this.prisma.dhitto.findMany({
            where: {
                status: 'SAFE',
                Customer: {
                    id: customerId,
                    userId,
                },
            },
            include: { DhittoAccumulation: true },
        });
        const total = data.reduce(
            (prev, curr) => {
                return {
                    totalPrincipal:
                        prev.totalPrincipal +
                        curr.DhittoAccumulation.accPrincipal,
                    totalInterest:
                        prev.totalInterest +
                        curr.DhittoAccumulation.accInterest,
                };
            },
            {
                totalPrincipal: 0,
                totalInterest: 0,
            } as const,
        );

        return total;
    }

    async findCustomers(
        option: CommonGetterType,
        userId: string,
        skipOption = false,
    ) {
        const { skip, take } = changePageCapToSkip(
            defaultPaginationOption(option),
        );

        const paginationOption = skipOption ? undefined : { skip, take };

        const findManyArgs = Prisma.validator<Prisma.CustomerFindManyArgs>()({
            ...paginationOption,
            orderBy: {
                createdAt: 'asc',
            },
            where: {
                userId,
                ...(() => {
                    if (option.search && option.search.length) {
                        const d = {
                            OR: [
                                {
                                    fullName: {
                                        contains: option.search,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        } as Prisma.CustomerWhereInput;

                        if (!Number.isNaN(+option.search)) {
                            const onNumber = {
                                identity: {
                                    equals: +option.search,
                                },
                            };
                            d.OR.push(onNumber);
                        }

                        return d;
                    }
                })(),
            },
            include: {
                dhitto: {
                    where: {
                        status: DhittoStatus.SAFE,
                    },
                    include: {
                        DhittoAccumulation: true,
                    },
                },
            },
        });

        const { data, count } = await this.prisma.paginationHelper(
            this.prisma.customer,
            findManyArgs,
        );

        return {
            data: data.map((customer) => {
                const total = customer.dhitto.reduce(
                    (prev, curr) => {
                        return {
                            totalPrincipal:
                                prev.totalPrincipal +
                                curr.DhittoAccumulation.accPrincipal,
                            totalInterest:
                                prev.totalInterest +
                                curr.DhittoAccumulation.accInterest,
                        };
                    },
                    {
                        totalPrincipal: 0,
                        totalInterest: 0,
                    } as const,
                );
                return {
                    ...customer,
                    ...total,
                };
            }),
            count,
        };
    }

    async findAllDhittoOfTaker(takerId: string) {
        return await this.prisma.dhitto.findMany({
            where: { customerId: takerId },
        });
    }

    async findOnedhitto(dhittoId: string) {
        return await this.prisma.dhitto.findUnique({
            where: {
                id: dhittoId,
            },
            include: {
                Customer: { include: { User: true } },
            },
        });
    }

    findOne(id: number) {
        return `This action returns a #${id} dhitto`;
    }

    async updateCustomer(id: string, updateDhittoDto: UpdateCustomerDto) {
        return this.prisma.customer.update({
            data: updateDhittoDto,
            where: { id },
        });
    }

    removeCustomer(id: string) {
        return this.prisma.customer.delete({ where: { id } });
    }

    async getDhitoHistory(historyData: {
        customerId: string;
        startDate: string;
        endDate: string;
    }) {
        const { customerId, startDate, endDate } = historyData;
        return await this.prisma.dhittoAccumulation.findMany({
            where: {
                dhitto: { customerId },
                createdAt: {
                    gte: new Date(startDate), // Start date (inclusive)
                    lte: new Date(endDate), // End date (inclusive)
                },
            },
            select: { dhitto: true },
        });
    }

    async getDhittoStatement(
        customerId: string,
        dhittoId: string,
        option: CommonGetterType,
    ) {
        return await this.prisma.paginationHelper(this.prisma.dhittoStatement, {
            ...paginationOption(option),
            where: {
                dhittoId,
                Dhitto: {
                    customerId,
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        } satisfies Prisma.DhittoStatementFindManyArgs);
    }

    async getLastStatement(customerId: string, dhittoId: string) {
        return await this.prisma.dhittoStatement.findFirst({
            where: {
                dhittoId,
                Dhitto: {
                    customerId,
                },
            },
        });
    }

    private calculateTransactionOnCycle(
        daysLasted: number,
        currentPrincipal: number,
        currentInterest: number,
        interestPer: number,
    ) {
        const result = fixed(() => {
            const cycle = Math.floor(daysLasted / 90); // did cycle start
            const days = daysLasted - cycle * 90; // what is my remaining days after cycle is completed?

            const _a = 1 + interestPer / 400;

            // a = \% / 4
            // _a = 1 + a
            // P(_a + c)(_a)^(n-1)

            const principal =
                cycle > 0
                    ? currentPrincipal *
                      (_a + currentInterest) *
                      Math.pow(_a, cycle - 1)
                    : currentPrincipal;

            const _currentInterest = cycle > 0 ? 0 : currentInterest;
            const interest =
                this.calculatePerDayInterest(principal, interestPer) * days +
                _currentInterest;
            return {
                principal,
                interest,
                cycle,
                days,
                principalIncremented: principal - currentPrincipal,
                interestIncremented: interest - currentInterest,
            };
        });
        return result;
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async loanConversionAndInterestCalculation(userId?: string) {
        // todo: optimization needed
        // todo: refactoring needed

        let where = {} satisfies Prisma.DhittoWhereInput;
        if (userId) {
            where = { Customer: { userId } };
        }

        const _dhittos = await this.prisma.dhitto.findMany({
            skip: 0,
            take: 100, // batch first one 100
            where: {
                status: DhittoStatus.SAFE,
                ...where,
            },
            include: {
                DhittoAccumulation: true,
            },
            orderBy: {
                DhittoAccumulation: {
                    accumTill: 'asc',
                },
            },
        });

        // filter out such dhittos, whose last accum clock is not sync with today.
        const dhittos = _dhittos.filter((dhitto) => {
            const day = this.dateDiffInDay(dhitto.DhittoAccumulation.accumTill);
            return day >= 0;
        });

        if (!dhittos.length) return console.log(' ==== dhittos empty ====');
        else {
            console.log('dhitto update');
        }

        const updateMany = dhittos.map((dhitto) => {
            // stale date till today
            let staleDateDiff =
                this.dateDiffInDay(dhitto.DhittoAccumulation.accumTill) + 1;

            let _cycle = 0;

            const deltaDayTillToday =
                this.dateDiffInDay(dhitto.DhittoAccumulation.updatedAt) + 1;

            let accInterest = dhitto.DhittoAccumulation.accInterest;
            let accPrincipal = dhitto.DhittoAccumulation.accPrincipal;
            let pInc = 0;

            /*
             *
             * for our implementation purpose, this value should never be less than 0.
             * if it is occuring, it means only one thing at that is a bug.
             * */
            if (staleDateDiff < 0 || deltaDayTillToday < 0) {
                console.log('ERR: stale date are negative value.');
                throw new LogicalError('Error: stale date are negative value', {
                    staleDateDiff,
                    deltaDayTillToday,
                });
            }

            /*
             *
             *  if 90 days / 1 cycle has not exceeded before accumulation synchonization it is good to go.
             *  We can simply get the accumulation of stale date.
             *
             *  However, if it exceeds 90 or more, then we need to take into consideration of additional state.
             *
             *  First, we need to calculate the interest accumulation of first 89 days. Since, it also includes accumTill,
             *  we need to cancel that out. Or simply calculate interest of accumTill - 89 days for the last payment.
             *
             *  After calculating the interest, add it to the accInterest field
             *
             *
             *  Update:
             *  let's settle first 90 days payment. and make the function do the rest.
             *
             *
             * */
            if (deltaDayTillToday >= 90) {
                _cycle = 1;
                staleDateDiff = deltaDayTillToday;
                // date of 90 days from last payment
                const first90days = dayjs
                    .utc(dhitto.DhittoAccumulation.updatedAt)
                    .add(89, 'day');

                const staleDay =
                    this.dateDiffInDay(
                        dayjs.utc(dhitto.DhittoAccumulation.accumTill),
                        first90days,
                    ) + 1;

                /*
                 *
                 * staleDay should not be less than 0, as this will never ever occured!
                 * If this is the case, the code has bug and it SHOULD be fixed ASAP.
                 *
                 *
                 * */
                if (staleDay < 0) {
                    console.log('ERROR: something horribly got wrong');
                    // todo!: send log to admin.
                    throw new LogicalError('Error: stale day is NEGATIVE', {
                        staleDay,
                        first90days,
                        dhitto,
                    });
                }

                accInterest +=
                    this.calculatePerDayInterest(
                        dhitto.DhittoAccumulation.accPrincipal,
                        dhitto.interestPercentage,
                    ) * staleDay;

                pInc = accInterest;
                accPrincipal += accInterest;
                accInterest = 0;
                /*
                 * since first cycle is computed, we can safely minus 90 days which is one cycle.
                 * */
                staleDateDiff -= 90;
            }

            const { principal, interest, cycle, principalIncremented } =
                this.calculateTransactionOnCycle(
                    staleDateDiff,
                    accPrincipal,
                    accInterest,
                    dhitto.interestPercentage,
                );

            /*
             *
             * These computed value should never be  less than 0. If that happens, it is likely a bug.
             * */
            if (principal < 0 || interest < 0 || principalIncremented < 0) {
                throw new LogicalError('Negative value when not expected', {
                    principal,
                    interest,
                    principalIncremented,
                    cycle,
                });
            }

            return this.prisma.dhitto.update({
                where: {
                    id: dhitto.id,
                    status: DhittoStatus.SAFE,
                },
                data: {
                    DhittoAccumulation: {
                        update: (() => {
                            const data = {
                                accPrincipal: principal,
                                accInterest: interest,
                                accumTill: dayjs.utc().add(1, 'day').toDate(),
                            } as Prisma.DhittoAccumulationUpdateArgs['data'];

                            if (_cycle > 0) {
                                data.updatedAt = dayjs.utc().toDate();
                            }
                            return data;
                        })(),
                    },
                    ...(() => {
                        if (_cycle <= 0) return;
                        return {
                            statements: {
                                create: {
                                    debit: fixed(
                                        () => pInc + principalIncremented,
                                    ),
                                    credit: 0,
                                    remark: `Unpaid interest added on principal after ${
                                        (cycle + _cycle) * 90
                                    } days.`,
                                    interest: interest,
                                },
                            },
                        };
                    })(),
                },
            });
        });
        await this.prisma.$transaction(updateMany);
    }

    async loanPayment(
        customerId: string,
        dhittoId: string,
        createStatementDto: CreateStatementDto,
        sub: string,
        clientEmail: string,
        clientName: string,
    ) {
        // todo: validate if the dhitto is associated with the customer

        const dhitto = await this.prisma.dhitto.findFirstOrThrow({
            where: {
                id: dhittoId,
                customerId,
                status: DhittoStatus.SAFE,
                Customer: {
                    userId: sub,
                },
            },
            include: {
                DhittoAccumulation: true,
            },
        });

        const paymentPayed = this.separatePrincipalAndInterestPayment(
            dhitto,
            createStatementDto.amount,
        );

        const update = {
            where: {
                dhittoId,
                dhitto: {
                    status: DhittoStatus.SAFE,
                },
            },
            data: {
                dhitto: {},
                accInterest: {
                    decrement: paymentPayed.interestPayed,
                },
                accPrincipal: {
                    decrement: paymentPayed.principalPayed,
                },
                updatedAt: dayjs.utc().toDate(),
            },
        } satisfies Prisma.DhittoAccumulationUpdateArgs;

        if (
            paymentPayed.principalPayed -
                dhitto.DhittoAccumulation.accPrincipal +
                dhitto.DhittoAccumulation.accInterest -
                paymentPayed.interestPayed ===
            0
        ) {
            update.data.dhitto = {
                update: {
                    status: DhittoStatus.SETTLED,
                },
            };
        }

        const [statement] = await this.prisma.$transaction([
            this.prisma.dhittoStatement.create({
                data: {
                    remark: 'Payment done', // todo: change remark
                    dhittoId,
                    credit: createStatementDto.amount,
                    debit: 0,
                    interest:
                        dhitto.DhittoAccumulation.accInterest -
                        paymentPayed.interestPayed,
                    bsDate: createStatementDto.bsDate,
                },
                include: {
                    Dhitto: {
                        include: {
                            Customer: true,
                        },
                    },
                },
            }),

            this.prisma.dhittoAccumulation.update(update),
        ]);

        this.notify.notify(statement, () => ({
            data: statement,
            to: formatEmailReceiver(clientName, clientEmail),
            subject: `ग्रहक श्री ${statement.Dhitto.Customer.fullName} ले रकम जम्मा गर्नु भएको छ | `,
        }))((data) => ({
            html: `

${tag('p', `Dear ${clientName},`)}
${tag('p', 'Warm greetings from Mero Pasal.')}
${tag('br')}
${tag('br')}


ग्रहाक नं: <b>${data.data.Dhitto.Customer.identity}</b>, श्री <b>${
                data.data.Dhitto.Customer.fullName
            } ले धितो नं <b>${data.data.dhittoId}</b> मा रहेको सामान <b>(${
                data.data.Dhitto.productName
            })</b> को 
आज मिती का दिन रु <b>${paymentPayed.interestPayed}</b> ब्यज र रु <b>${
                paymentPayed.principalPayed
            }</b> साँवा रकम गरी, जम्मा रकम रु ${
                paymentPayed.interestPayed + paymentPayed.principalPayed
            } बुजाउनु भएको छ |
    
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
        }));

        return burn({ ...paymentPayed, id: statement.id });
    }

    async getDataForBill(statementId: string) {
        const statement = await this.prisma.dhittoStatement.findFirstOrThrow({
            where: {
                id: statementId,
            },
            include: {
                Dhitto: {
                    include: {
                        DhittoAccumulation: true,
                        Customer: { include: { User: true } },
                    },
                },
            },
        });
        return statement;
    }

    calculatePerDayInterest(principal: number, interest: number) {
        return (principal * interest) / 36000;
    }

    /**
     * Separates the principal and interest payment based on the given amount.
     *
     * @param {Dhitto} dhitto - The Dhitto object containing the principal and interest values.
     * @param {number} amount - The amount to be paid.
     * @return {Object} An object containing the principalPayed and interestPayed values.
     */
    private separatePrincipalAndInterestPayment(
        dhitto: Dhitto & { DhittoAccumulation: DhittoAccumulation },
        amount: number,
    ): {
        readonly principalPayed: number;
        readonly interestPayed: number;
    } {
        const interest = dhitto.DhittoAccumulation.accInterest;

        const paymentLeftOver = interest - amount;

        let principalPayed = 0;
        let interestPayed = interest;

        if (paymentLeftOver < 0) principalPayed = Math.abs(paymentLeftOver);
        else interestPayed = amount;

        return {
            principalPayed,
            interestPayed,
        } as const;
    }

    private dateDiffInDay(
        startDate: Date | dayjs.Dayjs,
        endDate: Date | dayjs.Dayjs = dayjs.utc().toDate(),
    ) {
        // todo!: should fix?
        /*
         * Why offset to 1;
         * -> If you want to consider, diff of today as 1, you can add offset to 1. However, set it to 0, if diff(today, today) wants to be 0,
         *  diff(today, today) => 1, then, set offset to 1
         *  diff(today, today) => 0, then, set offset to 0
         * */
        const offset = 0;
        return (
            dayjs
                .utc(endDate)
                .startOf('d')
                .diff(dayjs.utc(startDate).startOf('d'), 'day') + offset
        );
    }

    async generateDhittoBillHtml(id: string) {
        const dhittoResult = await this.findOnedhitto(id);
        if (!dhittoResult || !dhittoResult.Customer) {
            throw new Error(`Customer data not found for id ${id}`);
        }

        const { Customer, ...dhitto } = dhittoResult;
        console.log(dhitto);
        return renderHtmlFromFile('dhitto-bill-template.mustache', {
            product: {
                ...dhitto,
                id: dhitto.id.substring(0, dhitto.id.indexOf('-')),
                date: formatDate(dhitto.date),
            },
            customer: Customer,
            user: Customer.User,
        });
    }

    async generatePaymentBill(option: {
        interestPayed: number;
        principalPayed: number;
        id: string;
    }) {
        const statement = await this.getDataForBill(option.id);
        return renderHtmlFromFile('payment-template.mustache', {
            customer: statement.Dhitto.Customer,
            user: statement.Dhitto.Customer.User,
            product: {
                ...statement.Dhitto,
                id: statement.dhittoId.substring(
                    0,
                    statement.dhittoId.indexOf('-'),
                ),
                name: statement.Dhitto.productName,
                principalPayed: option.principalPayed,
                interestPayed: option.interestPayed,
                date: formatDate(statement.updatedAt),
                bsDate: statement.bsDate,
                amount: statement.credit,
                amountInWords: currencyToWords(statement.credit),
            },
            principalRemain: statement.Dhitto.DhittoAccumulation.accPrincipal,
            interestRemain: statement.Dhitto.DhittoAccumulation.accInterest,
            totalRemain:
                statement.Dhitto.DhittoAccumulation.accPrincipal +
                statement.Dhitto.DhittoAccumulation.accInterest,
        });
    }
}
