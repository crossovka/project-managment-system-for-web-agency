-- Заполнение таблицы клиентов
INSERT INTO clients (company_name, contact_person, contact_info) VALUES
('ООО Альфа', 'Иван Иванов', '+79101234567'),
('ИП Бета', 'Мария Смирнова', '@ms_beta'),
('ООО Гамма', 'Петр Петров', 'gamma@example.com');

-- Заполнение таблицы сотрудников
INSERT INTO employees (name, password, position, department) VALUES
('Алексей Зайцев', 'password123', 'Бэкендер', 'Отдел Разработки'),
('Екатерина Орлова', 'securepass456', 'Графический дизайнер', 'Отдел дизайна'),
('Дмитрий Кузьмин', 'admin789', 'Проджект', 'Отдел управления проектами'),
('Ольга Сидорова', 'strongpass321', 'SEO спец', 'Отдел SEO и продвижения'),
('Сергей Иванов', 'mypassword654', 'Продажник', 'Отдел продаж и маркетинга');

-- Заполнение таблицы статистики сотрудников
INSERT INTO employee_statistics (statistic_id, totalEarnings, pendingEarnings, monthlyEarnings, hoursWorked)
VALUES
(1, 50000.00, 15000.00, 20000.00, 160),
(2, 45000.00, 10000.00, 18000.00, 140),
(3, 70000.00, 20000.00, 25000.00, 180),
(4, 60000.00, 15000.00, 22000.00, 160),
(5, 55000.00, 12000.00, 20000.00, 150);

-- Заполнение таблицы проектов
INSERT INTO projects (start_date, end_date, client_id, manager_id) VALUES
('2024-01-01', '2024-03-01', 1, 3),
('2024-02-01', NULL, 2, 3),
('2024-03-15', '2024-06-15', 3, 3);

-- Заполнение таблицы типов работы
INSERT INTO WorkType (work_type_name, rate) VALUES
('Проектная работа', 3000.00),
('Почасовая', 500.00);

-- Заполнение таблицы статусов задач
INSERT INTO task_status (status_name) VALUES
('В работе'),
('Срочная'),
('на проверке'),
('Завершенные');

-- Заполнение таблицы задач
INSERT INTO tasks (description, due_date, project_id, status_id, work_type_id) VALUES
('Создать API для нового проекта', '2024-02-15', 1, 1, 2),
('Разработать макет сайта', '2024-01-30', 1, 2, 1),
('Настроить SEO-кампанию', '2024-03-10', 2, 3, 2),
('Подготовить презентацию', '2024-03-05', 3, 4, 1);

-- Привязка сотрудников к задачам
INSERT INTO task_assignedTo_employee (task_id, employee_id) VALUES
(1, 1),
(2, 2),
(3, 4),
(4, 5);
