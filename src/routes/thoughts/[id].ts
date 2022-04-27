import { AkismetClient } from 'akismet-api'
import sleep from 'sleep-promise';

const key = import.meta.env.THOUGHTS_AKISMET_API_KEY
const url = import.meta.env.THOUGHTS_AKSIMET_SITE_URL
const akismet = new AkismetClient({ key, blog:url })
import client, { getThoughts } from "$lib/redis.ts"

export async function post({ request, params }) {
	const body = await request.formData()
	const thoughts = await getThoughts(client)
	let akismet = false;
	/*
	try {
  		const isValid = await client.verifyKey()
  		if (isValid) akismet = true
  		else console.log('Invalid')
	} catch (err) {
  		console.error('Could not reach Akismet:', err.message)
	}

	if(akismet) {
		const akismetComment = {
			ip: body.get("ip"),
			useragent: body.get("useragent"),
			email: body.get("email"),
			name: body.get("name")
		}


		try {
		  const isSpam = await akismet.checkSpam(comment)
  		  if (isSpam){

  		  	return {
  				status: 403,
  		  		message: "Spam comment detected, if you think this is incorrect please contact me@reeseric.ci"
  		 	 }
  		  }
  		  else console.log('Totally not spam')
		} catch (err) {
  			console.error('Something went wrong:', err.message)
		}
	}*/

	thoughts[params.id].addComment({
		message: body.get("message"),
		iso8601: body.get("iso8601"),
		name: body.get("name"),
		email: body.get("email")
	})
	await client.set("thoughts",JSON.stringify(thoughts))
	await sleep(1000)


	return {
		status: 200,
		body: thoughts[params.id]
	}

}
