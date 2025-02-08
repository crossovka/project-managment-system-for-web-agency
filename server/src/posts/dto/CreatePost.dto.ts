/* eslint-disable indent */
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreatePostDto {
	/** Title of the post */
	@IsNotEmpty()
	@IsString()
	@Length(1, 500)
	title: string

	/** Content of the post */
	@IsNotEmpty()
	@IsString()
	content: string

	/** ID of the category */
	@IsNotEmpty()
	category_id: number
}
