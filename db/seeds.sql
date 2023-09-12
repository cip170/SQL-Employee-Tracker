USE employee_tracker_db;
INSERT INTO department (name)
VALUES
("Engineering"),
("Finance"),
("Legal"),
("Sales");
INSERT INTO role (title, salary, department_id)
VALUES
("Sales Lead", 100000, 4),
("Salesperson", 80000, 4),
("Lead Engineer", 150000, 1),
("Software Engineer", 120000, 1),
("Account Manager", 160000, 2),
("Accountant", 125000, 2),
("Legal Team Lead", 250000, 3),
("Lawyer", 190000, 3);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES
('Klaus', 'Monroe', 3, NULL),
('Harold', 'Jones', 2, NULL),
('Mick', 'Ronsen', 2, 3),
('Harry', 'Sullivan', 1, 1),
('Tracy', 'Mackay', 4, NULL),
('Regan', 'Casey', 4, Null),
('Trevor', 'Nielson', 4, 2),
('Sui', 'Ming', 3, NULL),
('Alex', 'Porter', 5, 3),
('Frankie', 'Simm', 6, NULL),
('Chloe', 'Sangster', 6, NULL),
('Ross', 'Matthews', 6, NULL),
