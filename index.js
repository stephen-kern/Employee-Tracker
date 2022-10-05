const inquirer = require("inquirer");
const {
  findRole,
  findAllEmployees,
  updateEmployeeRole,
  deleteAnEmployee,
} = require("./db");

const db = require("./data");
require("console.table");

const init = () => {
  startMenu();
};

const startMenu = () => {
  inquirer
    .createPromptModule([
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
          "Delete an employee",
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
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => startMenu());
};
const addRole = () => {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => startMenu());
};
const updateRole = () => {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => startMenu());
};
const delEmp = () => {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => startMenu());
};
const quit = () => {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => startMenu());
};
