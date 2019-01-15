export class DomoEvent {
    constructor(
        private _eventname: string,
        private _callback: EventListener,
        private captureOrOptions: any | boolean = false
    ) {
    }

    get name() {
        return this._eventname
    }

    get callback() {
        return this._callback
    }

    get capturing() {
        return this.captureOrOptions
    }

    cloneNode() {
        return this
    }
}