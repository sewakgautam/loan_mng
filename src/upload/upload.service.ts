import { BadRequestException, Injectable } from '@nestjs/common';
import { DhittoService } from 'src/dhitto/dhitto.service';
import { SalesService } from 'src/sales/sales.service';
import { unburnOrThrowIfExpired } from 'src/utils/burn';
import { htmlToPdf } from 'src/utils/html-to-pdf';

@Injectable()
export class UploadService {
    constructor(
        private readonly salesService: SalesService,
        private readonly dhittoService: DhittoService,
    ) {}

    async generateSalesHtml(token: string) {
        return await this.generateHtml(token, (id) =>
            this.salesService.generateSalesBillHTML(id),
        );
    }

    async generateDhittoHtml(token: string) {
        return await this.generateHtml(token, (id: string) =>
            this.dhittoService.generateDhittoBillHtml(id),
        );
    }

    async generateHtml(
        token: string,
        generator: (...args: any) => Promise<string>,
    ) {
        const id = unburnOrThrowIfExpired(token);
        return await generator(id);
    }

    async generateSalesPdf(token: string) {
        const renderableHtmlString = await this.generateSalesHtml(token);
        return htmlToPdf(renderableHtmlString);
    }
    async generateBillFactory(token: string, resource: string) {
        switch (resource) {
            case 'sales':
                return this.generateSalesHtml(token);
            case 'dhittos':
                return this.generateDhittoHtml(token);
            case 'payments':
                return this.generateHtml(token, (id) => {
                    if (typeof id === 'string')
                        throw new BadRequestException('Invalid token');
                    return this.dhittoService.generatePaymentBill(id);
                });
        }
    }
}
