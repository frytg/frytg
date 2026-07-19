// Purge the Bunny CDN pull zone cache after a deploy.
// Ensures visitors get fresh assets instead of stale cached files.
// Run via `just purge` (last step of `just publish`).

import process from 'node:process'

const BUNNY_PULL_ZONE_API_KEY = process.env.BUNNY_PULL_ZONE_API_KEY
const BUNNY_PULL_ZONE_ID = process.env.BUNNY_PULL_ZONE_ID
const API_BASE = 'https://api.bunny.net'

async function purgePullZone() {
	if (!BUNNY_PULL_ZONE_API_KEY) throw new Error('BUNNY_PULL_ZONE_API_KEY is required')
	if (!BUNNY_PULL_ZONE_ID) throw new Error('BUNNY_PULL_ZONE_ID is required')

	const url = `${API_BASE}/pullzone/${BUNNY_PULL_ZONE_ID}/purgeCache`
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			AccessKey: BUNNY_PULL_ZONE_API_KEY,
			'Content-Type': 'application/json',
		},
		body: '{}',
	})
	const text = await response.text()

	if (!response.ok) {
		throw new Error(`Purge failed (${response.status}): ${text || response.statusText}`)
	}

	console.log(`Purged pull zone ${BUNNY_PULL_ZONE_ID}`)
	console.log(text)
}

async function main() {
	try {
		await purgePullZone()
	} catch (error) {
		console.error('Error purging pull zone:', error instanceof Error ? error.message : error)
		process.exit(1)
	}
}

main()
