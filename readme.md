### leancloud登录

> 我用的是新浪邮箱登录

- 创建自己的应用 163_music_demo_1
- 打开帮助文档[https://leancloud.cn/docs/start.html](https://leancloud.cn/docs/start.html)
- 安装依赖

    ```
    # 存储服务（包括推送和统计）
    $ npm install leancloud-storage --save
    ```
- 引入相关js

    ```
    <!-- 存储服务 -->
    <script src="//cdn1.lncld.net/static/js/3.6.0/av-min.js"></script>
    ```
- 验证js是否正确

    ```
    console.log(window.AV)
    ```
- 根据appid初始化  注意是你应用的appid

    ```
    var APP_ID = '你应用的appid';
    var APP_KEY = '你应用的appkey';

    AV.init({
    appId: APP_ID,
    appKey: APP_KEY
    });
    //刷新  没毛病 继续
    ```

- 验证节点是否可访问

    ```
    # cmd 里输入
    ping "vfy3ifvj.api.lncld.net"
    ```

- 验证创建数据库和保存数据的测试类

    ```
    var TestObject = AV.Object.extend('TestObject');
    var testObject = new TestObject();
    testObject.save({
    words: 'Hello World!'
    }).then(function(object) {
    alert('LeanCloud Rocks!');
    })
    ```

> ACL Access-control-layer 访问控制层 用来控制可读可写权限的

### 创建我们需要的数据库  

```
//创建数据库
var TestObject = AV.Object.extend('Song');
// 创建一条记录
var testObject = new TestObject();
// 保存记录
testObject.save({
    name:'test',
    singer:'test',
    url:'test'
}).then(function(object) {
alert('LeanCloud Rocks!');
},()=>{
    alert('fuck')
})

//创建数据库
var TestObject = AV.Object.extend('Playlist');
// 创建一条记录
var testObject = new TestObject();
// 保存记录
testObject.save({
    name:'test',
    cover:'test',//封面
    createrId:'',//创建者id    
    description:'简介',//
    songs:['1','2'],//歌单
}).then(function(object) {
alert('LeanCloud Rocks!');
},()=>{
    alert('fuck')
})
```