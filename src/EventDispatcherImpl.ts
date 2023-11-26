import { Callback, IEventDispatcher } from "./IEventDispatcher";

export class EventDispatcherImpl implements IEventDispatcher {
    private _callbackMap: Map<string, Callback[]> = new Map();

    addEventListener(eventType: string, callback: Callback): void {
        let callbacks = this._callbackMap.get(eventType);
        if (callbacks) {
            callbacks.push(callback);
        } else {
            callbacks = [callback];
        }
        this._callbackMap.set(eventType, callbacks);
    }

    removeEventListener(eventType: string, callback: Callback): void {
        let callbacks = this._callbackMap.get(eventType);
        if (!callbacks) return;
        callbacks = callbacks.filter(_callback => _callback !== callback);
        this._callbackMap.set(eventType, callbacks);
    }

    dispatchEvent(eventType: string, ...callbackArgs: unknown[]): void {
        const callbacks = this._callbackMap.get(eventType);
        if (!callbacks) return;
        for (const callback of callbacks) {
            callback(...callbackArgs);
        }
    }
}
