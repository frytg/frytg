// Fail if any Hugo process is running before publish/deploy.
// A live `hugo server` can write localhost URLs into public/ and corrupt production output.

import { execFile } from 'node:child_process'
import process from 'node:process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const SELF_SCRIPT_MARKER = 'verify-no-hugo-process'

function commandLooksLikeHugo(command: string): boolean {
	if (command.includes(SELF_SCRIPT_MARKER)) {
		return false
	}
	return /hugo/i.test(command)
}

type PsRow = { pid: number; ppid: number; command: string }

async function listProcesses(): Promise<PsRow[]> {
	const { stdout } = await execFileAsync('ps', ['-ax', '-o', 'pid=', '-o', 'ppid=', '-o', 'command='])
	const rows: PsRow[] = []

	for (const line of stdout.split('\n')) {
		const trimmed = line.trim()
		if (!trimmed) {
			continue
		}

		const match = trimmed.match(/^(\d+)\s+(\d+)\s+(.*)$/)
		if (!match) {
			continue
		}

		rows.push({
			pid: Number(match[1]),
			ppid: Number(match[2]),
			command: match[3],
		})
	}

	return rows
}

function excludedPids(rows: PsRow[]): Set<number> {
	const byPid = new Map(rows.map((row) => [row.pid, row.ppid]))
	const byPpid = new Map<number, number[]>()

	for (const { pid, ppid } of rows) {
		const siblings = byPpid.get(ppid) ?? []
		siblings.push(pid)
		byPpid.set(ppid, siblings)
	}

	const exclude = new Set<number>([process.pid])

	let parent = byPid.get(process.pid)
	while (parent !== undefined && parent !== 0) {
		exclude.add(parent)
		parent = byPid.get(parent)
	}

	const queue = [process.pid]
	while (queue.length > 0) {
		const pid = queue.pop()
		if (pid === undefined) {
			continue
		}
		for (const child of byPpid.get(pid) ?? []) {
			if (!exclude.has(child)) {
				exclude.add(child)
				queue.push(child)
			}
		}
	}

	return exclude
}

async function main(): Promise<void> {
	const rows = await listProcesses()
	const exclude = excludedPids(rows)

	const hugoProcesses = rows.filter(
		(row) => !exclude.has(row.pid) && commandLooksLikeHugo(row.command),
	)

	if (hugoProcesses.length > 0) {
		console.error('Hugo process check failed. Stop Hugo before publishing or deploying:\n')
		for (const { pid, command } of hugoProcesses) {
			console.error(`  pid ${pid}: ${command}`)
		}
		console.error(
			'\nIf you use `just dev`, stop it first. Local preview uses `hugo server --renderToMemory` and must not run during build/deploy.',
		)
		process.exit(1)
	}

	console.log('Hugo process check passed (no running Hugo processes).')
}

main().catch((error: unknown) => {
	console.error(error)
	process.exit(1)
})
