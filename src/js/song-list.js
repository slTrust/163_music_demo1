{
    let view = {
        el:'#songList-container',
        template:`
        <ul class="songList">
            <li>321312312312312</li>
            <li class="active">321312312312312</li>
            <li>321312312312312</li>
            <li>321312312312312</li>

            <li>321312312312312</li>
            <li>321312312312312</li>
            <li>321312312312312</li>
        </ul>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let container = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data)
        }
    }
    container.init(view,model)
}