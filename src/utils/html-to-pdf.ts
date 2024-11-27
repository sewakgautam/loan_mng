import * as puppeteer from 'puppeteer';

export async function htmlToPdf(htmlString: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlString);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();
    return pdf;
}
