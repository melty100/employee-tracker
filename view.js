var actionQuestion = [
    {
        type: "list",
        message: "What would you like to do?",
        choices: ["View all employees", "Add employee", "Update employee", "Remove employee",
                  "View all departments", "Add department", "Update department",
                  "View all roles", "Add role", "Update role"],

        name: "action"
    }
];

var getAddEmployeeQuestions = (roleChoices) => {
    return [{
        type: "input",
        message: "Enter employee's first name.",
        name: "firstName"
    },
    {
        type: "input",
        message: "Enter employee's last name.",
        name: "lastName"
    },
    {
        type: "list",
        message: "Enter employee's role",
        choices: roleChoices,
        name: "roleName"
    },
    {
        type: "input",
        message: "Enter employee's manager id",
        name: "managerId"
    }];
};

/*
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
        name: "firstName"
    },
    {
        type: "input",
        message: "Enter employee's last name.",
        when: (ans) => ans.action == 'Add employee',
        name: "lastName"
    },
    {
        type: "input",
        message: "Enter employee's role",
        when: (ans) => ans.action == 'Add employee',
        name: "employeeRole"
    },
    {
        type: "input",
        message: "Enter employee's manager id",
        when: (ans) => ans.action == "Add employee",
        name: "managerId"
    }
]
*/
var confirm = [
    {
        type: "list",
        message: "Are you done querying employee_db?",
        choices: ["Yes", "No"],
        name: "done"
    }
]

module.exports = {
    actionQuestion,
    confirm,
    getAddEmployeeQuestions
}

