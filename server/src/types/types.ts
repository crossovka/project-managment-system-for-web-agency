export enum Position {
	ACCOUNT_MANAGER = 'Аккаунт-менеджер',
	SALES_MANAGER = 'Менеджер по продажам',

	DIRECTOR = 'Директор',
	PROJECT_MANAGER = 'Проектный менеджер',

	FIGMA_DESIGNER = 'Дизайнер Figma',
	GRAPHIC_DESIGNER = 'Графический дизайнер',
	THREE_D_DESIGNER = '3D-Дизайнер',

	FULLSTACK_DEVELOPER = 'Фулстек-разработчик',
	BACKEND_DEVELOPER = 'Бэкенд-разработчик',
	FRONTEND_DEVELOPER = 'Фронтенд-разработчик',

	CONTENT_MANAGER = 'Контент-менеджер',
	SEO_SPECIALIST = 'SEO-специалист',
	ADVERTISING_SPECIALIST = 'Специалист по рекламе'
}

export enum Department {
	SALES_AND_MARKETING = 'Продажи и маркетинг',
	PROJECT_MANAGEMENT = 'Управление проектами',
	DESIGN = 'Дизайн',
	DEVELOPMENT = 'Разработка',
	SEO_AND_MARKETING = 'SEO и продвижение'
}

export enum WorkType {
	PROJECT_BASED = 'Проектная работа',
	HOURLY_BASED = 'Почасовая работа'
	// MINUTES_BASED = 'Поминутная работа'
}

export enum TaskStatus {
	IN_PROGRESS = 'В работе',
	URGENT = 'Срочная',
	UNDER_REVIEW = 'На проверке',
	COMPLETED = 'Завершена'
}

export enum ProjectStatus {
	IN_PROGRESS = 'В работе',
	COMPLETED = 'Завершён',
	ON_HOLD = 'Приостановлен',
	CANCELED = 'Отменён'
}
