{
    let view = {
        el:'#songList-container',
        template:`
        <ul class="songList">
            <li>321312312312312</li>
            <li>321312312312312</li>
            <li>321312312312312</li>
            <li>321312312312312</li>

            <li>321312312312312</li>
            <li>321312312312312</li>
            <li>321312312312312</li>
        </ul>
        `,
        render(data){
            $(this.el).html(this.template)
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active');
        }
    }
    let model = {}
    let container = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data)
            window.eventHub.on('upload',()=>{
                // 如果有人上传歌曲了  就清除列表里的激活状态
                this.view.clearActive()
            })
        }
    }
    container.init(view,model)
}