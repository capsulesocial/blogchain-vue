export function createPostExcerpt(e: string | undefined): string {
	if (!e) {
		return ``;
	}
	const excerpt = e.slice(0, 177).trim();
	if (excerpt.endsWith(`...`)) {
		return excerpt;
	}
	if (excerpt.endsWith(`..`)) {
		return excerpt + `.`;
	}
	if (excerpt.endsWith(`.`)) {
		return excerpt + `..`;
	}
	return excerpt + `...`;
}
