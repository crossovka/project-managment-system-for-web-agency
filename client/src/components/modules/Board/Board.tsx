import { useDrop } from 'react-dnd';

import Column from './column';

import { ITask } from '@/redux/slices/tasks/types';
import styles from './Board.module.scss';

interface BoardProps {
	columns: { title: string; tasks: ITask[] }[];
}

const Board: React.FC<BoardProps> = ({ columns }) => {
	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'TASK',
		drop: () => ({ name: 'Board' }),
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	}));

	return (
		<div ref={drop} className={styles.board}>
			{columns.map((column, index) => (
				<Column key={index} title={column.title} tasks={column.tasks} />
			))}
		</div>
	);
};

export default Board;
