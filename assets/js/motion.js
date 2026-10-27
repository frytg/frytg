// One-line availability signal in the footer.
// Holds still when the visitor asks for reduced motion.

const SIGNAL_MS = 160
const SIGNAL_WIDTH = 11

/**
 * @returns True when the visitor prefers reduced motion.
 */
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * @param phase Step along the scanner.
 * @returns An 11-character line with a single peak.
 */
const signalFrame = (phase) => {
	const span = SIGNAL_WIDTH * 2 - 2
	const peak = phase % span
	const x = peak < SIGNAL_WIDTH ? peak : span - peak
	let line = ''
	for (let i = 0; i < SIGNAL_WIDTH; i += 1) {
		if (i === x) {
			line += '#'
		} else if (i === x - 1 || i === x + 1) {
			line += '+'
		} else {
			line += '.'
		}
	}
	return line
}

/**
 * Walk a one-character peak across the availability mark.
 * @param mark Footer signal element.
 */
const startSignal = (mark) => {
	if (prefersReducedMotion()) {
		mark.textContent = signalFrame(5)
		return
	}

	let phase = 0
	let timer = 0

	/**
	 * Paint the current frame and advance.
	 */
	const tick = () => {
		mark.textContent = signalFrame(phase)
		phase += 1
	}

	/**
	 * Start the loop if it is not already running.
	 */
	const start = () => {
		if (timer !== 0) {
			return
		}
		tick()
		timer = window.setInterval(tick, SIGNAL_MS)
	}

	/**
	 * Stop the loop while the tab is hidden.
	 */
	const stop = () => {
		window.clearInterval(timer)
		timer = 0
	}

	document.addEventListener('visibilitychange', () => {
		if (document.hidden) {
			stop()
			return
		}
		start()
	})
	start()
}

document.addEventListener('DOMContentLoaded', () => {
	const mark = document.querySelector('[data-signal]')
	if (mark) {
		startSignal(mark)
	}
})
