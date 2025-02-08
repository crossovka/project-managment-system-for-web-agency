import React, { useState } from 'react';

import ContactDetailsModal from '@/components/modules/modals/ContactDetailsModal';
// import HiddenField from '@/components/elements/HiddenField';

import { IContactDetails } from '@/redux/slices/clients/types';
import styles from './ClientPage.module.scss';

interface ContactDetailsProps {
	contactDetails: IContactDetails[];
	clientId: number;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
	contactDetails,
	clientId,
}) => {
	const [isModalOpen, setModalOpen] = useState(false);
	console.log(contactDetails)

	return (
		<div className={styles.contactDetails} key={1}>
			<div className={styles.sectionHeader}>
				<h2>Контактная информация</h2>
				<button onClick={() => setModalOpen(true)} className={"add-new-btn"}>
					<span>+</span>
				</button>
			</div>
			{contactDetails.map((contact) => (
				<div key={contact.contactInfo} className={styles.contactDetails__item}>
					<p>
						<strong>Человек для связи:</strong> {contact.contactPerson}
						{/* <HiddenField label="Человек для связи:" value={contact.contactPerson} initialHidden={false} /> */}
					</p>
					<p>
						<strong>Контактная информация:</strong>  {contact.contactInfo}
						{/* <HiddenField label="Контактная информация" value={contact.contactInfo} initialHidden={false} /> */}
					</p>
				</div>
			))}

			<ContactDetailsModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
				clientId={clientId}
			/>
		</div>
	);
};

export default ContactDetails;
