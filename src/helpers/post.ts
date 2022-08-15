export function createPostExcerpt(e: string): string {
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
