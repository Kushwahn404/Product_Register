var mysql = require("mysql")
var pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mydatabasePassword",
    database: "productregisterdatabase",
    connectionLimit: 100,
    multipleStatements: true,
});
module.exports = pool;
