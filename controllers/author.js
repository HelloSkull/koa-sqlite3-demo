/**
 * @Author:CaoZiHao
 * @description:
 * @Date:2017/5/8
 * @Time:14:26
 */
const authorSQLiteStore = require('./../backServices/author');
const store = new authorSQLiteStore('./db/author.db');

const author = {
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
    'GET /author/back_get_page':author.back_get_page,
    'GET /author/back_get_id':author.back_get_id,
    'POST /author/back_batch_delete':author.back_batch_delete,
    'POST /author/back_add':author.back_add,
    'POST /author/back_update_id':author.back_update_id
};

