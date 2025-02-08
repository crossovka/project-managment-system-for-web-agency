import React from 'react';
import styles from './Tabs.module.scss';

interface TabsProps {
	tabs: string[]; // Массив табов
	activeTab: string; // Активный таб
	onTabChange: (tab: string) => void; // Функция смены активного таба
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
	return (
		<div className={styles.tabs}>
			{tabs.map((tab) => (
				<button
					key={tab}
					onClick={() => onTabChange(tab)}
					className={`${styles.tabs__button} ${
						activeTab === tab ? styles['tabs__button--active'] : ''
					}`}
				>
					{tab}
				</button>
			))}
		</div>
	);
};

export default Tabs;
