document.addEventListener('DOMContentLoaded', () => {
	const scroll = document.querySelector('[data-nav-scroll]');
	if (!scroll) return;

	const update = () => {
		const { scrollLeft, scrollWidth, clientWidth } = scroll;
		const overflow = scrollWidth > clientWidth + 1;
		const atEnd = scrollLeft + clientWidth >= scrollWidth - 2;

		scroll.classList.toggle('nav-scroll--overflow', overflow && !atEnd);
		scroll.classList.toggle('nav-scroll--at-end', atEnd);
	};

	scroll.addEventListener('scroll', update, { passive: true });
	window.addEventListener('resize', update);
	update();
});
