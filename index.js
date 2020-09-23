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

    main();
});

async function main() {


        await inquirer
        .prompt(view.actionQuestion)
        .then((ans) => {
            switch (ans.action) {
                case "View all employees":
                    viewTable("employee");
                    break;
                case "View all roles":
                    viewTable("role")
                    break;
                case "View all departments":
                    viewTable("department");
                    break;
                case "Add employee":
                    addEmployee();
                    break;
                case "Add role":
                    addRole();
                    break;
                default:
                    return "Error";
            }
        });

        //let res = await sqlOperation(ans);  

       // await inquirer.prompt(view.confirm).then((ans) => done = !ans.confirm);
}

function viewTable(table) {

    connection.query('SELECT * FROM ?? ', [table], function (err, results, fields) {
        if (err) throw err;
        console.log('\n');
        console.table(results);
        console.log('\n');
    });
};

function addRole() {
    var sql = "SELECT * FROM department";

    connection.query(sql, async function(err, results, fields) {

        if (err) throw err;

        console.table(results);

        //Gets row data from department table for inqurier question object
        let choices = Object.keys(results).map((key) => {
            let row = results[key];
            return row;
        });

        let questions = view.getAddRoleQuestions(choices.map((row) => row.name));

        let ans = await inquirer.prompt(questions);

        let columns = view.getTableColumns('role');
        let row = choices.find((row) => {return row.name === ans.department});

        let sql = `INSERT INTO role ${columns} VALUES ('${ans.title}', '${ans.salary}', ${connection.escape(row.id)})`;

        connection.query(sql, function (err, results, fields) {
            if (err) throw err;
            console.log('\n');
            console.log(results);
            console.log('\n');
        });
    })
}

function addEmployee() {

    var sql = "SELECT * FROM role";

    connection.query(sql, async function (err, results, fields) {
        if (err) throw err;

        console.table(results);

        //Gets row data for inqurier question object
        let choices = Object.keys(results).map((key) => {
            let row = results[key];
            return {title: row.title, id: row.id};
        });

        //Sets the choices for possible roles for employee questions 
        let questions = view.getAddEmployeeQuestions(choices.map((row) => row.title));

        //Asks user for new employee information
        let ans = await inquirer.prompt(questions);

        //Sets up data for string literals
        let columns = view.getTableColumns('employee');
        let row = choices.find((row) => {return row.title === ans.roleName});
        //let {firstName, lastName, ...ans} = ans;

        let sql = `INSERT INTO employee ${columns} VALUES ('${ans.firstName}', '${ans.lastName}', ${connection.escape(row.id)})`;

        console.log(sql);

        connection.query(sql, function (err, results, fields) {
            if (err) throw err;
            console.log('\n');
            console.log(results);
            console.log('\n');
        });
    });
    //connection.query('')
}

