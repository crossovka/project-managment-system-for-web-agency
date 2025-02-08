import os

def print_directory_structure(start_path, exclude_dirs=None, exclude_files=None):
	if exclude_dirs is None:
			exclude_dirs = []
	if exclude_files is None:
			exclude_files = []

	for root, dirs, files in os.walk(start_path):
			# Исключаем папки
			dirs[:] = [d for d in dirs if d not in exclude_dirs]
			
			# Печатаем директорию
			level = root.replace(start_path, '').count(os.sep)
			indent = ' ' * 4 * level
			print(f'{indent}{os.path.basename(root)}/')

			# Исключаем файлы
			sub_indent = ' ' * 4 * (level + 1)
			for f in files:
					if f not in exclude_files:
							print(f'{sub_indent}{f}')

# Укажите путь к вашему проекту
project_path = './'

# Список папок и файлов для исключения
exclude_dirs = ['node_modules', '.git', 'dist', '.next']
exclude_files = ['README.md', '.env']

print_directory_structure(project_path, exclude_dirs, exclude_files)