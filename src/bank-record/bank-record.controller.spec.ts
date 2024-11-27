import { Test, TestingModule } from '@nestjs/testing';
import { BankRecordController } from './bank-record.controller';
import { BankRecordService } from './bank-record.service';

describe('BankRecordController', () => {
    let controller: BankRecordController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BankRecordController],
            providers: [BankRecordService],
        }).compile();

        controller = module.get<BankRecordController>(BankRecordController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
