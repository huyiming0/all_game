import { EventType } from "./EventType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MyEvent {

    private static events: myEvent[] = [];
    private static eventMap: Map<EventType, myEvent[]> = new Map<EventType, myEvent[]>();
    /**
     * 监听事件
     * @param eventType 事件类型
     * @param callback 回调
     * @param target 识别码
     */
    public static on(eventType: EventType, callback: Function, target: string = '') {
        const e = new myEvent(eventType, callback, target);
        let eventarr = this.eventMap.get(eventType);
        if (eventarr && eventarr.length >= 0) {
            eventarr.push(e);
        } else {
            eventarr = new Array<myEvent>();
            eventarr.push(e);
            this.eventMap.set(eventType, eventarr);
        }
    }
    /**
     * 派发事件
     * @param eventType 事件类型
     * @param args 参数
     */
    public static emit(eventType: EventType, args: any) {
        const eventarr = this.eventMap.get(eventType);
        eventarr && eventarr.forEach(element => {
            element.go(args);
        });
    }

    /** 删除监听
    * @param eventType 事件类型
    */
    public static remove(eventType: EventType): void;
    /**删除监听
    * @param eventType 事件类型
    * @param target 识别码
    */
    public static remove(eventType: EventType, target: string): void;
    public static remove(eventType: EventType, target?: string): void {
        if (target) {
            let eventarr = this.eventMap.get(eventType);
            if (eventarr) {
                for (let i = eventarr.length - 1; i >= 0; i--) {
                    const element = eventarr[i];
                    if (element.target == target) {
                        eventarr.splice(i, 1);
                    }
                }
            }
        } else {
            let eventarr = this.eventMap.get(eventType);
            if (eventarr) {
                eventarr.splice(0, eventarr.length - 1);
                eventarr.length = 0;
            }
        }
    }
    /**清除所有事件监听*/
    public static clear() {
        this.eventMap.clear();
    }

}

class myEvent {
    eventType: EventType;
    callback: Function;
    args: any;
    target: string;
    constructor(eventType: EventType, callback: Function, target: string) {
        this.eventType = eventType;
        this.callback = callback;
        this.target = target;
    }
    public go(args) {
        this.callback(args);
    }
}

