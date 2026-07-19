// One-time ATProto publication setup for Standard.site.
// Creates a site.standard.publication record on the PDS and writes the
// publication URI to sequoia.json and static/.well-known/.
// Run via `just atproto-init` (requires ATP credentials in SOPS).

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { BskyAgent } from '@atproto/api'

const ROOT = join(import.meta.dirname, '..')
const CONFIG_PATH = join(ROOT, 'sequoia.json')
const WELL_KNOWN_PATH = join(ROOT, 'static/.well-known/site.standard.publication')

type SequoiaConfig = {
	siteUrl: string
	contentDir: string
	publicDir?: string
	publicationUri?: string
	pdsUrl?: string
	identity?: string
	[key: string]: unknown
}

async function loadConfig(): Promise<SequoiaConfig> {
	return JSON.parse(await readFile(CONFIG_PATH, 'utf-8')) as SequoiaConfig
}

async function saveConfig(config: SequoiaConfig): Promise<void> {
	await writeFile(CONFIG_PATH, `${JSON.stringify(config, null, '\t')}\n`)
}

async function writeWellKnown(publicationUri: string): Promise<void> {
	await mkdir(join(ROOT, 'static/.well-known'), { recursive: true })
	await writeFile(WELL_KNOWN_PATH, publicationUri)
}

async function main(): Promise<void> {
	const identifier = process.env.ATP_IDENTIFIER
	const password = process.env.ATP_APP_PASSWORD
	const pdsUrl = process.env.PDS_URL ?? 'https://pds.frytg.digital'

	if (!identifier || !password) {
		console.error(
			'Missing ATP_IDENTIFIER or ATP_APP_PASSWORD. Add them to .env.sops.yaml and run via `just atproto-init`.'
		)
		process.exit(1)
	}

	const config = await loadConfig()

	if (config.publicationUri) {
		console.log(`Publication already configured: ${config.publicationUri}`)
		await writeWellKnown(config.publicationUri)
		return
	}

	const agent = new BskyAgent({ service: pdsUrl })
	await agent.login({ identifier, password })

	const response = await agent.com.atproto.repo.createRecord({
		repo: agent.did,
		collection: 'site.standard.publication',
		record: {
			$type: 'site.standard.publication',
			url: config.siteUrl.replace(/\/$/, ''),
			name: 'Daniel Freytag',
			description: 'Personal site and blog of Daniel Freytag.',
			createdAt: new Date().toISOString(),
			preferences: {
				showInDiscover: true,
			},
		},
	})

	const publicationUri = response.data.uri
	config.publicationUri = publicationUri
	config.pdsUrl = pdsUrl
	config.identity = identifier

	await saveConfig(config)
	await writeWellKnown(publicationUri)

	console.log(`Created publication: ${publicationUri}`)
	console.log(`Updated ${CONFIG_PATH}`)
	console.log(`Updated ${WELL_KNOWN_PATH}`)
}

main().catch((error: unknown) => {
	console.error(error)
	process.exit(1)
})
