const inquirer = require('inquirer');
const db = require('./db/connection');

db.connect(err => {
    if (err) throw err;
    console.log('Database is connected');
    employee_tracker();
});

var employee_tracker = function () {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role"]
    }]).then((answers) => {
        if (answer.prompt === "View all Departments") {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Departments: ");
                console.log(result);
                employee_tracker();
            });
        } else if (answers.prompt === "View All Roles") {
            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Roles: ");
                console.log(result);
                employee_tracker();
            });
        } else if (answers.prompt === "View All Employees") {
            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Employees: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === "Add a Department") {
            inquirer.prompt([{
                type: 'input',
                name: 'department',
                message: 'What is the name of the dpeartment?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log("Please Add A Department!");
                        return false;
                    }
                }
            }]).then((answers) => {
                db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.department} to the database.`)
                    employee_tracker();
                });
            })
        } else if (answers.prompt === "Add A Role") {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: 'What is the name of the role?',
                    validate: roleInput => {
                        if (roleInput) {
                            return true;
                        } else {
                            console.log("Please Add A Role!");
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role?',
                    validate: salaryInput => {
                        if (salaryInput) {
                            return true;
                        } else {
                            console.log("Please Add A Salary!");
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'department',
                    message: 'Which department does the role from?',
                    validate: departmentInput => {
                        if (departmentInput) {
                            return true;
                        } else {
                            console.log("Please Add The Department!");
                            return false;
                        }
                    }
                }
            ]).then((answers) => {
                db.query(`INSERT INTO role (title, salary, department) VALUES (?, ?, ?)`, [answers.role, answers.salary, answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.role} to the database.`)
                    employee_tracker();
                });
            })
        } else if (answers.prompt === 'Add An Employee') {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the Employees first name?',
                    validate: firstNameInput => {
                        if (firstNameInput) {
                            return true;
                        } else {
                            console.log("Please Add A First Name!");
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'role',
                    message: 'What is the Employees role?',
                    validate: roleInput => {
                        if (roleInput) {
                            return true;
                        } else {
                            console.log("Please Add The Department!");
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'manager',
                    message: 'Who is the Employees Manager?',
                    validate: managerInput => {
                        if (managerInput) {
                            return true;
                        } else {
                            console.log("Please Add A Manager!");
                            return false;
                        }
                    }
                }
            ]).then((answers) => {
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, answers.role, answers.manager], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.role} to the database.`)
                    employee_tracker();
                });
            })
        } else if (answers.prompt === 'Update An Employee Role') {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'employee',
                    message: "Which Employees role do you want to update?",
                    validate: employeeInput => {
                        if (employeeInput) {
                            return true;
                        } else {
                            console.log('Please Add A Department!');
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'role',
                    message: 'What is their new role?',
                    validate: roleInput => {
                        if (roleInput) {
                            return true;
                        } else {
                            console.log("Please Add A Role!");
                            return false;
                        }
                    }
                }
            ]).then((answers) => {
                db.query(`UPDATE employee SET role_id = ? WHERE last_name = ?`, [answers.role, answers.lastName], (err, result) => {
                    if (err) throw err;
                    console.log(`Updated ${answers.lastName} role to the database.`)
                    employee_tracker();
                });
            })
        } else if (answers.prompt === 'Log Out') {
            db.end();
            console.log("Good-Bye!");
        }
    })
};