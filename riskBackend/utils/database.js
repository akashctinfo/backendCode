const mysql = require('mysql2');

// const mysql=require('serverless-mysql')
const config=require('../config/config.json')

// const connection = mysql({
//     config:{ host:config.host,
//     user:config.user, 
//     password:config.password,
//     database:config.database
//     }
    
// });
const connection = mysql.createConnection({
   host:config.host,
    user:config.user, 
    password:config.password,
    database:config.database,
    ssl  : {
        // DO NOT DO THIS
        // set up your ca correctly to trust the connection
        rejectUnauthorized: false
      }
    
    
});
// "host": "mysqlriskdb.clrf4uqunvwd.us-east-2.rds.amazonaws.com",
// "user": "admin",
// "port":"3306",
// "password": "risk12345",
// "database": "risk"
// const conn = mysql.createConnection(config);
const util = require( 'util' );
function makeDb() {
    return {
        query( sql, args ) {
            console.log("db connected localhost")
            console.log(sql);
        return util.promisify( connection.query )
            .call( connection, sql, args );
        },
        close() {
            console.log("db not  connected localhost")

        return util.promisify( connection.end ).call( connection );
        }
    };
}
const db = makeDb();
module.exports = db;