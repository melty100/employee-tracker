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

// These functions return paramaterized questions for inquirer
var getAddEmployeeQuestions = (roleChoices) => {
    return [
    {
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

var getAddRoleQuestions = (departmentChoices) => {
    return [
    {
        type: "input",
        message: "Enter new role name",
        name: "title"
    },
    {
        type: "input",
        message: "Enter salary",
        name: "salary"
    },
    {
        type: "list",
        message: "Choose the department for new role",
        choices: departmentChoices,
        name: "department"
    }];
};

var getAddDepartmentQuestions = () => {
    return [
        {
            type: "input",
            message: "Enter new department name",
            name: "name"
        }
    ];
}

var getUpdateEmployeeQuestions = (employeeChoices, roleChoices) => {
    return [
        {
            type: "list",
            message: "Choose which employee record to update",
            choices: employeeChoices,
            name: "employee"
        },
        {
            type: "checkbox",
            message: "Select which column data you would like to update",
            choices: [
                {name: "First Name", checked: false},
                {name: "Last Name", checked: false},
                {name: "Role", checked: false},
                {name: "Manager", checked: false}
            ],
            name: "setColumns"
        },
        {
            type: "input",
            message: "Enter new first name",
            when: (ans) => ans.setColumns.includes('First Name'),
            name: "first_name"
        },
        {
            type: "input",
            message: "Enter new last name",
            when: (ans) => ans.setColumns.includes('Last Name'),
            name: "last_name"
        },
        {
            type: "list",
            message: "Enter new role",
            when: (ans) => ans.setColumns.includes('Role'),
            choices: roleChoices,
            name: "role_id"
        },
        {
            type: "list",
            message: "Enter new Manager",
            when: (ans) => ans.setColumns.includes('Manager'),
            choices: employeeChoices,
            name: "manager_id"
        }
    ]
}

var getTableColumns = (table) => {

    switch (table) {
        case 'employee':
            return '(first_name, last_name, role_id)';
            break;
        case 'role':
            return '(title, salary, department_id)'
            break;
        case 'department':
            return '(name)';
            break;
        default:
            break;
    }

    return '';
}

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
    getAddEmployeeQuestions,
    getAddRoleQuestions,
    getAddDepartmentQuestions,
    getUpdateEmployeeQuestions ,
    getTableColumns
}

