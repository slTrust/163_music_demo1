{
    let view = {
        el:'#songList-container',
        template:`
        <ul class="songList">
        </ul>
        `,
        render(data){
            let $el = $(this.el)
            $el.html(this.template);
            let {songs} = data;
            let liList = songs.map((song)=>{
                return $('<li></li>').text(song.name)
            })
            // $(this.el).html(this.template)
            liList.map((domLi)=>{
                $el.find('ul').append(domLi)
            })
           
            
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active');
        }
    }
    let model = {
        data:{
            songs:[
                // {id:1,name:'1',url:''},
            ]
        },
        find(){
            var query = new AV.Query('Song');
           return query.find().then(
                (songs)=>{
                    console.log(songs)
                    this.data.songs = songs.map((song)=>{
                        return {id:song.id,...song.attributes}
                    });
                    return this.data.songs
                },
                (err)=>{});
        }
    }
    let container = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data)
            window.eventHub.on('upload',()=>{
                // 如果有人上传歌曲了  就清除列表里的激活状态
                this.view.clearActive()
            });
            window.eventHub.on('create',(songData)=>{
                this.model.data.songs.push(songData)
                this.view.render(this.model.data);
            })
            this.model.find().then(()=>{
                this.view.render(this.model.data); 
            })
            
        }
    }
    container.init(view,model)
}