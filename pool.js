var mysql = require("mysql")
var pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Nitin@290898",
    database: "productregisterdatabase",
    connectionLimit: 100,
    multipleStatements: true,
});
module.exports = pool;