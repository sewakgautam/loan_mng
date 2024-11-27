import { Test, TestingModule } from '@nestjs/testing';
import { BankRecordService } from './bank-record.service';

describe('BankRecordService', () => {
    let service: BankRecordService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BankRecordService],
        }).compile();

        service = module.get<BankRecordService>(BankRecordService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
