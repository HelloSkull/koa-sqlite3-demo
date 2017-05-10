/**
 * @Author:CaoZiHao
 * @description:
 * @Date:2017/5/8
 * @Time:15:58
 */
/**
 * @Author:CaoZiHao
 * @description:
 * @Date:2017/5/3
 * @Time:17:04
 */

const sqlite3 = require('sqlite3');

const TABLE_NAME = 'admin';

const SQL_CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                    id INTEGER PRIMARY  KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL,
                    accesstoken TEXT,
                    lastLoginTime INTEGER,
                    createdTime INTEGER NOT NULL,
                    updatedTime INTEGER NOT NULL);`;

const SQL_UPDATE_ID = `UPDATE ${TABLE_NAME} SET  lastLoginTime=? WHERE id = ?`;

const SQL_JUDGE_EXIST = `SELECT * FROM ${TABLE_NAME} WHERE username = ? AND password = ?`;

const SQL_SET_ACCESSTOKEN = `UPDATE ${TABLE_NAME} SET  lastLoginTime=?,accesstoken =? WHERE id = ?`;

const SQL_SET = `INSERT OR REPLACE INTO ${TABLE_NAME} (username, password,accesstoken,createdTime,updatedTime) VALUES (?, ?, ?, ?, ?)`;

const SQL_CLEAR_ACCESSTOKEN = `UPDATE ${TABLE_NAME} SET accesstoken = '' WHERE id = ?`;

const utils = require('./../utils/utils');

class SQLiteStore {
    //初始化
    constructor(filename, opt){
        this.opt = opt || {};
        let sqlite =  sqlite3.verbose();
        this.__db = new sqlite.Database(filename);
        const self =this;
        //建立新表
        self.__db.run(SQL_CREATE_TABLE);
        console.log(`${filename} created!`)
    }
    //添加一条数据
    back_add(params){
        return new Promise((resolve, reject)=>{
            const self = this;
            const { username,password }  = params;
            const accesstoken = "";
            const createdTime = new Date().getTime();
            const updatedTime = new Date().getTime();
            const stmt = self.__db.prepare(SQL_SET);
            stmt.run(username,password,accesstoken,createdTime,updatedTime,(err)=>{
                console.log("err ->",err);
                if(!err){
                    resolve(1);
                }else{
                    reject(0);
                    console.log("add_article error->",err);
                }
            });
            //finalize():完成声明
            stmt.finalize();
            // })
        });
    }
    //判断是否存在
    back_judgeAdminExist(params){
        return new Promise((resolve, reject)=>{
            const self = this;
            const { username,password }  = params;
            const stmt = self.__db.prepare(SQL_JUDGE_EXIST);
            stmt.all(username,password,(err,data)=>{
                if(!err){
                  
                    resolve(data);
                }else{
                    reject(0);
                    console.log("add_article error->",err);
                }
            });
            //finalize():完成声明
            stmt.finalize();
            // })
        });
    }
    //设置accesstoekn
    back_setAccesstoken(params){
        return new Promise((resolve, reject)=>{
            const self = this;
            const { id }  = params;
            const stmt = self.__db.prepare(SQL_SET_ACCESSTOKEN);
            const lastLoginTime = new Date().getTime();
            const ass = (id +　lastLoginTime).toString();
            const accesstoken = utils.md5(ass);
            stmt.run(lastLoginTime,accesstoken,id,(err,data)=>{
                if(!err){
                    params.accesstoken = accesstoken;
                    resolve(params);
                }else{
                    reject(0);
                    console.log("add_article error->",err);
                }
            });
            //finalize():完成声明
            stmt.finalize();
            // })
        });
    }
    //清空
    back_clearAccesstoken(params){
        return new Promise((resolve, reject)=>{
            const self = this;
            const { id }  = params;
            console.log("id->",id);
            const stmt = self.__db.prepare(SQL_CLEAR_ACCESSTOKEN);
            stmt.run(id,(err)=>{
                if(!err){
                    console.log("back_clearAccesstoken!");
                    resolve(1);
                }else{
                    reject(0);
                    console.log("add_article error->",err);
                }
            });
            //finalize():完成声明
            stmt.finalize();
            // })
        });
    }
    
}


module.exports = SQLiteStore;