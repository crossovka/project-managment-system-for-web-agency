import { IEmployee } from '../auth/types';
import { ICategory } from '../categories/types';

export interface IPost {
	post_id: number;
	title: string;
	content: string;
	category: ICategory;
	createdBy: IEmployee;
	createdAt: Date;
	updatedAt: Date;
}

export interface PostState {
	posts: IPost[];
	loading: boolean;
	error: string | null;
	currentPost: IPost | null;
}
