/** @param date Post date. @returns `YYYY-MM-DD` in UTC. */
export const formatDateHuman = (date: Date): string => {
	const year = date.getUTCFullYear()
	const month = String(date.getUTCMonth() + 1).padStart(2, '0')
	const day = String(date.getUTCDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

/** @param date Post date. @returns ISO-8601 with `+00:00`. */
export const formatDateIso = (date: Date): string => {
	const human = formatDateHuman(date)
	const hours = String(date.getUTCHours()).padStart(2, '0')
	const minutes = String(date.getUTCMinutes()).padStart(2, '0')
	const seconds = String(date.getUTCSeconds()).padStart(2, '0')
	return `${human}T${hours}:${minutes}:${seconds}+00:00`
}
