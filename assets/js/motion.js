// Footer availability signal and the word reveal on headings and taglines.
// Both hold still when the visitor asks for reduced motion.

const SIGNAL_MS = 160
const SIGNAL_WIDTH = 11

// Revealed words activate once they pass 65% of the viewport height.
const REVEAL_TRIGGER_MARGIN = '0px 0px -35% 0px'
const REVEAL_STEP_MS = 60
const REVEAL_MAX_DELAY_MS = 600

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

/**
 * Wrap each word of an element in a span, keeping spaces and inline markup.
 * @param root Element whose text nodes get split.
 * @returns Word spans in reading order.
 */
const splitWords = (root) => {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
	const textNodes = []
	while (walker.nextNode()) {
		textNodes.push(walker.currentNode)
	}

	const words = []
	for (const node of textNodes) {
		const fragment = document.createDocumentFragment()
		for (const part of (node.textContent ?? '').split(/(\s+)/)) {
			if (!part) {
				continue
			}
			if (/^\s+$/.test(part)) {
				fragment.append(part)
				continue
			}
			const word = document.createElement('span')
			word.className = 'reveal-word'
			word.textContent = part
			fragment.append(word)
			words.push(word)
		}
		node.replaceWith(fragment)
	}
	return words
}

/**
 * Light up words one at a time as they cross the trigger line.
 * Stays fully visible without JS, IntersectionObserver, or with reduced motion.
 * @param element Heading or tagline marked with `.word-reveal`.
 */
const startWordReveal = (element) => {
	if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
		return
	}

	const words = splitWords(element)
	element.classList.add('word-reveal--ready')

	const observer = new IntersectionObserver(
		(entries) => {
			const entering = entries
				.filter((entry) => entry.isIntersecting)
				.map((entry) => entry.target)
				.toSorted((a, b) => words.indexOf(a) - words.indexOf(b))
			entering.forEach((word, index) => {
				const delay = Math.min(index * REVEAL_STEP_MS, REVEAL_MAX_DELAY_MS)
				word.style.transitionDelay = `${delay}ms`
				word.classList.add('reveal-word--on')
				observer.unobserve(word)
			})
		},
		{ rootMargin: REVEAL_TRIGGER_MARGIN }
	)
	for (const word of words) {
		observer.observe(word)
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const mark = document.querySelector('[data-signal]')
	if (mark) {
		startSignal(mark)
	}
	for (const element of document.querySelectorAll('.word-reveal')) {
		startWordReveal(element)
	}
})
