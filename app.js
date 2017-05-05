const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const SQLiteStore = require('./db');
const app = new Koa();

// log request URL:
let store = null;

app.use(async (ctx, next) => {
    store = new SQLiteStore('article.db');
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// router.get('/', async (ctx, next) => {
//     store = new SQLiteStore('article.db');
//     ctx.response.type = 'text/html';
//     ctx.response.body = '<h1>Hello, koa2!</h1>';
// });

router.get('/', async (ctx, next) => {
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
    await next();
});


//添加
router.get('/article/create', async (ctx, next) => {
    const param = {
        params:{
            title:"辐射1",
            author:"Bethesda",
            readNum:11111,
            content:"war,war never change."
        },
        successCallBack: () =>{
            console.log("----------------------->create success!");
        },
        failCallBack: () =>{
            console.log("----------------------->create fail!");
        }
    };
    const res = await store.add_article(param.params);
    if(res){
        param.successCallBack && param.successCallBack()
    }else{
        param.failCallBack && param.failCallBack()
    }
});


//根据Id更新
router.get('/article/updateById', async (ctx, next) => {
    const param = {
        params:{
            id:6,
            title:"上古卷轴5",
            author:"Bethesda",
            readNum:99999,
            content:"lao gun，lao gun，lao gun"
        },
        successCallBack: () =>{
            console.log("----------------------->create success!");
        },
        failCallBack: ()=>{
            console.log("----------------------->create fail!");
        }
    };
    const res = await store.update_id(param.params);
    if(res){
        param.successCallBack && param.successCallBack()
    }else{
        param.failCallBack && param.failCallBack()
    }
});

//批量删除
router.get('/article/batchDelete', async (ctx, next) => {
    const param = {
        params:{
          idList:[1,2,3,4,5]
        },
        successCallBack: () =>{
            console.log("----------------------->batchDelete success!");
        },
        failCallBack: ()=>{
            console.log("----------------------->batchDelete fail!");
        }
    };
    const res = await store.batch_delete(param.params);
    if(res){
        param.successCallBack && param.successCallBack()
    }else{
        param.failCallBack && param.failCallBack()
    }
});

//根据id找详情
router.get('/article/getById', async (ctx, next) => {
    const param = {
        params:{
            id:6
        },
        successCallBack: data =>{
            ctx.response.body = data;
            console.log("----------------------->getById success!",data);

        },
        failCallBack: ()=>{
            console.log("----------------------->getById fail!");
        }
    };

    const res = await store.get_id(param.params);

    if(res){
        param.successCallBack && param.successCallBack(JSON.stringify(res))
    }else{
        param.failCallBack && param.failCallBack()
    }

});

//分页查找
router.get('/article/getByPage', async (ctx, next) => {
    const param = {
        params:{
            pageIndex:0,
            pageSize:10
        },
        successCallBack: data =>{
            ctx.response.body = JSON.stringify(data);
            console.log("----------------------->getByPage success!",data);
        },
        failCallBack: ()=>{
            console.log("----------------------->getByPage fail!");
        }
    };

    const res = await store.get_page(param.params);
    const { cnt } = await store.get_all_count();

    if(res){
        const data = {
            count:cnt,
            entities:res
        };
        param.successCallBack && param.successCallBack(JSON.stringify(data))
    }else{
        param.failCallBack && param.failCallBack()
    }
});

//上一条
router.get('/article/getByPrevious', async (ctx, next) => {
    const param = {
        params:{
            id:10
        },
        successCallBack: data =>{
            ctx.response.body = data;
            console.log("----------------------->getById success!",data);
        },
        failCallBack: ()=>{
            console.log("----------------------->getById fail!");
        }
    };

    const res = await store.get_page_previous(param.params);

    if(res){
        param.successCallBack && param.successCallBack(res)
    }else{
        param.failCallBack && param.failCallBack()
    }

});

//下一条
router.get('/article/getByNext', async (ctx, next) => {
    const param = {
        params:{
            id:10
        },
        successCallBack: data =>{
            ctx.response.body = data;
            console.log("----------------------->getById success!",data);

        },
        failCallBack: ()=>{
            console.log("----------------------->getById fail!");
        }
    };

    const res = await store.get_page_next(param.params);

    if(res){
        param.successCallBack && param.successCallBack(res)
    }else{
        param.failCallBack && param.failCallBack()
    }

});


app.use(bodyParser());
app.use(router.routes());
app.listen(3000);

console.log('app started at port 3000...');