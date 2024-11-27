import { Inject, Injectable } from '@nestjs/common';
import { Notify, NOTIFY_TOKEN } from './notify';

@Injectable()
export class NotifyService {
    constructor(@Inject(NOTIFY_TOKEN) private readonly _notify: Notify) {}

    // will send notification via smtp
    /**
     *
     * @deprecated use notify instead
     */
    notifyMe<Data>() {
        return this._notify.notifyMe<Data>();
    }

    /**
     * @description use this in-place of **notifyMe**
     */
    notify = this._notify.notify.bind(
        this._notify,
    ) as typeof this._notify.notify;
}
