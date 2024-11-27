type Meta = {
    target?: string[];
    field_name?: string;
    field_value?: string;
    model_name?: string;
    argument_name?: string;
    constraint?: string;
    database_error?: string;
};

export function errorMessage(code: string, message: string, meta: Meta) {
    const _targets = meta.target?.map(pth) ?? [];
    const fields = arrToStr(_targets);
    switch (code) {
        case 'P2002':
            return `field value must be unique for: ${fields} field${
                _targets.length > 1 ? 's' : ''
            }.`;

        case 'P2003':
            return `value for column: ${meta.field_name} not found.`;
        case 'P2005':
            return `Provided value for field: ${meta.field_value} is not a valid data type`;
        default:
            return `Error:${code}: ${message}`;
    }
}

function arrToStr(arr: string[]) {
    if (!arr.length) return '';
    if (arr.length === 1) return arr[0];
    return `${arr.slice(0, arr.length - 1).join(', ')}, and ${arr.at(-1)}`;
}

//  variable name to readable name
function pth(str: string) {
    return str;
}
