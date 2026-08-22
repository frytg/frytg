// Update the site.standard.publication icon on the PDS.
// Uploads static/standard-social-icon.png as a blob and patches the `icon` field
// on the publication record referenced by sequoia.json#publicationUri. Sets the
// favicon/avatar Bluesky shows in embed cards for every site.standard.document
// that points at this publication.
// Run via `just atproto-update-publication-icon` (requires ATP creds in SOPS).

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { BskyAgent } from '@atproto/api'

const ROOT = join(import.meta.dirname, '..')
const CONFIG_PATH = join(ROOT, 'sequoia.json')
const ICON_PATH = join(ROOT, 'static/standard-social-icon.png')
const COLLECTION = 'site.standard.publication'
const ICON_MIME = 'image/png'

type SequoiaConfig = {
	publicationUri?: string
	pdsUrl?: string
	identity?: string
	[key: string]: unknown
}

async function loadConfig(): Promise<SequoiaConfig> {
	return JSON.parse(await readFile(CONFIG_PATH, 'utf-8')) as SequoiaConfig
}

function parseAtUri(uri: string): { did: string; rkey: string } {
	const match = uri.match(/^at:\/\/(did:[^/]+)\/[^/]+\/([^/]+)$/)
	if (!match) {
		throw new Error(`Invalid publication URI: ${uri}`)
	}
	return { did: match[1]!, rkey: match[2]! }
}

async function main(): Promise<void> {
	const identifier = process.env.ATP_IDENTIFIER
	const password = process.env.ATP_APP_PASSWORD

	if (!identifier || !password) {
		console.error(
			'Missing ATP_IDENTIFIER or ATP_APP_PASSWORD. Add them to .env.sops.yaml and run via `just atproto-update-publication-icon`.'
		)
		process.exit(1)
	}

	const config = await loadConfig()
	if (!config.publicationUri) {
		console.error(`No publicationUri in ${CONFIG_PATH}. Run \`just atproto-init\` first.`)
		process.exit(1)
	}

	const { did, rkey } = parseAtUri(config.publicationUri)
	const pdsUrl = config.pdsUrl ?? process.env.PDS_URL ?? 'https://pds.frytg.digital'

	let iconBytes: Uint8Array
	try {
		iconBytes = await readFile(ICON_PATH)
	} catch (error) {
		console.error(`Could not read ${ICON_PATH}: ${(error as Error).message}`)
		process.exit(1)
	}

	const agent = new BskyAgent({ service: pdsUrl })
	await agent.login({ identifier, password })

	if (agent.did !== did) {
		console.error(`Auth mismatch: logged in as ${agent.did} but publication belongs to ${did}.`)
		process.exit(1)
	}

	const blobResponse = await agent.com.atproto.repo.uploadBlob(iconBytes, {
		encoding: ICON_MIME,
	})
	const blobRef = blobResponse.data.blob

	const existing = await agent.com.atproto.repo.getRecord({
		repo: did,
		collection: COLLECTION,
		rkey,
	})

	const hadIcon = Boolean((existing.data.value as Record<string, unknown>).icon)
	const updatedRecord = {
		...existing.data.value,
		$type: COLLECTION,
		icon: blobRef,
	}

	const putResponse = await agent.com.atproto.repo.putRecord({
		repo: did,
		collection: COLLECTION,
		rkey,
		record: updatedRecord,
		validate: false,
	})

	console.log(`Publication: ${config.publicationUri}`)
	console.log(`Icon: ${hadIcon ? 'updated' : 'added'} (${iconBytes.length} bytes, CID ${blobRef.ref.toString()})`)
	console.log(`Record CID: ${putResponse.data.cid}`)
	console.log(`Verify: https://atproto.md/at://${did}/${COLLECTION}/${rkey}`)
}

main().catch((error: unknown) => {
	console.error(error)
	process.exit(1)
})
