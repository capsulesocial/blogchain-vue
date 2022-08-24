import { backgrounds } from '../config/backgrounds';

export function getBGImage(id: string | undefined) {
	console.log(backgrounds);
	const darkMode: boolean = document.documentElement.classList[0] === `dark`;
	const bg = backgrounds.filter((background) => {
		return background.id === id;
	});
	if (bg.length < 1) {
		if (darkMode) {
			return backgrounds[0].dark;
		}
		return backgrounds[0].light;
	}
	if (darkMode) {
		return bg[0].dark;
	}
	return bg[0].light;
}
