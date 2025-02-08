import { useAppDispatch } from '@/redux/store';
import { openTaskModal } from '@/redux/slices/tasks/slice';
import { WorkType, ITaskStatus } from '@/types/common';

import styles from"./CreateTaskButton.module.scss";

interface CreateTaskButtonProps {
	status: ITaskStatus;
	createdBy: number;
}

const CreateTaskButton: React.FC<CreateTaskButtonProps> = ({
	status = ITaskStatus.IN_PROGRESS,
	createdBy
}) => {
	const dispatch = useAppDispatch();

	const handleClick = () => {
		dispatch(
			openTaskModal({
				workType: WorkType.PROJECT_BASED,
				hours: 0,
				minutes: 0,
				cost: 0,
				createdBy: createdBy, // Здесь можно передавать ID создателя
				status: status,
			})
		);
	};

	return <button onClick={handleClick} className={styles.btn}><span>+</span></button>;
};

export default CreateTaskButton;
