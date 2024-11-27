import Big from 'big.js';
import { ToWords } from 'to-words';

export function toBig(value: number) {
    return new Big(value);
}

export function ReturnValue(value: number) {
    return toBig(value).round(0, Big.roundUp).toNumber();
}

export function fixed<T extends number | Record<string, number> | number[]>(
    fn: () => T,
): T {
    const res = fn();
    if (typeof res === 'number') {
        return ReturnValue(res) as T;
    }
    if (Array.isArray(res)) {
        return fixedNums(res) as T;
    }
    if (typeof res === 'object') {
        Object.entries(res).map(([key, value]) => {
            res[key] = ReturnValue(value);
        });
        return res;
    }
}

export function fixedNums(arg: number[]) {
    return arg.map(ReturnValue);
}

export const toWordsInstance = new ToWords({
    localeCode: 'en-NP',
});

export function currencyToWords(value: number, toWords = toWordsInstance) {
    return toWords.convert(value, { currency: true });
}
