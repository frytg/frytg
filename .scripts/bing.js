// load packages
const { request } = require('undici')

const BING_ENDPOINT = 'https://www.bing.com/indexnow'

async function submitUrlsToBing(apiKey, urls) {
	const payload = {
		host: 'www.frytg.com',
		key: apiKey,
		urlList: urls,
	}

	try {
		const { statusCode, body, headers } = await request(BING_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
			body: JSON.stringify(payload),
		})

		if (statusCode === 200) {
			console.log('URLs successfully submitted to Bing IndexNow API', headers)
		} else {
			console.log(`Error submitting URLs. Status code: ${statusCode}`)
			const responseText = await body.text()
			console.log(`Response: ${responseText}`, headers)
		}
	} catch (error) {
		console.error('An error occurred:', error.message)
	}
}

// Example usage
const apiKey = process.env.BING_API_KEY
const urlsToSubmit = [
	/* "https://" */
]

submitUrlsToBing(apiKey, urlsToSubmit)
