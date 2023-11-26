export type Callback = (...args: unknown[]) => void;

export interface IEventDispatcher {
    /**
     * Add an event listener.
     * @param eventType Event type.
     * @param callback Callback to execute event.
     */
    addEventListener(eventType: string, callback: Callback): void;

    /**
     * Remove an event listener.
     * @param eventType Event type.
     * @param callback Callback to execute event.
     */
    removeEventListener(eventType: string, callback: Callback): void;

    /**
     * Distapch the event.
     * @param eventType Event type.
     * @param callback Callback to execute event.
     */
    dispatchEvent(eventType: string, ...callbackArgs: unknown[]): void;
}
