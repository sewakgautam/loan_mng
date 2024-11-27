import { CommonGetterType } from 'src/types/common.type';
import { defaultPaginationOption } from './default';

export function changePageCapToSkip(option: {
    page: number;
    capacity: number;
}) {
    const take = option.capacity;
    const skip = (option.page - 1) * take;
    return { take, skip };
}

export function paginationOption(option: CommonGetterType) {
    return changePageCapToSkip(defaultPaginationOption(option));
}
