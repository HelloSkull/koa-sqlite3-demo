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

const TABLE_NAME = 'article';

const SQL_CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                    id INTEGER PRIMARY  KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    author TEXT NOT NULL,
                    readNum INTEGER,
                    content TEXT NOT NULL,
                    createdTime INTEGER NOT NULL,
                    updatedTime INTEGER NOT NULL);`;

//获取数量
const SQL_GET_COUNT_NO_FILTER = `SELECT count(*) as cnt FROM ${TABLE_NAME}`;

// const SQL_DELETE = `DELETE FROM ${TABLE_NAME} WHERE id = ?`;

//下一条
const SQL_GET_NEXT = `SELECT *  FROM ${TABLE_NAME} WHERE  id > ?  ORDER BY id ASC LIMIT 1`;

//上一条
const SQL_GET_PREVIOUS = `SELECT *  FROM ${TABLE_NAME} WHERE  id < ?  ORDER BY id DESC LIMIT 1`;

// limit : 要显示多少条记录
// offset : 跳过多少条记录
const SQL_GET_PAGE_NO_FILTER = `SELECT * FROM ${TABLE_NAME} ORDER BY updatedTime DESC LIMIT ? OFFSET ? `;

const SQL_GET_ID =  `SELECT * FROM ${TABLE_NAME} WHERE id = ?`;

const SQL_UPDATE_ID = `UPDATE ${TABLE_NAME} SET title = ?,author = ?,content =?,updatedTime=? WHERE id = ?`;

const SQL_SET = `INSERT OR REPLACE INTO ${TABLE_NAME} (title, author,readNum,content,createdTime,updatedTime) VALUES (?, ?, ?, ?, ?, ?)`;

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
            const { title,author,readNum,content }  = params;
            const createdTime = new Date().getTime();
            const updatedTime = new Date().getTime();
            //serialize():将执行模式设置为序列化。这意味着最多只有一个语句对象可以一次执行查询
            // self.__db.serialize(()=>{
            //prepare() : 准备SQL语句，并可选地绑定指定的参数，并在完成后调用回调。该函数返回一个Statement对象。
            const stmt = self.__db.prepare(SQL_SET);
            stmt.run(title,author,readNum,content,createdTime,updatedTime,(err)=>{
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

    //批量删除
    back_batch_delete(params){
        return new Promise((resolve, reject)=>{
            const self = this;
            let { ids}  = params;
            ids = params.ids.split(",");
            console.log("ids ->",ids);
            let sqlTotal = "";
            ids.forEach((v,i)=>{
                v = parseInt(v);
                sqlTotal += `;DELETE FROM "${TABLE_NAME}" WHERE id = ${v}`;
            });
            // exex() 可以批量执行语句
            self.__db.exec(sqlTotal,(err)=>{
                if(!err){
                    resolve(1);
                }else{
                    reject(0);
                    console.log("batch_delete error->",err);
                }
            });
        });
    }

    //根据id找数据
    back_get_id(params){
        return new Promise((resolve, reject)=>{
            const self = this;
            const { id }  = params;
            const stmt = self.__db.prepare(SQL_GET_ID);
            //查询单条
            stmt.get(id,(err,data)=>{
                if(!err){
                    resolve(data);
                }else{
                    reject(0);
                    console.log("get_id error->",err);
                }
            });
            stmt.finalize();
        });
    }

    //根据id更新
    back_update_id(params){
        return new Promise((resolve,reject)=>{
            const self = this;
            const { id,title,author,content }  = params;
            const updatedTime = new Date().getTime();
            const stmt = self.__db.prepare(SQL_UPDATE_ID);
            //更新数据
            stmt.run(title,author,content,updatedTime,id,(err,data)=>{
                if(!err){
                    resolve(1)
                }else{
                    reject(0);
                    console.log("update_id error->",err);
                }
            });
            stmt.finalize();
        })
    }

    //获取所有数据的数量
    back_get_all_count(params){
        return new Promise((resolve,reject)=>{
            const self = this;
            const { filterUserName} = params;
            let SQL_GET_COUNT = SQL_GET_COUNT_NO_FILTER;
            if(filterUserName){
                SQL_GET_COUNT = `SELECT count(*) as cnt FROM ${TABLE_NAME}
                WHERE author LIKE '%${filterUserName}%'   
                OR title LIKE '%${filterUserName}%'
                OR content LIKE '%${filterUserName}%'`;
            }
            const stmt = self.__db.prepare(SQL_GET_COUNT);
            //查询数据的数量
            stmt.get((err,data)=>{
                if(!err){
                    resolve(data);
                }else{
                    reject(0);
                    console.log("get_all_count error->",err);
                }
            });
            stmt.finalize();
        })
    }

    //分页查询数据
    back_get_page(params){
        return new Promise((resolve, reject)=>{
            const self = this;
            const { offset,limit,filterUserName} = params;
            let SQL_GET_PAGE = SQL_GET_PAGE_NO_FILTER;
            console.log("filterUserName->",filterUserName);
            if(filterUserName){
                SQL_GET_PAGE = `SELECT * FROM ${TABLE_NAME} 
            WHERE author LIKE '%${filterUserName}%'   
            OR title LIKE '%${filterUserName}%'
            OR content LIKE '%${filterUserName}%'
            ORDER BY updatedTime DESC
            LIMIT ? OFFSET ?`;
            }

            const stmt = self.__db.prepare(SQL_GET_PAGE);
            //查询多条
            stmt.all(limit,(offset -1) * limit,(err,data)=>{
                if(!err){
                    resolve(data);
                }else{
                    reject(0);
                    console.log("get_page error->",err);
                }
            });
            stmt.finalize();
        })
    }
    //查找上一条
    front_get_page_previous (params){
        return new Promise((resolve, reject)=>{
            const self = this;
            const { id } = params;
            const stmt = self.__db.prepare(SQL_GET_PREVIOUS);
            stmt.all(id,(err,data)=>{
                if(!err){
                    resolve(data);
                }else{
                    reject(0);
                    console.log("get_page_previous error->",err);
                }
            });
            stmt.finalize();
        })
    }

    //查找下一条
    front_get_page_next (params){
        return new Promise((resolve, reject)=>{
            const self = this;
            const { id } = params;
            console.log("id ->",id);
            const stmt = self.__db.prepare(SQL_GET_NEXT);
            stmt.all(id,(err,data)=>{
                if(!err){
                    resolve(data);
                }else{
                    reject(0);
                    console.log("get_page_next error->",err);
                }
            });
            stmt.finalize();
        })
    }


}


module.exports = SQLiteStore;