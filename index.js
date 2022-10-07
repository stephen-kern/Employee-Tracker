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
          "View employees",
          "View departments",
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
        case "View employees":
          viewEmployees();
          break;
        case "View departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "Add an employee":
          addEmp();
          break;
        case "Add a department":
          addDep();
          break;
        case "Add a role":
          addRole();
          break;
        case "Update employee's role":
          updateRole();
          break;
        case "Delete an employee":
          delEmp();
          break;
        case "I'm done for now, thanks.":
          quit();
          break;
      }
    });
};

const viewEmployees = () => {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => startMenu());
};

const viewDepartments = () => {
  db.findDepartment()
    .then(([rows]) => {
      let departments = rows;
      console.log("\n");
      console.table(departments);
    })
    .then(() => startMenu());
};
const viewRoles = () => {
  db.findRole()
    .then(([rows]) => {
      let roles = rows;
      console.log("\n");
      console.table(roles);
    })
    .then(() => startMenu());
};
const addEmp = () => {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is your employees first name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is your employees last name?",
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
              const manOptions = employees.map(
                ({ id, first_name, last_name }) => ({
                  name: `${first_name} ${last_name}`,
                  value: id,
                })
              );
              manOptions.unshift({ name: "None", value: null });
              console.log(manOptions);
              inquirer
                .prompt([
                  {
                    name: "manager_id",
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: manOptions,
                  },
                ])
                .then((response) => {
                  let managerID = response.manager_id;
                  console.log(managerID);
                  let employees = {
                    first_name: firstName,
                    last_name: last_name,
                    role_id: roleID,
                    manager_id: managerID,
                  };
                  db.createAnEmployee(employees)
                    .then(() =>
                      console.log("Your employee was added to the database!")
                    )
                    .then(() => viewEmployees());
                });
            });
          });
      });
    });
};

const addDep = () => {
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
    .then(() => viewDepartments());
};

const addRole = () => {
  db.findDepartment().then(([rows]) => {
    let departments = rows;
    const depOptions = departments.map(
      ({ department_id, department_name }) => ({
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
          choices: depOptions,
        },
      ])
      .then((response) => {
        db.createRole(response)
          .then(() => console.log("Your new role was added to the database!"))
          .then(() => viewRoles());
      });
  });
};
const updateRole = () => {
  db.findAllEmployees().then(([rows]) => {
    let employees = rows;
    const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    inquirer
      .prompt([
        {
          name: "id",
          type: "list",
          message: "Choose an employee to update",
          choices: employeeOptions,
        },
      ])
      .then((respsonse) => {
        let employeeID = response.id;
        db.findRole().then(([rows]) => {
          let roles = rows;
          const roleOptions = roles.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                name: "role_id",
                type: "list",
                message: "What is the new role for this employee?",
                choices: roleOptions,
              },
            ])
            .then((response) => {
              let roleID = response.role_id;
              db.updateEmployeeRole(employeeID, roleID)
                .then(() => console.log("Employee has been updated"))
                .then(() => viewEmployees());
            });
        });
      });
  });
};

const quit = () => {
  console.log("You're all done for now. Bye!");
  process.exit();
};

init();
