/** This is high-level function.
 * It must react to delta being more/less than zero.
 */
export function handle(delta: number) {
	const target = document.getElementById(`scrollable_content`) as HTMLElement;
	const speed = 20;
	const top = target.scrollTop - delta * speed;
	target.scrollTop = delta < 0 ? Math.ceil(top) : Math.floor(top);
}

/** Event handler for mouse wheel event.
 */
export function wheel(event: any) {
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

	/** Prevent default actions caused by mouse wheel.
	 * That might be ugly, but we handle scrolls somehow
	 * anyway, so don't bother here..
	 */
	// event.returnValue = false;
}
