/**
 * @Author:CaoZiHao
 * @description:
 * @Date:2017/5/3
 * @Time:17:04
 */

const sqlite3 = require('sqlite3');

const TABLE_NAME = 'article';

const SQL_CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                    id INTEGER PRIMARY  KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    author TEXT NOT NULL,
                    readNum INTEGER,
                    content TEXT NOT NULL,
                    createTime INTEGER NOT NULL,
                    updateTime INTEGER NOT NULL);`;

const SQL_GET_COUNT = `SELECT count(*) as cnt FROM ${TABLE_NAME}`;

const SQL_DELETE = `DELETE FROM ${TABLE_NAME} WHERE id = ?`;

// limit : 要显示多少条记录
// offset : 跳过多少条记录
const SQL_GET_PAGE = `SELECT * FROM ${TABLE_NAME} LIMIT ? OFFSET ?`;

const SQL_GET_ID =  `SELECT * FROM ${TABLE_NAME} WHERE id = ?`;

const SQL_UPDATE_ID = `UPDATE ${TABLE_NAME} SET title = ?,author = ?,content =?,updateTime=? WHERE id = ?`;

const SQL_SET = `INSERT OR REPLACE INTO ${TABLE_NAME} (title, author,readNum,content,createTime,updateTime) VALUES (?, ?, ?, ?, ?, ?)`;

class SQLiteStore {
    //初始化
    constructor(filename, opt){
        console.log("filename ->",filename);
        console.log("opt ->",opt);
        this.opt = opt || {};
        let sqlite =  sqlite3.verbose();
        this.__db = new sqlite.Database(filename);
        const self =this;
        self.__db.serialize(function() {
            //建立星新表
            self.__db.run(SQL_CREATE_TABLE);
            console.log("table created!")
        });
    }

    //添加一条数据
    add_article(param){
        const self = this;
        const { params,successCallBack, failCallBack} = param;
        const { title,author,readNum,content }  = params;
        const createTime = new Date().getTime();
        const updateTime = new Date().getTime();
        //serial ize():将执行模式设置为序列化。这意味着最多只有一个语句对象可以一次执行查询
        // self.__db.serialize(()=>{
            //prepare() : 准备SQL语句，并可选地绑定指定的参数，并在完成后调用回调。该函数返回一个Statement对象。
            const stmt = self.__db.prepare(SQL_SET);
            stmt.run(title,author,readNum,content,createTime,updateTime,(err)=>{
                if(!err){
                    successCallBack && successCallBack();
                }else{
                    failCallBack && failCallBack(err);
                }
            });
            //finalize():完成声明
            stmt.finalize();
        // })
    }

    //批量删除
    batch_delete(param){
        const self = this;
        const { params,successCallBack, failCallBack} = param;
        const { idList}  = params;
        let sqlTotal = "";
        idList.forEach((v,i)=>{
            sqlTotal += `;DELETE FROM "${TABLE_NAME}" WHERE id = ${v}`;
        });

        self.__db.exec(sqlTotal,(err)=>{
            if(!err){
                successCallBack && successCallBack();
            }else{
                failCallBack && failCallBack(err);
            }
        });
    }

    //根据id找数据
    get_id(param){
        return new Promise((resolve, reject)=>{
            const self = this;
            const { params ,successCallBack,failCallBack } = param;
            const { id }  = params;
            console.log("id ->",id);
            self.__db.serialize(()=>{
                const stmt = self.__db.prepare(SQL_GET_ID);
                //查询单条
                stmt.get(id,(err,data)=>{
                    if(!err){
                        successCallBack && successCallBack(data);  //前端
                        resolve(data)  //后端
                    }else{
                        failCallBack && failCallBack(err);
                        reject(err)
                    }
                });
                stmt.finalize();
            })
        });
    }

    //根据id更新
    update_id(param){
        const self = this;
        const { params,successCallBack,failCallBack } = param;
        const { id,title,author,content }  = params;
        const updateTime = new Date().getTime();
        self.__db.serialize(()=>{
            const stmt = self.__db.prepare(SQL_UPDATE_ID);
            //更新数据
            stmt.run(title,author,content,updateTime,id,(err,data)=>{
                if(!err){
                    successCallBack && successCallBack(data);
                }else{
                    failCallBack && failCallBack(err);
                }
            });
            stmt.finalize();
        })
    }

    //获取所有数据的数量
    get_all_count(param){
        return new Promise((resolve,reject)=>{
            const self = this;
            const {successCallBack,failCallBack } = param;
            self.__db.serialize(()=>{
                const stmt = self.__db.prepare(SQL_GET_COUNT);
                //查询数据的数量
                stmt.get((err,data)=>{
                    if(!err){
                        successCallBack && successCallBack(data);
                        resolve(data);
                    }else{
                        failCallBack && failCallBack(err);
                        reject(err)
                    }
                });
                stmt.finalize();
            })
        })
    }

    //分页查询数据
    get_page(param){
        return new Promise((resolve, reject)=>{
            const self = this;
            const { params ,successCallBack,failCallBack } = param;
            const { pageIndex,pageSize } = params;
            self.__db.serialize(()=>{
                const stmt = self.__db.prepare(SQL_GET_PAGE);
                //查询多条
                stmt.all(pageSize,pageSize * pageIndex,(err,data)=>{
                    if(!err){
                        successCallBack && successCallBack(data);
                        resolve(data);
                    }else{
                        failCallBack && failCallBack(err);
                        reject(err)
                    }
                });
                stmt.finalize();
            })
        })
    }


}


module.exports = SQLiteStore;