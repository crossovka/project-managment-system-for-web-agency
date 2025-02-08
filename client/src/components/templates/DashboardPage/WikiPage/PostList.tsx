import { IPost } from '@/redux/slices/posts/types';
import styles from './PostList.module.scss';
import Link from 'next/link';

interface PostListProps {
	posts: IPost[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
	return (
		<div className={styles.postList}>
			{posts.map((post) => {
				// Преобразуем строки даты в объекты Date, если они еще не являются таковыми
				const createdAt =
					post.createdAt instanceof Date
						? post.createdAt
						: new Date(post.createdAt);
				const updatedAt =
					post.updatedAt instanceof Date
						? post.updatedAt
						: new Date(post.updatedAt);

				return (
					<div key={post.post_id} className={styles.postItem}>
						<Link href={`/dashboard/wiki/${post.post_id}`} className='link'>
							<h3>{post.title}</h3>
						</Link>
						<div className={styles.postItem__description}>
							<p className={styles.postItem__category}>{post.category.name}</p>
							<span>·</span>
							<p className={styles.postItem__cratedBy}>создано: {post.createdBy.name}</p>
						</div>
						<div className={styles.postItem__times}>
							<p className={styles.postItem__cratedAt}>Опубликовано: {createdAt.toLocaleDateString()}</p>
							<p className={styles.postItem__updatedAt}>Отредактировано: {updatedAt.toLocaleDateString()}</p>
						</div>
							{/* <p className={styles.postItem__content}>{post.content}</p> */}
					</div>
				);
			})}
		</div>
	);
};

export default PostList;
