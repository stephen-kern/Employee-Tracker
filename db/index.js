const connection = require('./connection');

class database {
    constructor(connection) {
        this.connection = connection;
    }

    // EMPLOYEE SECTION * * * * * * * * * * * * * 

    findAllEmployees() {
        return this.connection.promise()
        .query("SELECT employees.employee_id id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) manager FROM employees LEFT JOIN roles on employees.role_id = roles.role_id LEFT JOIN departments on roles.department_id = departments.department_id LEFT JOIN employees manager on manager.employee_id = employees.manager_id;"
        );
    }

    createAnEmployee(employee) {
        return this.connection.promise()
        .query("INSERT INTO employees SET ?", employee);
    }
    
    // ROLE SECTION * * * * * * * * * * * * * 
    
    findRole() {
        return this.connection.promise()
        .query("SELECT role_id, title, departments.department_name department, salary FROM roles LEFT JOIN departments on roles.department_id = departments.department_id"
        );
    }

    createRole(role) {
        console.log(role);
        return this.connection.promise()
        .query("INSERT INTO roles SET ?", role);
    }

    updateEmployeeRole(employeeID, roleID) {
        return this.connection.promise()
        .query("UPDATE employees set role_id = ? WHERE employee_id = ?", [roleID, employeeID]);
    }

    // DEPARTMENT SECTION * * * * * * * * * * * *

    createDepartment(department){
        console.log(department);
        return this.connection.promise()
        .query("INSERT INTO departments SET department_name = ?", department);
    }

    findDepartment() {
        return this.connection.promise()
        .query("SELECT * FROM departments");
    }
}

module.exports = new database(connection);