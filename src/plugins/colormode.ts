export function setColorMode(newMode = `OS`) {
	switch (newMode) {
		case `Dark`:
			document.documentElement.classList.add(`dark`)
			break
		case `Light`:
			document.documentElement.classList.remove(`dark`)
			break
		case `OS`:
			if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
				document.documentElement.classList.add(`dark`)
			} else if (window.matchMedia(`(prefers-color-scheme: light)`).matches) {
				document.documentElement.classList.remove(`dark`)
			}
			break
		default:
			document.documentElement.classList.remove(`dark`)
			break
	}
}
