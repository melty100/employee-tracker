USE employee_db;

DELETE FROM department;

INSERT INTO department (name)
VALUES ('Production'),
       ('R&D'),
       ('Purchasing'),
       ('Marketing'),
       ('HR'),
       ('Accounting');
    
SET @HR_id = (select id from department where name like 'HR');
SET @Marketing_id = (select id from department where name like 'Marketing');
SET @RnD_id = (select id from department where name like 'R&D');
    
       
DELETE FROM role;

INSERT INTO role (title, salary, department_id)
VALUES ('Staffing Coordinator', 40000, @HR_id),
       ('Staffing Specialist', 43000, @HR_id),
       ('HR Assistant', 44000, @HR_id),
       ('HR Administrator', 49000, @HR_id),
       ('HR Manager', 74000, @HR_id),
       ('Conent Marketing Manager', 110000, @Marketing_id),
       ('Marketing Analyst', 50000, @Marketing_id),
       ('Creative Director', 175000, @Marketing_id),
       ('R&D Manager', 150000, @RnD_id),
       ('R&D Engineer', 75000, @RnD_id);
       
DELETE FROM employee where first_name like "%";

SET @StaffingCoord = (select id from role where title like 'Staffing Coordinator');
SET @StaffingSpec = (select id from role where title like 'Staffing Specialist');
SET @HR_Assistant = (select id from role where title like 'HR Assistant');
SET @HR_Manager = (select id from role where title like 'HR Manager');
SET @Marketing_Manager = (select id from role where title like 'Conent Marketing Manager');
SET @Marketing_Analyst = (select id from role where title like 'Marketing Analyst');
SET @RnD_Manager = (select id from role where title like 'R&D Manager');
SET @RnD_Eng = (select id from role where title like 'R&D Engineer');

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Areeba', 'Patterson', @StaffingCoord),
       ('Tamanna', 'Dejesus', @StaffingSpec),
       ('Princess', 'Oneill', @HR_Assistant),
       ('Sophia', 'Holman', @HR_Manager),
       ('Magnus', 'Oconnell', @Marketing_Manager),
       ('Marisa', 'Burrows', @Marketing_Analyst),
       ('Grace', 'Simmons', @RnD_Manager),
       ('Rodrigo', 'Ried', @RnD_Eng);
       