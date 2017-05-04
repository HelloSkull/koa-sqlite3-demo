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
        failCallBack: err=>{
            console.log("----------------------->create fail!",err);
        }
    };
    store.add_article(param);
    await next();
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
        failCallBack: err=>{
            console.log("----------------------->create fail!",err);
        }
    };
    store.update_id(param);
    await next();
});

//批量删除
router.get('/article/batchDelete', async (ctx, next) => {
    const param = {
        params:{
          idList:[3,4,5]
        },
        successCallBack: () =>{
            console.log("----------------------->batchDelete success!");
        },
        failCallBack: err=>{
            console.log("----------------------->batchDelete fail!",err);
        }
    };
    store.batch_delete(param);
    await next();
});

//根据id找详情
router.get('/article/getById', async (ctx, next) => {
    const param = {
        params:{
            id:6
        },
        successCallBack: data =>{
            console.log("----------------------->getById success!",data);

        },
        failCallBack: err=>{
            console.log("----------------------->getById fail!",err);
        }
    };

    const res = await store.get_id(param);
    res ? ctx.response.body = res : null;

});

//分页查找
router.get('/article/getByPage', async (ctx, next) => {
    const param = {
        params:{
            pageIndex:0,
            pageSize:10
        },
        successCallBack: data =>{
            console.log("----------------------->getByPage success!",data);
        },
        failCallBack: err=>{
            console.log("----------------------->getByPage fail!",err);
        }
    };
    
    const countParam = {
        successCallBack: data =>{
            console.log("----------------------->countParam success!",data);
        },
        failCallBack: err=>{
            console.log("----------------------->countParam fail!",err);
        }
    };
    
    const res = await store.get_page(param);
    const { cnt } = await store.get_all_count(countParam);

    const data = {
        count:cnt,
        entities:res
    };
    res ? ctx.response.body = JSON.stringify(data) : null;

});


app.use(bodyParser());
app.use(router.routes());
app.listen(3000);

console.log('app started at port 3000...');