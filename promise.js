/*
* Promise实现
* @author lanyue
* @time 2016-09-18
*/

;(function(){
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var PromiseValue = undefined;
function Promise( callback ){
    this.state = PENDING;
    //then任务列表
    this.doneList       = [];
    this.catchList      = [];
    this._doneTempList  = [];
    this.pid = Math.random();
    callback(this.resolve.bind(this),this.reject.bind(this));
}
Promise.prototype.resolve = function(){
    if(this.state === REJECTED){
        return;
    }
    PromiseValue = arguments[0];
    //console.log(PromiseValue);
    while(true){

        //如果任务列表已经完成则退出事件循环
        if(this.doneList.length === 0){
            this.state = FULFILLED;
            break;
        }
        
        //如果then返回值是Promise对象
        if( PromiseValue instanceof Promise ){
            //console.log(this.doneList);
            
            this.state = FULFILLED;
            
            //把新的Promise任务放在原来任务队列前面
            PromiseValue.doneList = PromiseValue.doneList.concat(this.doneList);
            //把任务队列后面的任务储存起来(内部reject(失败情况))
            PromiseValue._doneTempList = PromiseValue._doneTempList.concat(this.doneList);
            //console.log(PromiseValue,this);
            this.catchList=[];
            //清空原有任务队列
            this.doneList = [];
            //
            if(PromiseValue.doneList.length !==0 && PromiseValue.state == FULFILLED){
                PromiseValue.resolve(PromiseValue.PromiseValue);
            }
            if(PromiseValue._doneTempList.length !==0 && PromiseValue.state == REJECTED){
                PromiseValue.reject(PromiseValue.PromiseValue);
            }
            break;
        }
        if(typeof PromiseValue === "undefined"){
            PromiseValue = this.doneList.shift().apply(this);
        }else{
             
            PromiseValue = this.doneList.shift().apply(this,[PromiseValue]);
            //console.log(PromiseValue);
        }
        this.PromiseValue=PromiseValue;
    }
}
Promise.prototype.reject = function(){
    
    //如果任务列表已经是完成状态则不执行
    if(this.state === FULFILLED){
        return;
    }
    //如果then回调返回的是Promise子任务
    if(PromiseValue instanceof Promise){
        //console.log(this === PromiseValue);//true
        //把父任务的中的then任务列表放到子任务的catch任务队列后
        this.catchList = this.catchList.concat(this._doneTempList);
    }
    PromiseValue = arguments[0];

    while (true) {

        if(this.catchList.length === 0){
            this.state = REJECTED;
            break;
        }
        //如果catch返回值是Promise对象
        /*if( PromiseValue instanceof Promise ){
            
            this.state = REJECTED;
            //把新的Promise任务放在原来任务队列前面
            PromiseValue.doneList = PromiseValue.doneList.concat(this.doneList);
            //清空原有任务队列
            this.doneList = [];
            break;
        }*/

        if(typeof PromiseValue === "undefined"){
            PromiseValue = this.catchList.shift().apply(this);
        }else{
            PromiseValue = this.catchList.shift().apply(this,[PromiseValue]);
        }
        this.PromiseValue=PromiseValue;
    }
}
Promise.prototype.then = function(fn){
    //入栈任务
    this.doneList.push(fn);
    //console.log(PromiseValue,fn);
    //如果任务列表已经完成状态，则更改状态并触发任务
    if(this.state === FULFILLED){
        this.state = PENDING;
        this.resolve(PromiseValue);//触发任务
    }

    return this;
}
Promise.prototype.catch = function(fn){
    this.catchList.push(fn);
    if(this.state === REJECTED){
        //console.log(new Date().getTime());
        this.state = PENDING;
        this.reject(PromiseValue);//触发任务
    }
    
}


if(typeof exports == "object" && typeof module != "undefined"){
    module.exports = Promise;
}else if(typeof define == "function" && define.amd){
    define(function(){return Promise});
}else{
    if (typeof window !== 'undefined' && window !== null){
        Promise.originPromise = window.Promise;
        window.Promise = Promise;
    } else if (typeof self !== 'undefined' && self !== null) {
        Promise.originPromise = self.Promise;
        self.Promise = Promise;
    }
}
})();


