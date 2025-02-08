import { AnimatePresence, motion } from 'framer-motion';
import styles from './BaseModal.module.scss';

export interface BaseModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	size = 'md',
	className,
}) => {
	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		onClose();
	};

	const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className={styles.modalOverlay} onClick={handleOverlayClick}>
					<motion.div
						className={`${styles.modalContainer} ${styles[size]} ${className}`}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						onClick={handleModalClick}
					>
						<div className={styles.modalHeader}>
							<h2 className={styles.modalTitle}>{title}</h2>
							<button
								onClick={onClose}
								className={styles.closeButton}
								aria-label="Close"
							>
								×
							</button>
						</div>
						<div className={styles.modalContent}>{children}</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default BaseModal;
