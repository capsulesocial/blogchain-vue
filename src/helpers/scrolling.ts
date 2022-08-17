export function handle(delta: number) {
	let OS = navigator.platform as string;
	const target = document.getElementById(`scrollable_content`) as HTMLElement;
	const thumb = document.getElementById('thumb') as HTMLElement;
	let speed;
	switch (OS) {
		case (OS = `Win32`):
			speed = 40;
			break;
		case (OS = `MacIntel`):
			speed = 22;
			break;
		default:
			speed = 22;
			break;
	}
	const top = target.scrollTop - delta * speed;
	target.scrollTop = delta < 0 ? Math.ceil(top) : Math.floor(top);
	thumb.style.top = `${(target.scrollTop * 100) / target.scrollHeight}%`;
}

/** Event handler for mouse wheel event.
 */
export function wheel(event: any) {
	if (event.target.classList.contains(`popup`) || event.target.offsetParent.classList.contains(`popup`)) {
		return;
	}
	let delta = 0;
	if (!event) /* For IE. */ event = window.event;
	if (event.wheelDelta) {
		/* IE/Opera. */
		delta = event.wheelDelta / 120;
	} else if (event.detail) {
		/** Mozilla case. */
		/** In Mozilla, sign of delta is different than in IE.
		 * Also, delta is multiple of 3.
		 */
		delta = -event.detail / 3;
	}

	/** If delta is nonzero, handle it.
	 * Basically, delta is now positive if wheel was scrolled up,
	 * and negative, if wheel was scrolled down.
	 */
	if (delta) handle(delta);
}

export function initScroll() {
	document.addEventListener('DOMContentLoaded', function () {
		// Query elements
		const content = document.getElementById('scrollable_content') as HTMLElement;
		console.log(content);
		const track = document.getElementById('track') as HTMLElement;
		const thumb = document.getElementById('thumb') as HTMLElement;

		// Set the initial height for thumb
		const scrollRatio = content.clientHeight / content.scrollHeight;
		thumb.style.height = `${scrollRatio * 100}%`;

		let pos = { top: 0, y: 0 };

		const mouseDownThumbHandler = function (e: any) {
			pos = {
				// The current scroll
				top: content.scrollTop,
				// Get the current mouse position
				y: e.clientY,
			};

			thumb.classList.add('cursor-grab', 'select-none', 'bg-gray5');
			document.body.classList.add('cursor-grab', 'select-none');

			document.addEventListener('mousemove', mouseMoveHandler);
			document.addEventListener('mouseup', mouseUpHandler);
		};

		const mouseMoveHandler = function (e: any) {
			// How far the mouse has been moved
			const dy = e.clientY - pos.y;

			// Scroll the content
			content.scrollTop = pos.top + dy / scrollRatio;
			thumb.style.top = `${(content.scrollTop * 100) / content.scrollHeight}%`;
		};

		const mouseUpHandler = function (e: any) {
			thumb.classList.remove('cursor-grab', 'select-none', 'bg-gray5');
			document.body.classList.remove('cursor-grab', 'select-none');

			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
		};

		const trackClickHandler = function (e: any) {
			const bound = track.getBoundingClientRect();
			const percentage = (e.clientY - bound.top) / bound.height;
			content.scrollTop = percentage * (content.scrollHeight - content.clientHeight);
			thumb.style.top = `${(content.scrollTop * 100) / content.scrollHeight}%`;
		};

		if (window.screen.availWidth > 1024) {
			if (window.addEventListener) window.addEventListener('wheel', wheel);
			if (thumb.addEventListener) thumb.addEventListener('mousedown', mouseDownThumbHandler);
			if (track.addEventListener) track.addEventListener('click', trackClickHandler);
		}
	});
}
