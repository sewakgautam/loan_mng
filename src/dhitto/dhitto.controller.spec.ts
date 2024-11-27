import { Test, TestingModule } from '@nestjs/testing';
import { DhittoController } from './dhitto.controller';
import { DhittoService } from './dhitto.service';

describe('DhittoController', () => {
    let controller: DhittoController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DhittoController],
            providers: [DhittoService],
        }).compile();

        controller = module.get<DhittoController>(DhittoController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
