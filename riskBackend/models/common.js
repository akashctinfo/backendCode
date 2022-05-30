const db = require('../utils/database');
module.exports={
    insertData :(async (table, where, data) => {
        return db.query(`insert into ${table} set ? ${where}` ,[data]);
    }),
    updateData:(async (table, where, data) => {
        return db.query(`update ${table} SET ? ${where}` ,[data]);
    }),
    getData: (async(table, where) => {
        return db.query(`select * from ${table} ${where}`);  
    }),
    deleteData :(async (table,where) => {
        return db.query(`Delete from ${table} ${where}`);
    }),
    fetchCount :(async (table,where) => {
        return db.query(`select  count(*) as total from ${table} ${where}`);
    })
}