// Variable Definitions & Dependencies
const inquirer = require('inquirer');
const db = require('./db/connection');

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    employee_tracker();
});

var employee_tracker = function () {
    inquirer.prompt([{
        // Begin Command Line
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View All Department', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
    }]).then((answers) => {
        // Views the Department Table in the Database
        if (answers.prompt === 'View All Department') {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Departments: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Roles') {
            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Roles: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Employees') {
            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Employees: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'Add A Department') {
            inquirer.prompt([{
                // Adding a Department
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please Add A Department!');
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
        } else if (answers.prompt === 'Add A Role') {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                inquirer
                  .prompt([
                    {
                      type: "input",
                      name: "role",
                      message: "Enter name for new role:",
                      validate: (input) => {
                        if (input) {
                          return true;
                        } else {
                          console.log("Please enter a role name!");
                          return false;
                        }
                      },
                    },
                    {
                      type: "number",
                      name: "salary",
                      message: "Enter salary:",
                      validate: (input) => {
                        if (input) {
                          return true;
                        } else {
                          console.log("Please enter a salary!");
                          return false;
                        }
                      },
                    },
                    {
                      type: "list",
                      name: "department",
                      message: "Select department to assign role to.",
                      choices: () => {
                        var deptsArray = [];
                        for (var i = 0; i < result.length; i++) {
                          deptsArray.push(result[i].name);
                        }
                        return deptsArray;
                      },
                    },
                  ])
                  .then((answers) => {
                    for (var i = 0; i < result.length; i++) {
                      if (result[i].name === answers.department) {
                        var department = result[i];
                        console.log(department);
                      }
                    }
                    db.query(
                      `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                      [answers.role, answers.salary, department.id],
                      (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.role} to the database.`);
                        employee_tracker();
                      }
                    );
                  });
            });
        } else if (answers.employee_tracker === 'Log Out') {
            db.end();
            console.log("Good-Bye!");
        }         else if (answers.prompt === 'Add An Employee') {
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;
                inquirer
                  .prompt([
                    {
                      type: "input",
                      name: "first",
                      message: "Enter first name: ",
                      validate: (firstNameinput) => {
                        if (firstNameinput) {
                          return true;
                        } else {
                          console.log("Please enter first name of new employee!");
                          return false;
                        }
                      },
                    },
                    {
                      type: "input",
                      name: "last",
                      message: "Enter last name: ",
                      validate: (lastNameinput) => {
                        if (lastNameinput) {
                          return true;
                        } else {
                          console.log("Please enter last name of new employee!");
                          return false;
                        }
                      },
                    },
                    {
                      type: "list",
                      name: "role",
                      message: "Choose employees role: ",
                      choices: selectRole(),
                    },
                    {
                      type: "rawlist",
                      name: "manager",
                      message: "Enter name of employees manager:",
                      choices: selectManager(),
                    },
                  ])
                  .then(function (data) {
                    var roleId = selectRole().indexOf(data.role) + 1;
                    var managerId = selectManager().indexOf(data.manager) + 1;
                    db.query(
                      "INSERT INTO employee SET ?",
                      {
                        first_name: data.first,
                        last_name: data.last,
                        role_id: roleId,
                        manager_id: managerId,
                      },
                      function (err) {
                        if (err) throw err;
                        console.log(`Added ${data.first} to company database!`);
                        employee_tracker();
                      }
                    );
                  });
            });
        } else if (answers.prompt === 'Update An Employee Role') {
            // Calling the database to acquire the roles and managers
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // Choose an Employee to Update
                        type: 'list',
                        name: 'employee',
                        message: 'Which employees role do you want to update?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            var employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    },
                    {
                        // Updating the New Role
                        type: 'list',
                        name: 'role',
                        message: 'What is their new role?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((answers) => {
                    // Comparing the result and storing it into the variable
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].last_name === answers.employee) {
                            var name = result[i];
                        }
                    }

                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }

                    db.query(`UPDATE employee SET ? WHERE ?`, [{ role_id: role }, { last_name: name }], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated ${answers.employee} role to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Log Out') {
            db.end();
            console.log("Good-Bye!");
        }
    })
};
var roleArr = [];
function selectRole() {
  db.query("SELECT * FROM role", function (err, result) {
    if (err) throw err;
    for (var i = 0; i < result.length; i++) {
      roleArr.push(result[i].title);
    }
  });
  return roleArr;
}

var managersArr = [];
function selectManager() {
  db.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    function (err, result) {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
        managersArr.push(result[i].first_name);
      }
    }
  );
  return managersArr;
}

