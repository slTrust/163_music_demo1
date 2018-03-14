// es6 支持块级作用域  直接{}  不再像ES5 !function(){ 逻辑代码}()
{
    let view = {
        el:".page > main",
        template:`
        <h1>新建歌曲</h1>
        <form class="form">
            <div class="row">
                <label>
                歌名
                </label>
                <input type="text">
            </div>
            <div class="row">
                <label>
                歌手
                </label>
                <input type="text">
            </div>
            <div class="row">
                <label>
                外链
                </label>
                <input type="text">
            </div>
            <div class="row actions">
                <button type="submit">保存</button>
            </div>
        </form>
        `,
        redner(data){
            $(this.el).html(this.template)
        }
    }

    let model = {}
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.redner(this.model.data)
             // 订阅
             window.eventHub.on('upload',(data)=>{
                console.log('song-form 模块得到了 data');
                console.log(data);
            })
        }
    }

    controller.init(view,model)
}