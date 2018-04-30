// es6 支持块级作用域  直接{}  不再像ES5 !function(){ 逻辑代码}()
{
    let view = {
        el:".page > main",
        init(){
            this.$el = $(this.el)
        },
        template:`
        <form class="form">
            <div class="row">
                <label>
                歌名
                </label>
                <input name="name" type="text" value="__name__">
            </div>
            <div class="row">
                <label>
                歌手
                </label>
                <input name="singer" type="text" value="__singer__">
            </div>
            <div class="row">
                <label>
                外链
                </label>
                <input name="url" type="text" value="__url__">
            </div>
            <div class="row actions">
                <button type="submit">保存</button>
            </div>
        </form>
        `,
        render(data = {}){
            let placeholders = ['name','singer','url','id']
            let html = this.template;
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`,data[string]||'');
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }else{
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        reset(){
            this.render({})
        }
    }

    let model = {
        data:{
            name:'',
            singer:'',
            url:'',
            id:''
        },
        create(data){
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var Song = new Song();
            // 设置名称
            Song.set('name',data.name);
            Song.set('singer',data.singer);
            Song.set('url',data.url);
            return Song.save().then((newSong)=>{
                // 第一傻  挨个赋值
                // let id = newSong.id;
                // let attributes = newSong.attributes;
                // es6 解构赋值
                let {id,attributes} = newSong;
                // 第二傻 挨个赋值
                // this.data.id = id;
                // this.data.singer = attributes;
                //  es6语法
                // 可以把 属性挨个赋值到data里
                /*
                Object.assign(this.data,{
                    id:id,
                    name:attributes.name,
                    singer:attributes.singer,
                    url:attributes.url
                })
                */
                // 第三傻  还是傻  直接用解构赋值
                Object.assign(this.data,{id, ...attributes})
            }, (error)=>{
                console.error(error);
            });
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.view.init();
            this.model = model;
            this.view.render(this.model.data);
            this.bindEvents();

            //用户选择了歌曲列表中一个，就处于编辑状态
            window.eventHub.on('select',(data)=>{
                this.model.data = data;
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',(data)=>{
                // 如果是上传后获取的歌曲信息是没有id的  点击新建歌曲不应该清空表单
                // 如果是编辑的歌曲是有id的 点击新建就应该清空
                if(this.model.data.id){
                    this.model.data = {name:'',url:'',id:'',singer:''};
                }else{
                    Object.assign(this.model.data,data);
                }
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            // 事件委托  因为一开始  form是没有的  它是 render之后才有的
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault();
                let needs = 'name singer url'.split(' ');
                let data = {}
                needs.map((string)=>{
                    data[string] = this.view.$el.find(`[name="${string}"]`).val();
                })
                //真正的提交交给 model
                this.model.create(data).then(
                    ()=>{
                        // 成功后清空表单
                        console.log(this.model.data)
                        this.view.reset();
                        // 发布消息
                        let string = JSON.stringify(this.model.data);
                        let obj = JSON.parse(string)
                        window.eventHub.emit('create',obj);
                    },
                    ()=>{}
                );
            })
        }
    }

    controller.init(view,model)
}