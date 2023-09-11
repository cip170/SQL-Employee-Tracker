INSERT INTO department (name)
VALUES
('Engineering'),
('Finance'),
('Operations'),
('Legal'),
('Information Technology'),
('Sales');

INSERT INTO role
    (title, salary, department_id)
VALUES
('Engineer', 90000, 3),
('Accountant', 150000, 2),
('Operations Director', 220000, 1),
('Lawyer', 200000, 4),
('IT Specialist', 70000, 3),
('Sales Manager', 70000, 5),
('Salesperson', 50000, 6);

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
