import { ITaskStatus } from '@/types/common';

export const TaskStatusColors: Record<ITaskStatus, string> = {
	[ITaskStatus.IN_PROGRESS]: 'black',
	[ITaskStatus.URGENT]: 'red',
	[ITaskStatus.UNDER_REVIEW]: 'purple',
	[ITaskStatus.COMPLETED]: 'green',
};
