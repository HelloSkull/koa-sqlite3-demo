/**
 * @Author:CaoZiHao
 * @description:
 * @Date:2017/5/8
 * @Time:14:26
 */
const adminSQLiteStore = require('./../backServices/admin');
const store = new adminSQLiteStore('./db/admin.db');



const admin = {
    back_add:async(ctx, next)=>{
        const param = {
            params: {
                username: "Skull",
                password: 123456
            }
        };


        const res = await store.back_add(param.params);
        if(res){
            console.log("create success");
        }else{

        }
    },
    back_login:async (ctx, next) => {
        const params = ctx.request.body ? ctx.request.body : null;
        let data = null;
        const resJudgeAdminExist = await store.back_judgeAdminExist(params);
        console.log("back_login resJudgeAdminExist->",resJudgeAdminExist);
        
        if(resJudgeAdminExist){
            const resSetAccesstoken = await store.back_setAccesstoken(resJudgeAdminExist[0]);
            const { id,username,accesstoken } = resSetAccesstoken;
            const res = {
                userId:id,
                username,
                accesstoken
            };
            data = {
                code:0,
                data:res
            };
            ctx.response.body = data;
        }else{
            data = {
                code:-1,
                data:null,
                message:"密码错误"
            };
            ctx.response.body = data;
        }
    },
    back_logout:async (ctx, next) => {
        const params = ctx.request.body ? ctx.request.body : null;
        const res = await store.back_clearAccesstoken(params);
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
    // 'GET /admin/back_add':admin.back_add,
    'POST /admin/back_login':admin.back_login,
    'POST /admin/back_logout':admin.back_logout
};

