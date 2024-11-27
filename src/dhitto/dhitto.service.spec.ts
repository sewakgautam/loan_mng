import { Test, TestingModule } from '@nestjs/testing';
import { DhittoService } from './dhitto.service';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma.service';

import { Prisma } from '@prisma/client';

describe('DhittoService', () => {
    let service: DhittoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DhittoService, PrismaService],
        }).compile();

        service = module.get<DhittoService>(DhittoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // write a test for service dateDiffInDay()
    it('should return the difference between two dates in days', () => {
        const result = service.dateDiffInDay(
            dayjs('2024-01-01'),
            dayjs('2024-01-04'),
        );
        expect(result).toBe(3);
        expect(
            service.dateDiffInDay(dayjs('2024-01-01'), dayjs('2024-01-01')),
        ).toBe(0);

        expect(service.dateDiffInDay(dayjs(), dayjs().add(2, 'day'))).toBe(2);
    });

    it('should separate principal and interest', () => {
        const payment = service.separatePrincipalAndInterestPayment(
            {
                conversionPeriod: new Date(),
                customerId: 0,
                date: new Date(),
                id: 1,
                interestPercentage: 10,
                principalAmount: 2000,
                productName: 'car loan',
                DhittoAccumulation: {
                    accInterest: 200,
                    accPrincipal: 2000,
                    id: 1,
                    updatedAt: new Date(),
                    dhittoId: 2,
                },
            },
            200,
        );

        expect(payment.interestPayed).toBe(200);
        expect(payment.principalPayed).toBe(0);

        const payment1 = service.separatePrincipalAndInterestPayment(
            {
                conversionPeriod: new Date(),
                customerId: 0,
                date: new Date(),
                id: 1,
                interestPercentage: 10,
                principalAmount: 2000,
                productName: 'car loan',
                DhittoAccumulation: {
                    accInterest: 0,
                    accPrincipal: 2000,
                    id: 1,
                    updatedAt: new Date(),
                    dhittoId: 2,
                },
            },
            300,
        );

        expect(payment1.interestPayed).toBe(0);
        expect(payment1.principalPayed).toBe(300);
    });

    describe('isTodayConversionPeriod', () => {
        test('should return true when dayDiff is equal to conversionDay and accInterest is greater than 0', () => {
            const dhitto = {
                conversionPeriod: dayjs().subtract(2, 'day').toDate(), // Provide a valid date for conversionPeriod
                id: 2,
                customerId: 2,
                date: new Date(),
                interestPercentage: 10,
                principalAmount: 200,
                productName: 'car loan',
                DhittoAccumulation: {
                    updatedAt: new Date(),
                    accInterest: 10, // Provide a valid value for accInterest
                    id: 12,
                    accPrincipal: 200,
                    dhittoId: 2,
                },
            } satisfies Prisma.DhittoGetPayload<{
                include: { DhittoAccumulation: true };
            }>;

            const result = service.isTodayConversionPeriod(dhitto, 2);

            expect(result).toBe(true);
        });

        test('should return false when dayDiff is not equal to conversionDay', () => {
            const dhitto = {
                id: 2,
                customerId: 2,
                date: new Date(),
                interestPercentage: 10,
                principalAmount: 200,
                productName: 'car loan',

                conversionPeriod: dayjs().subtract(3, 'day').toDate(), // Provide a valid date for conversionPeriod
                DhittoAccumulation: {
                    accInterest: 10, // Provide a valid value for accInterest
                    accPrincipal: 200,
                    dhittoId: 2,
                    id: 1,
                    updatedAt: new Date(),
                },
            } satisfies Prisma.DhittoGetPayload<{
                include: { DhittoAccumulation: true };
            }>;

            const result = service.isTodayConversionPeriod(dhitto, 2); // Provide a different value for conversionDay

            expect(result).toBe(false);
        });

        test('should return false when accInterest is not greater than 0', () => {
            const dhitto = {
                conversionPeriod: dayjs().subtract(3, 'day').toDate(), // Provide a valid date for conversionPeriod
                id: 2,
                customerId: 2,
                date: new Date(),
                interestPercentage: 10,
                principalAmount: 200,
                productName: 'car loan',
                DhittoAccumulation: {
                    accInterest: 0, // Provide a value of 0 for accInterest
                    accPrincipal: 200,
                    dhittoId: 2,
                    id: 1,
                    updatedAt: new Date(),
                },
            };

            const result = service.isTodayConversionPeriod(dhitto, 3);

            expect(result).toBe(false);
        });
    });

    describe('loanConversionAndInterestCalculation', () => {
        test('should update conversion period and accumulate interest for conversion dhittos', async () => {
            jest.spyOn(service, 'isTodayConversionPeriod').mockImplementation(
                (_) => true,
            );
            const result = await service.loanConversionAndInterestCalculation();
            expect(result).toBeUndefined();
        });

        test('should not update anything if there are no dhittos', async () => {
            const result = await service.loanConversionAndInterestCalculation();
            expect(result).toBeUndefined();
        });
    });
});
