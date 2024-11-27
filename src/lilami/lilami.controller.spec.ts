import { Test, TestingModule } from '@nestjs/testing';
import { LilamiController } from './lilami.controller';
import { LilamiService } from './lilami.service';

describe('LilamiController', () => {
    let controller: LilamiController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LilamiController],
            providers: [LilamiService],
        }).compile();

        controller = module.get<LilamiController>(LilamiController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
