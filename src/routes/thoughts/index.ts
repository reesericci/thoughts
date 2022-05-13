import 'temporal-polyfill/global';
import client, { getThoughts } from "$lib/redis.ts";
import jwt from "jsonwebtoken";
import Thought from "$lib/Thought.ts"

export async function get() {

	const thoughts: Thought[] = await getThoughts(client) ?? []

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
		const payload = jwt.verify(token,`${import.meta.env.THOUGHTS_PUBKEY ?? process.env.THOUGHTS_PUBKEY}` , { algorithms: ['RS256'] })

	} catch(e) {
		return {
			status: 403,
			body: e
		}
	}

	const thoughts = await getThoughts(client)

	const body = await request.json();


	try {
		new Thought({message: body.message,iso8601: body.iso8601})
	} catch(e) {
		console.error(e)
		return {
			status: 400
		}
	}
	const thoughtIndex = thoughts.push(new Thought({message: body.message,iso8601: body.iso8601,id: thoughts.length})) -1

	await client.set("thoughts",JSON.stringify(thoughts));

	return {
		status: 200,
		body: { id: thoughts[thoughtIndex].id, thought: thoughts[thoughtIndex] }
	};
}

export async function del({ request }) {

	try {
		const headers = request.headers;
		const token = headers.get("authorization").split("Bearer ")[1];
		jwt.verify(token, `${import.meta.env.THOUGHTS_PUBKEY}`, { algorithms: ['RS256'] })
	} catch(e) {
		return {
			status: 403,
			body: e
		}
	}


	const body = await request.json()

	const thoughts = await getThoughts(client)

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
		await client.set("thoughts",JSON.stringify(thoughts))

	} catch(e) {  console.error(e); return {status: 500, body: e}}

	return {
		status: 200,
		body: thoughts
	}

}

export async function patch({ request }) {

	try {
		const headers = request.headers;
		const token = headers.get("authorization").split("Bearer ")[1];
		jwt.verify(token, import.meta.env.THOUGHTS_PUBKEY, { algorithms: ['RS256'] })
	} catch(e) {
		return {
			status: 403,
			body: e
		}
	}



	const body = await request.json()
	const thoughts = await getThoughts(client)

	if(body.message == undefined || body.id == undefined || body.iso8601 == undefined) {
		return {
			status: 400,
			body: "You may be missing params message, id, or iso8601"
		}
	}

	if(thoughts[body.id] == undefined) {
		return {
			status: 404,
			body: "Thought not found"
		}
	}

	try {
		thoughts[body.id].edit(body.message,body.iso8601);

		await client.set("thoughts",JSON.stringify(thoughts))
	} catch(e) {
		return {
			status: 500,
			body: e
		}
	}

	return {
		status: 200,
		body: thoughts[body.id]
	}

}
