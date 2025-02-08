nest g resource NAME

yarn typeorm migration:generate -d src/data-source.ts src/migrations/CreateEmployeeStatistics


<!-- -n CreateEmployeeStatistics — задаёт имя миграции.
-p src/migrations/ — указывает путь, куда будет сохранена миграция. Это обязательный параметр. -->

yarn typeorm migration:run -d src/data-source.ts
yarn typeorm migration:revert -d src/data-source.ts

sudo -u postgres psql
CREATE USER db WITH PASSWORD 'db';
CREATE DATABASE db OWNER db;
GRANT ALL PRIVILEGES ON DATABASE db TO db;

psql -U username -d database_name -f seed_data.sql

Сделать чтобы при клике на задачи был запрос на http://localhost:3000/api/tasks/employee/61


e. Enum значений
Использование enum в базе данных ограничивает значения в таблице. Это полезно, но может усложнить миграции при добавлении новых типов или статусов. Можно использовать строковые типы вместо enum, а сами значения проверять на уровне приложения.

- [] все запросы dashboard происходили через токен

- [] при наведении на сотрудника в задаче показывается тултип с отделом и должностью

- [] в профилее в задачах
  - Отоюражать только
		"project_id": 1,
		"name": "Project Alpha",

- [] у проектов статус завершён или в работе


// Сотрудники
{
  "name": "Селеван",
  "position": "Проектный менеджер",
  "department": "Управление проектами",
  "password": "Селеван"
}
{
  "name": "Славик",
  "position": "Фронтенд-разработчик",
  "department": "Разработка",
  "password": "Славик"
}
{
  "name": "Серега",
  "position": "Дизайнер Figma",
  "department": "Дизайн",
  "password": "Серега"
}
// Проекты
{
  "name": "Сайбылар",
  "startDate": "2024-12-15T00:00:00Z",
  "endDate": "2025-12-15T00:00:00Z",
  "client_id": 1,
  "project_manager_id": 1,
  "employees": [3, 2],
  "totalTurnover": 1000000,
  "accountsReceivable": 500000
}
{
  "name": "Мобайл",
  "startDate": "2024-12-15T00:00:00Z",
  "endDate": "2025-12-15T00:00:00Z",
  "client_id": 2,
  "project_manager_id": 1,
  "employees": [2, 3]
}
// Клиенты
{
  "companyName": "ООО Ромашка",
  "contactPerson": "Иван Иванов",
  "contactInfo": "+7 900 123-45-67"
}
{
  "companyName": "ООО Васи",
  "contactPerson": "Петр Петров",
  "contactInfo": "+7 911 654-32-10"
}
// Доступы
{
  "resourceName": "Админка",
  "login": "user123",
  "password": "SecurePassword123",
  "projectId": 1
}
{
  "resourceName": "Админка",
  "login": "user123",
  "password": "SecurePassword123",
  "projectId": 2
}
// Задачи
{
  "createdBy": 1,
  "assignedTo": 2,
  "project_id": 2,
  "description": "Task description",
  "startDate": "2024-12-18T10:00:00Z",
  "dueDate": "2024-12-25T18:00:00Z"
}
{
  "createdBy": 1,
  "assignedTo": 1,
  "project_id": 1,
  "status": "В работе", 
  "workType": "Проектная работа",
  "description": "Task description goes here",
  "startDate": "2024-12-18T10:00:00Z",
  "dueDate": "2024-12-25T18:00:00Z",
  "cost": 500
}

Изменение
{
  "status": "Срочная",
  "description": "Updated task description"
}
{
  "task_id": 123,
  "project_id": 45,
  "description": "Обновленное описание задачи",
  "startDate": "2024-12-20T09:00:00.000Z",
  "dueDate": "2024-12-25T18:00:00.000Z",
  "status": "IN_PROGRESS",
  "workType": "DEVELOPMENT",
  "cost": 1500.5,
  "assignedTo": {
    "employee_id": 789
  },
  "createdBy": {
    "employee_id": 456
  },
  "project": {
    "project_id": 45
  }
}
