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
        name: "employeeFirstName"
    },
    {
        type: "input",
        message: "Enter employee's last name.",
        when: (ans) => ans.action == 'Add' && ans.table == "employee",
        name: "employeeLastName"
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
    }
]

var confirm = [
    {
        type: "confirm",
        message: "Are you done querying employee_db?",
        name: "done"
    }
]

module.exports = {
    questions,
    confirm
}

