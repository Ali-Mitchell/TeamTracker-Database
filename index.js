const inquirer = require('inquirer');
const db = require('./db/connection');


async function questionPrompt () {
    const {selectAction}  = await inquirer.prompt({
        type: 'list',
        name:'selectAction',
        message: 'Select an action',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add department', 'Add role', 'Add employee', 'Update employee role', 'Quit']
    });
    
    switch (selectAction){
        case 'View all departments':
            viewDepartments();
            break;
        case 'View all roles':
            viewRoles();
            break;
        case 'View all employees':
            viewEmployees();
            break;
        case 'Add department':
            addDepartment();
            break;
        case 'Add role':
            addRole();
            break;
        case 'Add employee':
            addEmployee();
            break;
        case 'Update employee role': 
            updateRole();
            break;
        default: 
            process.exit();
    }
};

//view all departments
async function viewDepartments(){
    const depts = await db.promise().query(`SELECT * FROM departments`);
    console.table(depts[0]);
    questionPrompt();
};

//view all roles
async function viewRoles(){
    const roles = await db.promise().query(`SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles
                                                LEFT JOIN departments ON roles.department_id = departments.id`);
    console.table(roles[0]);
    questionPrompt();
};

//view all employees
async function viewEmployees(){
    // why do we need an await on the database query?
    // a query is basically pulling data from the database and returning that into the const employees
    const employees = await db.promise().query(
        `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS title, departments.name AS department, roles.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees 
        LEFT JOIN employees manager ON manager.id = employees.manager_id 
        LEFT JOIN roles ON employees.role_id = roles.id 
        LEFT JOIN departments ON departments.id = roles.department_id`);
    console.table(employees[0]);
    // why do we need a 0 index in this console?
    // My employee seeds are not feeding into the database, and it's breaking the add employee function 
    questionPrompt();
};

//add a department
async function addDepartment(){

    const addDept = await inquirer.prompt([
        {
            type: 'input',
            name: 'deptName',
            message: 'What is the name of the new department?'
        }
    ])

    let answer = addDept.deptName;
    await db.promise().query(`INSERT INTO departments(name) VALUE (?)`, answer);
    console.log(`______________________________________`);
    console.log(`The ${answer} department has been added!`);
    questionPrompt();
};

//add role
async function addRole() {
    const depts = await db.promise().query(`SELECT * FROM departments`);
    // What is going on here? Can we walk through this 
    const deptNames = depts[0].map((names) => {
        return {
            name: names.name,
            value: names.id
        }
    });

    const newRole = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the role title?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the roles salary?'
        },
        {
            type: 'list',
            name: 'department',
            message: 'What department does this role belong to?',
            choices: deptNames
        }
    ]);
    let answer = [newRole.title, newRole.salary, newRole.department];
    await db.promise().query(`INSERT INTO roles(title, salary, department_id) VALUES (?,?,?)`, answer);
    console.log(`=======================================`);
    console.log(`The position of ${newRole.title} has been added!`);
    console.log(`=======================================`);
    questionPrompt();
};

//add employee 
async function addEmployee(){
    const position = await db.promise().query(`SELECT * FROM roles`);
    const boss = await db.promise().query(`SELECT * FROM employees`);
    const allRoles = position[0].map((role) => {
        return{
            name: role.title,
            value: role.id
        }
    });
    const allBosses = boss[0].map((manager) => {
        return {
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id
        }
    });

    // console.log(allBosses.length);
    // if(allBosses.length === 0 ){
        allBosses.push({ name: 'N/A', value : null})
    
    console.log(allBosses);

    const newEmpl = await inquirer.prompt([
        {
            type:'input',
            name: 'firstName',
            message: 'Please provide new employees first name'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Please provide new employees last name'
        },
        {
            type: 'list',
            name: 'role',
            message: 'Specify the new employees role:',
            choices: allRoles
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Select a manager:',
            choices: allBosses,
        }
    ]);

    const answers = [newEmpl.firstName, newEmpl.lastName, newEmpl.role, newEmpl.manager];
    await db.promise().query(`INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, answers);
    console.log(`================================`);
    console.log(`Welcome to the team, ${newEmpl.firstName}!`);
    console.log(`================================`);
    questionPrompt();
};

//update employee role
async function updateRole() {
    //cycle through both arrays and create new arrays with same information using maps
    //return object with employee and role info
    const allEmployees = await db.promise().query(`SELECT * FROM employees`);
    const allRoles = await db.promise().query(`SELECT * FROM roles`);
    const employeeChoices = allEmployees[0].map((person) => {
        console.log(person);
        return {
            name: `${person.first_name} ${person.last_name}`,
            value: person.id
            }
    });
    
    const roleChoices = allRoles[0].map((role) => {
        console.log(role);
        return {
            name: role.title,
            value: role.id
        }
    });

    const { employeeId, roleId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee would you like to update?',
            choices: employeeChoices
        }, 
        {
            type: 'list',
            name: 'roleId',
            message: 'What is their new role?',
            choices: roleChoices
        }]);

    await db.promise().query(`UPDATE employees SET role_id = ? WHERE id = ?`, [roleId, employeeId]);
    console.log(`================================`);
    console.log('Successfully updated employee!');
    console.log(`================================`);
    questionPrompt();
};

questionPrompt();