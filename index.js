const inquirer = require("inquirer");
const db = require("./db");

require("console.table");

const init = () => {
  startMenu();
};

const startMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "startMenu",
        message: "Choose an option",
        choices: [
          "View all employees",
          "View all departments",
          "View all roles",
          "Add an employee",
          "Add a department",
          "Add a role",
          "Update employee's role",
          "I'm done for now, thanks.",
        ],
      },
    ])
    .then((response) => {
      switch (response.startMenu) {
        case "View all employees":
          viewAllEmployees();
          break;
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Update employee's role":
          updateEmployeeRole();
          break;
        case "Delete an employee":
          delEmployee();
          break;
        case "I'm done for now, thanks.":
          quit();
          break;
      }
    });
};

const viewAllEmployees = () => {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.table(employees);
    })
    .then(() => startMenu());
};

const viewAllDepartments = () => {
  db.findDepartment()
    .then(([rows]) => {
      let departments = rows;
      console.table(departments);
    })
    .then(() => startMenu());
};

const viewAllRoles = () => {
  db.findRole()
    .then(([rows]) => {
      let roles = rows;
      console.table(roles);
    })
    .then(() => startMenu());
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is your employee's first name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is your employee's last name?",
      },
    ])
    .then((response) => {
      let firstName = response.first_name;
      console.log(firstName);
      let lastName = response.last_name;
      console.log(lastName);
      db.findRole().then(([rows]) => {
        let roles = rows;
        const roleOptions = roles.map(({ role_id, title }) => ({
          name: title,
          value: role_id,
        }));
        inquirer
          .prompt([
            {
              name: "role_id",
              type: "list",
              message: "What is your employee's role?",
              choices: roleOptions,
            },
          ])
          .then((response) => {
            let roleID = response.role_id;
            console.log(roleID);
            db.findAllEmployees().then(([rows]) => {
              let employees = rows;
              const managerOptions = employees.map(
                ({ id, first_name, last_name }) => ({
                  name: `${first_name} ${last_name}`,
                  value: id,
                })
              );
              managerOptions.unshift({ name: "None", value: null });
              console.log(managerOptions);
              inquirer
                .prompt([
                  {
                    name: "manager_id",
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: managerOptions,
                  },
                ])
                .then((response) => {
                  let managerID = response.manager_id;
                  console.log(managerID);
                  let employees = {
                    first_name: firstName,
                    last_name: lastName,
                    role_id: roleID,
                    manager_id: managerID,
                  };
                  db.createAnEmployee(employees)
                    .then(() =>
                      console.log("Your employee was added to the database!")
                    )
                    .then(() => viewAllEmployees());
                });
            });
          });
      });
    });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What is the department name?",
      },
    ])
    .then((response) => {
      let department = response.department;
      db.createDepartment(department);
    })
    .then(() => console.log("Your department was added to the database!"))
    .then(() => viewAllDepartments());
};

const addRole = () => {
  db.findDepartment().then(([rows]) => {
    let departments = rows;
    const departmentOptions = departments.map(({ department_id, department_name }) => ({
        name: department_name,
        value: department_id,
      })
    );
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the role you would like to add",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for this role?",
        },
        {
          name: "department_id",
          type: "list",
          message: "Which department is this role in?",
          choices: departmentOptions,
        },
      ])
      .then((response) => {
        db.createRole(response)
          .then(() => console.log("Your new role was added to the database!"))
          .then(() => viewAllRoles());
      });
  });
};
const updateEmployeeRole = () => {
  db.findAllEmployees().then(([rows]) => {
    let employees = rows;
    const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    inquirer
      .prompt([
        {
          name: "employee_id",
          type: "list",
          message: "Choose an employee to update",
          choices: employeeOptions,
        },
      ])
      .then((response) => {
        let employeeID = response.employee_id;
        db.findRole().then(([rows]) => {
          let roles = rows;
          const roleOptions = roles.map(({ role_id, title }) => ({
            name: title,
            value: role_id,
          }));
          inquirer
            .prompt([
              {
                name: "role_id",
                type: "list",
                message: "What is this employee's new role?",
                choices: roleOptions,
              },
            ])
            .then((response) => {
              let roleID = response.role_id;
              db.updateEmployeeRole(employeeID, roleID)
                .then(() => console.log("Employee has been updated"))
                .then(() => viewAllEmployees());
            });
        });
      });
  });
};

const quit = () => {
  console.log("Thanks for using Employee Tracker. Bye!");
  process.exit();
};

init();
