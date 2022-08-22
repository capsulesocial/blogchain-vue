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
