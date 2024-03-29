type ListenerFunction = (...args: any[]) => void;

export abstract class EventEmitter<Listeners extends object> {
  private listeners: Listeners;

  constructor(listeners: Listeners) {
    this.listeners = listeners;
  }

  public on(
    event: keyof Listeners | Array<keyof Listeners>,
    callback: ListenerFunction
  ) {
    if (event instanceof Array) {
      for (const _event of event) {
        (this.listeners[_event] as any).push(callback);
      }
    } else {
      (this.listeners[event] as any).push(callback);
    }
  }

  protected triggerEvent(event: keyof Listeners, ...args: any[]) {
    for (const listener of this.listeners[event] as any) {
      listener(this, ...args);
    }
  }
}
