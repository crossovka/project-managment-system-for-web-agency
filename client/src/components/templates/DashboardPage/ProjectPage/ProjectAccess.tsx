import HiddenField from '@/components/elements/HiddenField';

import { IAccess } from '@/redux/slices/access/types';
import styles from './ProjectPage.module.scss';

interface ProjectAccessProps {
	access: IAccess[];
	handleEditAccess: (access: IAccess) => void;
	openModal: () => void;
}

const ProjectAccess = ({
	access,
	handleEditAccess,
	openModal,
}: ProjectAccessProps) => (
	<div className={styles.ProjectAccess}>
		<div className={styles.ProjectAccess__heading}>
			<h2 className={styles.sectionTitle}>Доступы:</h2>
			<button onClick={openModal} className={'add-new-btn'}>
				<span>+</span>
			</button>
		</div>
		<ul>
			{access.map((item) => (
				<li key={item.access_id}>
					<strong>{item.resourceName}</strong>
					<HiddenField label="Логин" value={item.login} initialHidden={false} />
					<HiddenField
						label="Пароль"
						value={item.password}
						initialHidden={true}
					/>
					<button
						onClick={() => handleEditAccess(item)}
						className={`${styles.editAccessButton} btn btn--sm`}
					>
						Редактировать
					</button>
				</li>
			))}
		</ul>
	</div>
);

export default ProjectAccess;
