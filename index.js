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

    var done = false;

    while (!done) {

        let ans = await inquirer.prompt(view.questions);

        await sqlOperation(ans);

        await inquirer.prompt(view.confirm).then((ans) => done = !ans.confirm);
    }

    connection.end();
}

function sqlOperation(ans){

    const sqlStatement = (action) =>{

        switch (action) {
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
                insertInto("employee", ans);
                break;

            default:
                return "Error";
        }

        return "Success!";
    }

    return Promise.resolve(sqlStatement(ans.action));
}

function viewTable(table) {

    connection.query('SELECT * FROM ?? ', [table], function (err, results, fields) {
        if(err) throw err;
        console.log('\n');
        console.table(results);
        console.log('\n');
    });
};

function insertInto(table, ans) {

    let columns = table === 'employee' ? '(first_name, last_name, role_id)':
                  table === 'role' ? '(name, salary)' : '(title, salary, department_id)';
    
    console.log(columns);
    //connection.query('')
}

function getRoles() {
    //connection.query('')
}

