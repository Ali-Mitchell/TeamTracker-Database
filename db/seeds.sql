INSERT INTO departments (name) 
VALUES
    ('Executive'),
    ('Finance'),
    ('Sales'),
    ('Production'),
    ('Management');

INSERT INTO roles (title, salary, department_id)
VALUES  
    ('Executive', 100000, 1),
    ('Accountant', 80000, 2),
    ('Sales Rep', 50000, 3),
    ('Production Staff', 45000, 4),
    ('Manager', 65000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
    ('Charlie', 'Green', 1, NULL),
    ('Mac', 'McSweeney', 2, NULL),
    ('Dennis', 'Green', 3, NULL),
    ('Frank', 'Chaney', 4, 1),
    ('Dee', 'Carlson', 5, 2);