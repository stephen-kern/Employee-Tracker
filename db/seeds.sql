INSERT INTO departments (department_name)
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Junior Engineer', 80000, 2),
('Accountant', 125000, 3),
('Legal Team Lead', 130000, 4),
('Lawyer', 120000, 4)
;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Stephen', 'Kern', 1, NULL),
('Bob', 'Dylan', 2, 1),
('Van', 'Morrison', 3, NULL),
('Bruce', 'Springsteen', 4, 3),
('Joni', 'Mitchell', 5, NUll),
('Neil', 'Young', 6, NULL),
('George', 'Harrison', 7, 6)
;