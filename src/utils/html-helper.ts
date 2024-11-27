const tagType = require('html-tag');

export const tag = tagType;

export function stringifyHTML(...tags: ReturnType<typeof tagType>[]): string {
    return tags.reduce((prev, curr) => {
        return prev + curr;
    }, '');
}
