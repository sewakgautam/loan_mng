import * as Mustache from 'mustache';
export function renderMustache<T extends object>(
    htmlString: string,
    option: T,
): string {
    return Mustache.render(htmlString, option);
}
