import Thought from "$lib/Thought.ts";
import { Redis } from '@upstash/redis'

const client = new Redis({
  url: import.meta.env.THOUGHTS_UPSTASH_REDIS_REST_URL,
  token: import.meta.env.THOUGHTS_UPSTASH_REDIS_REST_TOKEN,
})

export async function getThoughts(client) {
	const initialThoughts = await client.get("thoughts")

	if(initialThoughts == undefined || initialThoughts == "" || Object.entries(initialThoughts).length === 0) {
		await client.set("thoughts",[])

	}

	const thoughts = await client.get("thoughts")

	const parsed = thoughts.map((obj) => new Thought({
		message: obj.message,
		iso8601: obj.date,
		id: obj.id,
		oldMessages: obj.oldMessages || null,
		edited: obj.edited || null,
		comments: obj.comments || null
	}))

	return parsed

}

export default client
