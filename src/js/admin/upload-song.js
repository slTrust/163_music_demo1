{
    let view = {
        el:'.uploadArea',
        find(selector){
            return $(this.el).find(selector)[0]
        }
    }
    let model = {
        data:{
            status:'open'
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.initQiniu()
        },
        initQiniu(){
            var uploader = Qiniu.uploader({
            runtimes: 'html5',    //上传模式,依次退化
            browse_button: this.view.find('#uploadButton'),       //上传选择的点选按钮，**必需**
            uptoken_url: 'http://localhost:8888/uptoken',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
            domain: 'p5h9wznrb.bkt.clouddn.com',   // 你的七牛空间的 域名链接 下载使用
            //  bucket 域名，下载资源时用到，**必需**
            get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
            max_file_size: '40mb',           //最大文件体积限制
            dragdrop: true,                   //开启可拖曳上传
            drop_element: this.view.find('#uploadContainer'),        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            init: {
                'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        // 文件添加进队列后,处理相关的事情
                    });
                },
                'BeforeUpload':(up, file)=>{
                    // 每个文件上传前,处理相关的事情
                    uploadStatus.textContent = '上传中';
                    window.eventHub.emit('beforeUpload')
                    if(this.model.data.status==='closed'){
                        return false;
                    }else{
                        this.model.data.status = 'closed';
                        return true;
                    }
                  
                },
                'UploadProgress': function(up, file) {
                    // 每个文件上传时,处理相关的事情
                    
                },
                'FileUploaded':(up, file, info)=>{
                    this.model.data.status ='open';
                    uploadStatus.textContent = '上传完毕';
                    window.eventHub.emit('afterUpload')
                    // 每个文件上传成功后,处理相关的事情
                    // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                    // {
                    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                    //    "key": "gogopher.jpg"
                    //  }
                    // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                    // var domain = up.getOption('domain');
                    // var res = parseJSON(info.response);
                    // var sourceLink = domain + res.key; 获取上传成功后的文件的Url

                    // 上面的示例是伪代码   你要猜
                    var domain = up.getOption('domain');
                    var res = JSON.parse(info.response);
                    // 获取上传成功后的文件的Url encodeURIComponent(解析中文内容的请求体)
                    var sourceLink = 'http://' + domain + '/' + encodeURIComponent(res.key); 
                    console.log(sourceLink)
                    
                    // 分发
                    window.eventHub.emit('new',{
                        url:sourceLink,
                        name:res.key
                    })
                    
                    
                },
                'Error': function(up, err, errTip) {
                        //上传出错时,处理相关的事情
                },
                'UploadComplete': function() {
                        //队列文件处理完毕后,处理相关的事情
                },
                //文件名  不设置就是你上传的文件名
                // 'Key': function(up, file) {
                //     // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                //     // 该配置必须要在 unique_names: false , save_key: false 时才生效

                //     var key = "";
                //     // do something with key here
                //     return key
                // }
            }
        });
        // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
        // uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
        }
    }
    controller.init(view,model);
}