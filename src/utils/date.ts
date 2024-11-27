import * as utc from 'dayjs/plugin/utc';
import * as dayjs from 'dayjs';
dayjs.extend(utc);

export { dayjs };

export function formatDate(date: Date, format = 'DD-MM-YYYY') {
    return dayjs(date).format(format);
}
