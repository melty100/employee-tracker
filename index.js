var mysql = require("mysql");
var inquirer = require("inquirer");
var questions = [
    {
        type: "list",
        message: "Would you like to view, add, or update table data?",
        choices: ["View", "Add", "Update"],
        name: "action"
    },
    {
        type: "list",
        message: "Which table are you acting on?",
        choices: ["employee", "role", "department"],
        when: (ans) => ans.action == "View" || ans.action == "Add",
        name: "table"
    },
    {
        type: "input",
        message: "Enter new department name",
        when: (ans) => ans.action == 'Add' && ans.table == 'department',
        name: "department"
    },
    {
        type: "input",
        message: "Enter employee's first name.",
        when: (ans) => ans.action == 'Add' && ans.table == "employee",
        name: "employeeFn"
    },
    {
        type: "input",
        message: "Enter employee's last name.",
        when: (ans) => ans.action == 'Add' && ans.table == "employee",
        name: "employeeLn"
    },
    {
        type: "input",
        message: "Enter employee's role id",
        when: (ans) => ans.action == 'Add' && ans.table == "employee",
        name: "employeeRoleId"
    },
    {
        type: "input",
        message: "Enter employee's manager id",
        when: (ans) => ans.action == "Add" && ans.table == "employee",
        name: "managerId"
    },
    {
        type: "confirm",
        message: "Are you done querying employee_db?",
        name: "done"
    }
]

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

    let done = false;
    ans = inquirer.prompt(questions);
    
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


    connection.end();
});

function insertInto(ans) { };
function viewTable(ans) { };
function updateTable(ans) { };
