import { AkismetClient } from 'akismet-api'
import sleep from 'sleep-promise';
import Filter from 'bad-words';

const filter = new Filter()

const key = import.meta.env.THOUGHTS_AKISMET_API_KEY
const url = import.meta.env.THOUGHTS_AKISMET_SITE_URL

const akismet = new AkismetClient({ key, blog: url })
import client, { getThoughts } from "$lib/redis.ts"
import jwt from "jsonwebtoken";

export async function post({ request, params, clientAddress }) {
	const body = await request.formData()
	const thoughts = await getThoughts(client)
	let akismetEnabled = false;
	try {
  		const isValid = await akismet.verifyKey()
  		if (isValid) akismetEnabled = true
  		else console.log('Invalid')
	} catch (err) {
  		console.error('Could not reach Akismet:', err.message)
	}

	if(akismetEnabled) {
		const akismetComment = {
			ip: clientAddress,
			useragent: request.headers.get("User-Agent"),
			email: body.get("email"),
			name: body.get("name")
		}

		console.log(akismetComment)

		try {
		  const isSpam = await akismet.checkSpam(akismetComment)
  		  if (isSpam){
  		  	console.log("spam detected")

  		  	return {
  				status: 403,
  		  		body: "Spam comment detected"
  		 	}
  		  }
  		  else console.log('Totally not spam')

		} catch (err) {
  			console.error('Something went wrong:', err.message)
  			return {
  				status: 500,
  				body: err
  			}
		}
	}

	thoughts[params.id].addComment({
		message: filter.clean(body.get("message")),
		iso8601: body.get("iso8601"),
		name: filter.clean(body.get("name"))
	})
	await client.set("thoughts",JSON.stringify(thoughts))
	await sleep(1000)


	return {
		status: 200,
		body: thoughts[params.id]
	}

}


export async function del({ request, params }) {
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

	const comments = thoughts[params.id].comments

	if(!body.id) return {
		status: 400,
		body: "comment id not provided"
	}
	comments.splice(body.id,1)

	await client.set("thoughts",thoughts)

	return {
		status: 200,
		body: comments
	}

}

export async function get({ params }) {
	const thoughts = await getThoughts(client)

	return {
		status:200,
		body: thoughts[params.id].comments
	}
}
