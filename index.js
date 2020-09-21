var mysql = require("mysql");
var inquirer = require("inquirer");
var questions = require("./questions.js");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    promptUser(questions.list);


    connection.end();
});

async function promptUser(quest){
    let done = false;

    while(!done){

        let ans = await inquirer.prompt(questions.list);

        switch (ans.action) {
            case "View":
                viewTable(ans);
                break;
            case "Add":
                insertInto(ans);
                break;
            case "View":
                updateTable(ans);
                break;
            default:
                break;
        }

        done = ans.done;

    }
}

function insertInto(ans) { };
function viewTable(ans) { };
function updateTable(ans) { };
