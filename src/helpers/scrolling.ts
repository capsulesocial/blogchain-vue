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
	const scrollRatio = target.clientHeight / target.scrollHeight;
	thumb.style.height = `${scrollRatio * 100}%`;
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

export const setThumbHeight = () => {
	const thumb = document.getElementById('thumb') as HTMLElement;
	const content = document.getElementById('scrollable_content') as HTMLElement;

	// Set the initial height for thumb
	const scrollRatio = content.clientHeight / content.scrollHeight;
	thumb.style.height = `${scrollRatio * 100}%`;
	thumb.style.top = `0`;
};

export const mouseMoveHandler = (e: any, pos?: { top: number; y: number }) => {
	let position = { top: 0, y: 0 };
	if (pos) {
		position = pos;
	}
	const content = document.getElementById('scrollable_content') as HTMLElement;
	const scrollRatio = content.clientHeight / content.scrollHeight;
	const thumb = document.getElementById('thumb') as HTMLElement;
	// How far the mouse has been moved
	const dy = e.clientY - position.y;

	// Scroll the content
	content.scrollTop = position.top + dy / scrollRatio;
	thumb.style.top = `${(content.scrollTop * 100) / content.scrollHeight}%`;
};

export const mouseUpHandler = (e: any) => {
	const thumb = document.getElementById('thumb') as HTMLElement;
	thumb.classList.remove('cursor-grab', 'select-none');
	document.body.classList.remove('cursor-grab', 'select-none');

	thumb.classList.remove('bg-gray5');
	thumb.style.userSelect = `text`;
	thumb.style.cursor = `auto`;
	document.body.style.userSelect = `text`;
	document.body.style.cursor = `auto`;

	document.removeEventListener('mousemove', mouseMoveHandler);
	document.removeEventListener('mouseup', mouseUpHandler);
};

export const trackClickHandler = (e: any) => {
	const content = document.getElementById('scrollable_content') as HTMLElement;
	const track = document.getElementById('track') as HTMLElement;
	const thumb = document.getElementById('thumb') as HTMLElement;
	const bound = track.getBoundingClientRect();
	const percentage = (e.clientY - bound.top) / bound.height;
	content.scrollTop = percentage * (content.scrollHeight - content.clientHeight);
	thumb.style.top = `${(content.scrollTop * 100) / content.scrollHeight}%`;
};

export const initScroll = () => {
	// Query elements
	const track = document.getElementById('track') as HTMLElement;
	const thumb = document.getElementById('thumb') as HTMLElement;

	// Set the initial height for thumb
	setThumbHeight();

	const mouseDownThumbHandler = () => {
		const thumb = document.getElementById('thumb') as HTMLElement;

		thumb.classList.add('bg-gray5');
		thumb.style.userSelect = `none`;
		thumb.style.cursor = `grabbing`;
		document.body.style.userSelect = `none`;
		document.body.style.cursor = `grabbing`;

		document.addEventListener('mousemove', mouseMoveHandler);
		document.addEventListener('mouseup', mouseUpHandler);
	};

	if (window.screen.availWidth > 1024) {
		if (window.addEventListener) window.addEventListener('wheel', wheel);
		if (thumb.addEventListener) thumb.addEventListener('mousedown', mouseDownThumbHandler);
		if (track.addEventListener) track.addEventListener('click', trackClickHandler);
	}
};
