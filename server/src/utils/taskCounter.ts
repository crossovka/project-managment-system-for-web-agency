import { Task } from 'src/tasks/entities/task.entity'
import { TaskStatus } from 'src/types/types'

export const countUncompletedTasks = (tasks: Task[]): number => {
	if (!tasks?.length) return 0
	return tasks.filter((task) => task.status !== TaskStatus.COMPLETED).length
}
