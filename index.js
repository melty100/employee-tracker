var mysql = require("mysql");
var inquirer = require("inquirer");
var view = require("./view.js");
//const cTable = require('console.table');

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

async function main(){

    var done = false;

    while(!done){
        //Prompts user for query
        let ans = await inquirer.prompt(view.actionQuestion);

        //Begins the query
        let message = await startQuery(ans);

        //Asks user if they are done
        done = !(await inquirer.prompt(view.confirm));
    }

    connection.end();
}

function startQuery(ans){
    return new Promise((res, rej) => {

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
            case "Update role":
                updateRole();
                break;
            case "Update department":
                updateDepartment();
            default:
                return rej("Error");
        }
        return res("Success!");
    });
}
async function viewTable(table) {

    res = await getTableData(table)
    console.table(res);
};

function getTableData(table) {
    return new Promise((res, rej) => {

        connection.query('SELECT * FROM ?? ', [table], function (err, results) {
            return err ? rej(err) : res(results);
        });
    });
};

async function updateDepartment() {

    //Gets department table for inquirer questions
    let departmentData = await getTableData('department');

    let departmentChoices = Object.keys(departmentData).map((key) => {
        let row = departmentData[key];
        return `${row.name}`;
    });


    let questions = view.getUpdateDepartmentQuestions([...departmentChoices].sort());
    let ans = await inquirer.prompt(questions);

    //Gets the department id of the department the user selected;
    let department = ans['department'];
    let index = departmentChoices.indexOf(department);
    let departmentId = departmentData[index].id;

    let sql = `UPDATE department SET name = '${ans.name}' WHERE id = ${departmentId};`

    connection.query(sql, function (err, results) {
        if (err) console.log(err);

        console.table(results);
    });
}

async function updateRole() {

    //Gets department table for inquirer questions
    let roleData = await getTableData('role');
    let departmentData = await getTableData('department');

    //Creates an array of choices for user
    let departmentChoices = Object.keys(departmentData).map((key) => {
        let row = departmentData[key];
        return `${row.name}`;
    });

    //...
    let roleChoices = Object.keys(roleData).map((key) => {
        let row = roleData[key];
        return `${row.title}`;
    });

    //Gets the questions for updating a role
    let questions = view.getUpdateRoleQuestions([...roleChoices].sort(), [...departmentChoices].sort());

    //Prompts user
    let ans = await inquirer.prompt(questions);

    //Gets the role id of the role the user is updating
    let role = ans['role'];
    let index = roleChoices.indexOf(role);
    let roleId = roleData[index].id;

    //Gets the keys for column data we are updating
    let ansKeys = Object.keys(ans).slice(2);

    //Exits function if the user didnt choose any columns to update
    if (ansKeys.length == 0) {
        console.log("No column(s) was selected for update!")
        return -1;
    }

    //Transforms the department name the user selected into the department's id
    if (ansKeys.includes('department')) {
        let department = ans['department'];
        let index = departmentChoices.indexOf(department);
        ans['department'] = departmentData[index].id;
    }

    //Creates set clause(s) for sql statement
    let setStatements = ansKeys.map((key) => { return `${key} = '${ans[key]}'` }).join(", ");

    //Creates final sql statement for query
    let sql = `UPDATE role SET ${setStatements} WHERE id = ${connection.escape(roleId)};`;

    connection.query(sql, function (err, results) {
        if (err) console.log(err);

        console.table(results);
    });
}

async function updateEmployee() {

    //Gets table data for inquirer question lists
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

    //Transforms the manager name the user selected into the manager's id
    let employee = ans['employee'];
    let index = employeeChoices.indexOf(employee);
    let employeeId = employeeData[index].id;


    //Gets the keys for the column data user wants to update
    let ansKeys = Object.keys(ans).slice(2);

    if (ansKeys.length == 0) {
        console.log("No column(s) was selected for update!")
        return -1;
    }

    //Transforms the managers name in the ans obj into the manager's id
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
    let setStatements = ansKeys.map((key) => { return `${key} = '${ans[key]}'`; }).join(", ");
    let sql = `UPDATE employee SET ${setStatements} WHERE id = ${connection.escape(employeeId)};`;

    connection.query(sql, function (err, results) {
        if (err) console.log(err);

        console.table(results);
    });
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

