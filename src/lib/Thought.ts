import 'temporal-polyfill/global';

export default class Thought {
	message: string;
	date: Temporal.ZonedDateTime;
	id: number;
	oldMessages: {message:string, iso8601: string}[];
	comments: {message: string, iso8601: string, name: string, email: string}[]
	edited: boolean;

	constructor(obj: {
		message: string,
		iso8601: string,
		id: number,
		comments?: {
			message: string,
			iso8601: string,
			name: string,
			email: string
		}[],
		oldMessages?: {
			message: string,
			iso8601: string,
		}[],
		edited?: boolean
	}){
		this.message = obj.message;
		this.date = Temporal.ZonedDateTime.from(obj.iso8601)
		this.id = obj.id;
		this.oldMessages = obj.oldMessages || [];
		this.edited = obj.edited || false;
		this.comments = obj.comments || [];
	}

	edit(newMessage: string, newIso8601: string) {
		this.oldMessages.push({
			message: this.message,
			iso8601: this.date.toString()
		})

		this.message = newMessage;
		this.date = Temporal.ZonedDateTime.from(newIso8601);
		this.edited = true;

	}

	addComment(obj: {
		message: string,
		iso8601: string,
		name: string,
		email: string
	}) {
		this.comments.push({
			message: obj.message,
			iso8601: obj.iso8601,
			name: obj.name,
			email: obj.email
		})

	}


}
