import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { renderMustache } from './mustache-utils';

async function readFile(path: string): Promise<string> {
    return await fs.readFile(path, 'utf8');
}

interface Config {
    templateDir?: string;
}
export async function readTemplateFile(
    fileName: string,
    config: Config = { templateDir: 'src/templates' },
) {
    return await readFile(
        path.join(process.cwd(), config.templateDir, fileName),
    );
}

export async function renderHtmlFromFile<T extends object>(
    fileName: string,
    option: T,
) {
    const htmlString = await readTemplateFile(fileName);
    return renderMustache(htmlString, option);
}
