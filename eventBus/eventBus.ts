interface ICallbackList{
    [id : string] : Function;
}

interface IEventObject{
    [eventName : string] : Object;
}

interface ISubscribe{
    unSubscribe : () => void;
}

interface  IEventBus {
    publish<T extends any[]>(eventName:string, ...args: T) : void;
    subscribe(eventName: string, callback: Function) : ISubscribe;
    subscribeOnce(eventName: string,callback: Function) : ISubscribe;
    clear(eventName: string) : void;
}

class EventBus implements IEventBus {
    private _eventObject: IEventObject;
    private _callbackId: number;
    constructor() {
        //初始化
        this._eventObject = {};
        //回调函数列表的id
        this._callbackId = 0;
    }
    //发布事件
    publish<T extends any[]>(eventName: string, ...args: T) : void{
        //取出当前事件所有的回调函数
        const callbackObject = this._eventObject[eventName];

        if(!callbackObject) return console.warn(eventName + " not found!");

        //执行每一个回调函数
        for (let id in callbackObject) {
            //执行时传入参数
            callbackObject[id](...args);

            //只订阅一次的回调函数需要删除
            if (id[0] === 'id'){
                delete callbackObject[id]
            }
        }
    }
    //订阅事件
    subscribe(eventName: string, callback: Function): ISubscribe {
        //初始化事件
        if(!this._eventObject[eventName]) {
            //使用对象存储，注销回调函数的时候提高删除效率
            this._eventObject[eventName] = {};
        }

        const id = this._callbackId++;

        //存储订阅者的回调函数
        //callbackId使用后需要自增，供下一个回调函数使用
        this._eventObject[eventName][id] = callback;

        //每一次订阅事件，都生成一个唯一的取消订阅函数
        const unSubscribe = () => {
            //清除这个订阅者的回调函数
            delete this._eventObject[eventName][id]

            //如果这个事件没有订阅者，也罢这个事件对象清除
            if(Object.keys(this._eventObject[eventName]).length === 0){
                delete this._eventObject[eventName][id]
            }
        }
        return { unSubscribe } 
    }
    subscribeOnce(eventName: string, callback: Function): ISubscribe {
        //初始化shijian
        if(!this._eventObject[eventName]){
            //使用对象存储，注销回调函数的时候提高删除效率
            this._eventObject[eventName] = {}
        } 

        //标志为只订阅一次的回调函数
        const id = "d" + this._callbackId++;

        //存储订阅者的回调函数
        //callbackId使用后需要自增供下一个函数使用
        this._eventObject[eventName][id] = callback;

        //每一次订阅事件，都生成唯一一个取消订阅的函数
        const unSubscribe = () => {
            delete this._eventObject[eventName][id]

            if(Object.keys(this._callbackId[eventName].length === 0)){
                delete this._eventObject[eventName][id]
            }
        }
        return { unSubscribe };
    }
    //清除事件
    clear(eventName: string): void{
        //未提供事件名称，默认清除所有事件
        if(!eventName){
            this._eventObject = {};
            return;
        }

        //清除指定事件
        delete this._eventObject[eventName];
    }
}