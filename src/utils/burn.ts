// eslint-disable-next-line @typescript-eslint/no-var-requires
const cryptr = require('cryptr');
import * as dayjs from 'dayjs';

const secretKey = 'abcd';

const _cryptor = new cryptr(secretKey);

export class UnburnTokenExpiredException extends Error {}

function transformData(
    data: string,
    delim = '~',
    type: 'string' | 'json' = 'string',
) {
    return `${data}${delim}${dayjs()
        .add(1000, 'minutes')
        .toISOString()}${delim}${type}`;
}

export interface BurnValue {
    data: string;
}
export function burn(data: string | object): BurnValue {
    let type: 'string' | 'json' = 'string';
    if (typeof data === 'object') {
        data = JSON.stringify(data);
        type = 'json';
    }
    return { data: _cryptor.encrypt(transformData(data, '~', type)) };
}

export interface UnburnValue {
    expired: boolean;
    data: string | null | object;
}

export function unburn(burned: string, delim = '~'): UnburnValue {
    const [data, date, type] = _cryptor.decrypt(burned).split(delim);

    const _data = type === 'json' ? JSON.parse(data) : data;

    const expired = dayjs(date).diff(dayjs()) < 0;

    return {
        expired,
        data: expired ? null : _data,
    };
}

export function unburnOrThrowIfExpired(burned: string, delim = '~') {
    const { expired, data } = unburn(burned, delim);
    if (expired) {
        throw new UnburnTokenExpiredException('Burned data is expired.');
    }
    return data;
}
