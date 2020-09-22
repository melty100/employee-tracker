var mysql = require("mysql");
var inquirer = require("inquirer");
var view = require("./view.js");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "employee_db",
    multipleStatements: true
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    /*connection.query('SELECT * FROM ??', ['employee'], function (err, results, fields) {
        if (err) throw err;
        console.table(results);
    });*/

    userPrompt();
});

async function userPrompt() {

    let done = false;

    while (!done) {

        let ans = await inquirer.prompt(view.questions);

        switch (ans.action) {
            case "View":
                viewTable(ans);
                break;

            case "Add":

                break;

            case "Update":

            default:
        }

        let confirm = await inquirer.prompt(view.confirm);
        done = confirm.done;
    }

    connection.end();
}

function insertInto(ans) {


};
function viewTable(ans) {

    //var sql = 'SELECT * FROM ' + connection.escape(ans.table);
    connection.query('SELECT * FROM ?? ', [ans.table], function (err, results, fields) {
        if (err) throw err;
        console.table(results);
        console.log('\n');
    });
};



function updateTable(ans) { };
