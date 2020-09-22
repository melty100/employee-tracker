var questions = [
    {
        type: "list",
        message: "What would you like to do?",
        choices: ["View all employees", "Add employee", "Update employee", "Remove employee",
                  "View all departments", "Add department", "Update department",
                  "View all roles", "Add role", "Update role"],

        name: "action"
    },
    //Qusetions for departments
    {
        type: "input",
        message: "Enter new department name",
        when: (ans) => ans.action == 'Add department',
        name: "department"
    },
    //Quesitons adding employee
    {
        type: "input",
        message: "Enter employee's first name.",
        when: (ans) => ans.action == 'Add employee',
        name: "employeeFirstName"
    },
    {
        type: "input",
        message: "Enter employee's last name.",
        when: (ans) => ans.action == 'Add employee',
        name: "employeeLastName"
    },
    {
        type: "input",
        message: "Enter employee's role id",
        when: (ans) => ans.action == 'Add employee',
        name: "employeeRoleId"
    },
    {
        type: "input",
        message: "Enter employee's manager id",
        when: (ans) => ans.action == "Add employee",
        name: "managerId"
    }
]

var confirm = [
    {
        type: "list",
        message: "Are you done querying employee_db?",
        choices: ["Yes", "No"],
        name: "done"
    }
]

module.exports = {
    questions,
    confirm
}

