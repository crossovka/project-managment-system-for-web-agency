'use client';

import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new'; // Используем новый форк
import 'react-quill-new/dist/quill.snow.css'; // Подключаем стили

interface DescriptionEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

const EditorField: React.FC<DescriptionEditorProps> = ({
	value,
	onChange,
	placeholder,
}) => {
	const [editorValue, setEditorValue] = useState<string>(value);

	useEffect(() => {
		setEditorValue(value);
	}, [value]);

	const handleEditorChange = (newValue: string) => {
		setEditorValue(newValue);
		onChange(newValue); // Передаем изменения в родительский компонент
	};

	return (
		<ReactQuill
			value={editorValue}
			onChange={handleEditorChange}
			placeholder={placeholder ? placeholder : 'Введите текст...'}
		/>
	);
};

export default EditorField;
