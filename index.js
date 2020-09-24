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
                case "Add department":
                    addDepartment();
                    break;
                case "Update employee":
                    updateEmployee();
                    break;
                default:
                    return "Error";
            }
        });

    //let res = await sqlOperation(ans);  

    // await inquirer.prompt(view.confirm).then((ans) => done = !ans.confirm);
}

async function viewTable(table) {

    res = await getTableData(table)
    console.table(res);
};

function getTableData(table) {
    return new Promise((res, rej) => {

        connection.query('SELECT * FROM ?? ', [table], function (err, results, fields) {
            return err ? rej(err) : res(results);
        });
    });
};

async function updateEmployee() {

    //Gets table data to for inquirer question lists
    let employeeData = await getTableData('employee');
    let roleData = await getTableData('role');

    //Formats list entries
    let employeeChoices = Object.keys(employeeData).map((key) => {
        let row = employeeData[key];
        return `${row.last_name}, ${row.first_name}`;
    });

    //....
    let roleChoices = Object.keys(roleData).map((key) => {
        let row = roleData[key];
        return `${row.title}`;
    });

    //Creates questions with sorted lists (spread so we maintain order for transforms)
    let questions = view.getUpdateEmployeeQuestions([...employeeChoices].sort(), [...roleChoices].sort());

    //Asks user for an employee record and the values to update on that record
    let ans = await inquirer.prompt(questions);

    //Transforms the employee name the user selected into the manager's id
    let employee = ans['employee'];
    let index = employeeChoices.indexOf(employee);
    let employeeId = employeeData[index].id;


    //Gets the keys for the column data user wants to update
    let ansKeys = Object.keys(ans).slice(2);

    console.log(ansKeys.length);

    if(ansKeys.length == 0){
        console.log("No column(s) was selected for update!")
        return -1;
    }
    
    //Transforms the managers name the user selected into the manager's id
    if (ansKeys.includes('manager_id')) {
        let manager = ans['manager_id'];
        let index = employeeChoices.indexOf(manager);
        ans['manager_id'] = employeeData[index].id;
    }

    //Transforms the role name the user selected into the role's id
    if (ansKeys.includes('role_id')) {
        let role = ans['role_id'];
        let index = roleChoices.indexOf(role);
        ans['role_id'] = roleData[index].id;
    }

    //Forms the set portion of the update statement
    let setStatements = ansKeys.map((key) => {return `${key} \= '${ans[key]}'`;}).join(", ");
    let sql = `UPDATE employee SET ${setStatements} WHERE id = ${connection.escape(employeeId)};`;

    connection.query(sql, function(err, results) {
        if(err) console.log(err);

        console.table(results);
    })
}


async function addDepartment() {


    //Gets questions for new department
    let questions = view.getAddDepartmentQuestions();

    //Prompts user for new department name information
    let ans = await inquirer.prompt(questions);

    //Gets string of columns for for string literal
    let columns = view.getTableColumns('department');

    let sql = `INSERT INTO department ${columns} VALUES ('${ans.name}')`;

    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        console.log('\n');
        console.log(results);
        console.log('\n');
    });
}

function addRole() {
    var sql = "SELECT * FROM department";


    connection.query(sql, async function (err, results, fields) {

        if (err) throw err;

        //console.table(results);

        //Gets row data from department table for inqurier question object
        let choices = Object.keys(results).map((key) => {
            let row = results[key];
            return row;
        });

        //Gets questions for new role
        let questions = view.getAddRoleQuestions(choices.map((row) => row.name));

        //Prompts user for new role information
        let ans = await inquirer.prompt(questions);

        //Sets variables for string literal
        let columns = view.getTableColumns('role');
        let row = choices.find((row) => { return row.name === ans.department });

        let sql = `INSERT INTO role ${columns} VALUES ('${ans.title}', '${ans.salary}', ${connection.escape(row.id)})`;

        connection.query(sql, function (err, results, fields) {
            if (err) throw err;
            console.log('\n');
            console.log(results);
            console.log('\n');
        });
    });
}

function addEmployee() {

    var sql = "SELECT * FROM role";

    connection.query(sql, async function (err, results, fields) {
        if (err) throw err;

        console.table(results);

        //Gets row data for inqurier question object
        let choices = Object.keys(results).map((key) => {
            let row = results[key];
            return { title: row.title, id: row.id };
        });

        //Sets the choices for possible roles for employee questions 
        let questions = view.getAddEmployeeQuestions(choices.map((row) => row.title));

        //Asks user for new employee information
        let ans = await inquirer.prompt(questions);

        //Sets up data for string literals
        let columns = view.getTableColumns('employee');
        let row = choices.find((row) => { return row.title === ans.roleName });
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

