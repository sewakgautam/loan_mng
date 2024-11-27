import { Test, TestingModule } from '@nestjs/testing';
import { LilamiService } from './lilami.service';

describe('LilamiService', () => {
    let service: LilamiService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LilamiService],
        }).compile();

        service = module.get<LilamiService>(LilamiService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
