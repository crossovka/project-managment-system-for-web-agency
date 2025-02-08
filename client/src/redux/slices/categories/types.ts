import { IPost } from "../posts/types";

export interface ICategory {
	category_id: number;
	name: string;
	description?: string;
	posts: IPost[];
	createdAt: Date;
	updatedAt: Date;
}

export interface CategoryState {
	categories: ICategory[];
	loading: boolean;
	error: string | null;
	currentCategory: ICategory | null;
}