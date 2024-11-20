// load packages
import { readFile, readdir, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'
import process from 'node:process'

// Bunny Storage API configuration
const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE
const STORAGE_ENDPOINT = 'https://storage.bunnycdn.com' // Change this based on your primary storage region

async function getLocalFiles(localPath) {
	const localFiles = {}
	async function walkDir(dir) {
		const files = await readdir(dir)
		for (const file of files) {
			const fullPath = join(dir, file)
			const relativePath = relative(localPath, fullPath)
			const stats = await stat(fullPath)
			if (stats.isDirectory()) {
				console.log('walking local', fullPath)
				await walkDir(fullPath)
			} else {
				localFiles[relativePath] = {
					path: fullPath,
					mtime: stats.mtimeMs / 1000,
					size: stats.size,
				}
			}
		}
	}
	await walkDir(localPath)
	return localFiles
}

async function getRemoteFiles(remotePath) {
	// load from remote API
	const url = `${STORAGE_ENDPOINT}/${BUNNY_STORAGE_ZONE}/${remotePath || ''}/`
	const response = await fetch(url, { headers: { AccessKey: BUNNY_STORAGE_API_KEY, accept: 'application/json' } })
	const data = await response.json()
	const remoteFiles = {}
	console.log('remote data', url, data.length, remotePath)

	// walk through the data
	for await (const item of data) {
		// if it's a directory, recurse
		if (item.IsDirectory) {
			const fullPath = join(remotePath, item.ObjectName)
			console.log('walking remote', remotePath, item.ObjectName, fullPath)
			Object.assign(remoteFiles, await getRemoteFiles(fullPath))
		} else {
			// if it's a file, add it to the remote files
			const fullPath = join(remotePath, item.ObjectName)
			console.log('found remote', item.ObjectName, fullPath)
			remoteFiles[fullPath] = {
				path: fullPath,
				mtime: new Date(item.LastChanged).getTime() / 1000,
				size: item.Length,
				item,
			}
		}
	}

	// return the remote files
	return remoteFiles
}

async function uploadFile(localPath, remotePath) {
	const url = `${STORAGE_ENDPOINT}/${BUNNY_STORAGE_ZONE}/${remotePath}`
	const fileContent = await readFile(localPath)
	const response = await fetch(url, {
		method: 'PUT',
		headers: { AccessKey: BUNNY_STORAGE_API_KEY },
		body: fileContent,
	})
	if (!response.ok) throw new Error(`Failed to upload ${remotePath}`)
	console.log(`Uploaded > ${remotePath}`)
}

async function deleteRemoteFile(remotePath) {
	const url = `${STORAGE_ENDPOINT}/${BUNNY_STORAGE_ZONE}/${remotePath}`
	const response = await fetch(url, {
		method: 'DELETE',
		headers: { AccessKey: BUNNY_STORAGE_API_KEY },
	})
	if (!response.ok) throw new Error(`Failed to delete ${remotePath}`)
	console.log(`Deleted > ${remotePath}`)
}

async function syncFolders(localPath, remotePath) {
	// get local files
	const localFiles = await getLocalFiles(localPath)
	await Bun.write('./temp/rsync-local-files.json', JSON.stringify(localFiles, null, 2))

	// get remote files
	const remoteFiles = await getRemoteFiles(remotePath)
	await Bun.write('./temp/rsync-remote-files.json', JSON.stringify(remoteFiles, null, 2))

	// Upload new or modified files
	for await (const [relPath, localInfo] of Object.entries(localFiles)) {
		const remoteFile = remoteFiles[relPath]
		const isUploadRequired = !remoteFile || localInfo.mtime > remoteFile.mtime || localInfo.size !== remoteFile.size
		console.log('upload file?', isUploadRequired, relPath)
		if (isUploadRequired) await uploadFile(localInfo.path, `${remotePath}/${relPath}`)
	}
	console.log('=== uploaded new or modified files ===')

	// Delete files that exist remotely but not locally
	for await (const relPath of Object.keys(remoteFiles)) {
		const isLocalFileDeleted = !localFiles[relPath]
		console.log('delete?', isLocalFileDeleted, relPath)
		if (isLocalFileDeleted) await deleteRemoteFile(`${remotePath}/${relPath}`)
	}
	console.log('=== deleted files that exist remotely but not locally ===')
}

async function main() {
	const localFolder = './public'
	const remoteFolder = ''
	try {
		await syncFolders(localFolder, remoteFolder)
		console.log('Sync completed successfully')
	} catch (error) {
		console.error('Error during sync:', error.message)
	}
}

main()
