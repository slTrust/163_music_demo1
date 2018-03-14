window.eventHub = {
    events:{
        // '蒙牛':[],
        // '伊利':[]
    },
    // 发布  事件名  数据
    emit(eventsName,data){
        for(let key in this.events){
            if(key === eventsName){
                let fnList = this.events[key]
                fnList.map((fn)=>{
                    fn.call(undefined,data)
                })
            }
        }
    },
    //订阅 事件名   回调
    on(eventName,fn){
        //  这句是可能订阅的内容  现有的events里没有  所以就初始化一下 类似 桶排序
        if(this.events[eventName]===undefined){
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    }
}

/*
订阅  /发布 模式

*/