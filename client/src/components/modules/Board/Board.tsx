import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import Column from './column';

import { ITask } from '@/redux/slices/tasks/types';
import styles from './Board.module.scss';

interface BoardProps {
	columns: { title: string; tasks: ITask[] }[];
}

const Board: React.FC<BoardProps> = ({ columns }) => {
	const boardRef = useRef<HTMLDivElement>(null);

	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'TASK',
		drop: () => ({ name: 'Board' }),
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	}));

	// Привязываем drop к boardRef
	drop(boardRef);

	return (
		<div
			ref={boardRef}
			className={`${styles.board} ${isOver ? styles.highlight : ''}`}
		>
			{columns.map((column, index) => (
				<Column key={index} title={column.title} tasks={column.tasks} />
			))}
		</div>
	);
};

export default Board;
