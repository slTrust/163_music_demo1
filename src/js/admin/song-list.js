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
            let {songs,selectSongId} = data;
            let liList = songs.map((song)=>{
                let $li =  $('<li></li>').text(song.name).attr('data-song-id',song.id);
                if(song.id===selectSongId){
                    $li.addClass('active')
                }
                return $li;
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
            ],
            selectSongId:undefined
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
            this.bindEvents();
            this.bindEventHub();
            this.getAllSongs();
           
            
        },
        getAllSongs(){
            return this.model.find().then(()=>{
                this.view.render(this.model.data); 
            })
        },
        bindEvents(){
            //点击歌曲就激活 ，同时移除新建歌曲的激活态
            $(this.view.el).on('click','li',(e)=>{
                let songId = e.currentTarget.getAttribute('data-song-id')
                
                //根据选择的歌曲id更新视图列表
                this.model.data.selectSongId = songId;
                this.view.render(this.model.data)

                //根据歌曲id查找歌曲信息发布到 编辑区(main部分)
                let data;
                let songs = this.model.data.songs;
                for(var i=0;i<songs.length;i++){
                    if(songs[i].id===songId){
                        data = songs[i]
                        break;
                    }
                }
               //选择歌曲列表就取消 创建歌曲的激活态，同时歌曲的信息显示在main区域

               //传递歌曲信息 注意对象的深拷贝问题这里不能传 data因为是引用  
               //let object =  JSON.parse(JSON.stringify(data))
               window.eventHub.emit('select',JSON.parse(JSON.stringify(data)))
            })
        },
        bindEventHub(){
            window.eventHub.on('create',(songData)=>{
                this.model.data.songs.push(songData)
                this.view.render(this.model.data);
            }) 
             // 如果有人新建歌曲了  就清除列表里的激活状态
            window.eventHub.on('new',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('update',(song)=>{
                let songs = this.model.data.songs;
                for(let i=0;i<songs.length;i++){
                    if(songs[i].id === song.id){
                        Object.assign(songs[i],song)
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }
    container.init(view,model)
}