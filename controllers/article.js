/**
 * @Author:CaoZiHao
 * @description:
 * @Date:2017/5/8
 * @Time:14:26
 */
const articleSQLiteStore = require('./../backServices/article');
const store = new articleSQLiteStore('./db/article.db');

const article = {
    back_get_page:async(ctx, next)=>{
        const queryParams = ctx.request.query ?  ctx.request.query : null;
        const res = await store.back_get_page(queryParams);
        const { cnt } = await store.back_get_all_count(queryParams);

        let data = null;
        if(res){
            data = {
                code:0,
                data:{
                    entities:res,
                    total:cnt
                },
                message:null
            };
        }else{
            data = {
                code:-1,
                data:{
                    entities:null,
                    total:null
                },
                message:"未知错误"
            };
        }
        ctx.response.body = data;
    },
    back_get_id:async(ctx, next)=>{
        const queryParams = ctx.request.query ?  ctx.request.query : null;
        const res = await store.back_get_id(queryParams);

        let data = null;
        if(res){
            data = {
                code:0,
                data:{
                    entities:res
                },
                message:null
            };
        }else{
            data = {
                code:-1,
                data:{
                    entities:null,
                    total:null
                },
                message:"未知错误"
            };
        }
        ctx.response.body = data;
    },
    back_batch_delete:async (ctx, next) => {
        const params = ctx.request.body ? ctx.request.body : null;
        const res = await store.back_batch_delete(params);
        let data = null;
        if(res){
            data = {
                code:0,
                data:null,
                message:null
            };
        }else{
            data = {
                code:-1,
                data:null,
                message:"未知错误"
            };
        }
        ctx.response.body = data;
    },
    back_add:async (ctx, next) => {
        const params = ctx.request.body ? ctx.request.body : null;
        const res = await store.back_add(params);
        let data = null;
        if(res){
            data = {
                code:0,
                data:null,
                message:null
            };
        }else{
            data = {
                code:-1,
                data:null,
                message:"未知错误"
            };
        }
        ctx.response.body = data;
    },
    back_update_id:async (ctx, next) => {
        const params = ctx.request.body ? ctx.request.body : null;
        const res = await store.back_update_id(params);
        let data = null;
        if(res){
            data = {
                code:0,
                data:null,
                message:null
            };
        }else{
            data = {
                code:-1,
                data:null,
                message:"未知错误"
            };
        }
        ctx.response.body = data;
    }
};

module.exports =  {
    'GET /article/back_get_page':article.back_get_page,
    'GET /article/back_get_id':article.back_get_id,
    'POST /article/back_batch_delete':article.back_batch_delete,
    'POST /article/back_add':article.back_add,
    'POST /article/back_update_id':article.back_update_id
};


/*
module.exports = function(){
//上一条
    router.get('/article/get_previous', async (ctx, next) => {
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
    router.get('/article/get_next', async (ctx, next) => {
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
    return router.routes();
};*/
