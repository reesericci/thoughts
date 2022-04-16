import 'temporal-polyfill/global';
import client from "$lib/redis.ts";
import jwt from "jsonwebtoken";

class Thought {
	message: string;
	#date: Temporal.ZonedDateTime;
	dateString: string;
	id: number
	constructor(message: string, iso8601: string, id: number) {
		this.message = message;
		this.date = Temporal.ZonedDateTime.from(iso8601)
		this.dateString = this.date.toLocaleString();
		this.id = id
	}
}
async function getThoughts() {
	const initialThoughts = await client.get("thoughts")

	if(initialThoughts == undefined || Object.entries(await client.get("thoughts")).length === 0) {
		await client.set("thoughts",[])

	}
	const thoughts = await client.get("thoughts")

	const parsed = thoughts.map((obj, i) => new Thought(obj.message,obj.date,i))
	return parsed

}

export async function get({ url }) {

	const thoughts: Thought[] = await getThoughts()

	if (thoughts.length > 0) {
		return {
			body: thoughts,
			status: 200
		}
	} else {
		return {
			status: 404,
			body: "Thought not found"
		};
	}
}

export async function post({ request }) {
	try {
		const headers = request.headers;
		const token = headers.get("authorization").split("Bearer ")[1];

		jwt.verify(token, process.env["PUBKEY"], { algorithms: ['RS256'] })
	} catch(e) {
		return {
			status: 403,
			body: e
		}
	}

	const thoughts = await getThoughts()

	const body = await request.json();


	try {
		new Thought(body.message,body.iso8601)
	} catch(e) {
		console.error(e)
		return {
			status: 400
		}
	}
	const thoughtIndex = thoughts.push(new Thought(body.message,body.iso8601,thoughts.length)) -1


	await client.set("thoughts",thoughts);

	return {
		status: 200,
		body: { id: thoughts[thoughtIndex].id, thought: thoughts[thoughtIndex] }
	};
}

export async function del({ request }) {

	try {
		const headers = request.headers;
		const token = headers.get("authorization").split("Bearer ")[1];

		jwt.verify(token, process.env["PUBKEY"], { algorithms: ['RS256'] })
	} catch(e) {
		return {
			status: 403,
			body: e
		}
	}


	const body = await request.json()

	const thoughts = await getThoughts()

	if(body == undefined || body.id == undefined) {

		return {
			status: 400
		}
	}

	if(thoughts[body.id] == undefined) {
		return {
			status: 404,
			body: "Thought not found"
		}
	}
	try {
		thoughts.splice(body.id,1)
		await client.set("thoughts",thoughts)

	} catch(e) {  console.error(e); return {status: 500, body: e}}

	return {
		status: 200,
		body: thoughts
	}

}
