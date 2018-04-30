{
    let view ={
        el:'#app',
        template:`
            <audio autoplay controls src={{url}}></audio>
        `,
        render(data){
            $(this.el).html(this.template.replace('{{url}}',data.url))
        }
    }
    let model = {
        data:{
            id:'',
            name:'',
            singer:'',
            url:''
        },
        get(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song)=>{
                Object.assign(this.data,{id:song.id,...song.attributes})
                return song
            });
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            let id = this.getSongId()
            this.model.get(id).then((data)=>{
                this.view.render(this.model.data)
            })
        },
        getSongId(){
            let search = window.location.search;
            if(search.indexOf('?')===0){
                search = search.substring(1)
            }
            
            //查询字符串防止有人很贱的 放两个“&”导致解析两个空字符  home.html?id=fdsfasfd&&a=2
            let array = search.split('&').filter((v)=>v);
            let id = '';
            for(let i=0;i<array.length;i++){
                let kv = array[i].split('=')
                let key = kv[0];
                let value =kv[1];
                if(key==='id'){
                    id = value
                }
            }
            return id;
        }
    }

    controller.init(view,model)
}
