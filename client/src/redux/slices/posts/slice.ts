import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPosts, createPost, updatePost, deletePost, fetchPostById } from './asyncActions';
import { IPost, PostState } from './types';

const initialState: PostState = {
	posts: [],
	loading: false,
	error: null,
	currentPost: null,
};

// Вспомогательные функции для обработки состояния
const handlePending = (state: PostState) => {
	state.loading = true;
	state.error = null;
};

const handleFulfilled = (state: PostState, action: PayloadAction<IPost[]>) => {
	state.loading = false;
	state.posts = action.payload;
	state.error = null;
};

const handleRejected = (
	state: PostState,
	action: PayloadAction<string | undefined>
) => {
	state.loading = false;
	state.error = action.payload || 'Ошибка выполнения операции';
};

const handleSingleFulfilled = (
	state: PostState,
	action: PayloadAction<IPost>
) => {
	state.loading = false;
	state.error = null;
	if (action.payload) {
		state.currentPost = action.payload;
	}
};

const handleDeleteFulfilled = (
	state: PostState,
	action: PayloadAction<number>
) => {
	state.loading = false;
	state.error = null;
	state.posts = state.posts.filter((post) => post.post_id !== action.payload);
};

const handleCreateFulfilled = (
	state: PostState,
	action: PayloadAction<IPost>
) => {
	state.loading = false;
	state.error = null;
	state.posts.push(action.payload);
};

const handleUpdateFulfilled = (
	state: PostState,
	action: PayloadAction<IPost>
) => {
	state.loading = false;
	state.error = null;
	const index = state.posts.findIndex(
		(post) => post.post_id === action.payload.post_id
	);
	if (index !== -1) {
		state.posts[index] = action.payload;
	}
};

// Создаем слайс
const postSlice = createSlice({
	name: 'post',
	initialState,
	reducers: {
		setCurrentPost(state, action: PayloadAction<IPost | null>) {
			state.currentPost = action.payload;
		},
	},
	extraReducers: (builder) => {
		// Обработка получения всех постов
		builder.addCase(fetchPosts.pending, handlePending);
		builder.addCase(fetchPosts.fulfilled, handleFulfilled);
		builder.addCase(fetchPosts.rejected, handleRejected);

		// Обработка получения одного поста
		builder.addCase(fetchPostById.pending, handlePending);
		builder.addCase(fetchPostById.fulfilled, (state, action) => {
			state.loading = false;
			state.error = null;
			state.currentPost = action.payload;
		});
		builder.addCase(fetchPostById.rejected, handleRejected);

		// Обработка создания поста
		builder.addCase(createPost.pending, handlePending);
		builder.addCase(createPost.fulfilled, handleCreateFulfilled);
		builder.addCase(createPost.rejected, handleRejected);

		// Обработка обновления поста
		builder.addCase(updatePost.pending, handlePending);
		builder.addCase(updatePost.fulfilled, handleUpdateFulfilled);
		builder.addCase(updatePost.rejected, handleRejected);

		// Обработка удаления поста
		builder.addCase(deletePost.pending, handlePending);
		builder.addCase(deletePost.fulfilled, handleDeleteFulfilled);
		builder.addCase(deletePost.rejected, handleRejected);
	},
});

export const { setCurrentPost } = postSlice.actions;
export default postSlice.reducer;
