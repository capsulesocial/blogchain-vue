import { Tag } from '@/backend/post';
import textLimits from '@/backend/utilities/text_limits';

// Declare types of functions
type CheckResult = { error: string } | { success: boolean };

export function qualityID(input: string): CheckResult {
	const { min: minChars, max: maxChars } = textLimits.username;
	const usernamePattern = `^\\w{${minChars},${maxChars}}$`;
	const blockListed = new Set<string>([`root`, `support`, `admin`]);
	if (input === `` || input === null) {
		return { error: `Missing ID!` };
	}
	if (input.length < minChars) {
		return { error: `ID cannot be less than ${minChars} characters` };
	}
	if (input.length > maxChars) {
		return { error: `ID cannot be more than ${maxChars} characters` };
	}
	if (!new RegExp(usernamePattern).test(input)) {
		return { error: `ID must only contain numbers, letters, and underscores` };
	}
	if (blockListed.has(input)) {
		return { error: `ID unavailable` };
	}
	if (input.includes(`capsule`)) {
		return { error: `ID cannot contain capsule as a keyword` };
	}
	return { success: true };
}

export function qualityEmail(input: string): CheckResult {
	const { min: minChars, max: maxChars } = textLimits.email;
	if (input === `` || input === null) {
		return { error: `Missing Email!` };
	}

	if (input.length < minChars) {
		return { error: `Email cannot be less than ${minChars} characters` };
	}

	if (input.length > maxChars) {
		return { error: `Email cannot be more than ${maxChars} characters` };
	}

	const regex =
		// eslint-disable-next-line no-control-regex
		/^(?:[a-z0-9_\-.]+(?:\.[a-z0-9_\-.]+)*)@(?:(?:[a-z0-9_\-.](?:[a-z0-9_\-.]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9]*[a-z0-9])?)$/;

	if (!regex.test(input)) {
		return { error: `Invalid email syntax!` };
	}
	return { success: true };
}

export const URLRegex = /^((http:\/\/)|(https:\/\/))?(((\w|-){1,63})\.)?((\w|-){1,253})\.([a-z]{2,63})(\/.*)?$/;

export function qualityURL(url: string): CheckResult {
	if (!URLRegex.test(url)) {
		return { error: `Invalid URL` };
	}

	return { success: true };
}

export function qualityTitle(title: string, titleError?: string): CheckResult {
	if (title.length === 0) {
		return { error: `Please enter a title.` };
	}
	if (title.length < textLimits.post_title.min) {
		return { error: `Title length cannot be less than ${textLimits.post_title.min} characters` };
	}
	if (title.length > textLimits.post_title.max) {
		return { error: `Title length cannot be more than ${textLimits.post_title.max} characters` };
	}
	if (titleError && titleError !== ``) {
		return { error: titleError };
	}
	return { success: true };
}

export function qualitySubtitle(subtitle: string, subtitleError?: string): CheckResult {
	if (subtitle.length !== 0 && subtitle.length < textLimits.post_subtitle.min) {
		return { error: `Subtitle length cannot be less than ${textLimits.post_subtitle.min} characters` };
	}
	if (subtitle.length !== 0 && subtitle.length > textLimits.post_subtitle.max) {
		return { error: `Subtitle length cannot be more than ${textLimits.post_subtitle.max} characters` };
	}
	if (subtitleError && subtitleError !== ``) {
		return { error: subtitleError };
	}
	return { success: true };
}

export function qualityFeaturedPhotoCaption(featuredPhotoCaption: string): CheckResult {
	if (featuredPhotoCaption.length !== 0 && featuredPhotoCaption.length < textLimits.featuredPhotoCaption.min) {
		return { error: `Featured photo caption cannot be less than ${textLimits.featuredPhotoCaption.min} characters` };
	}
	if (featuredPhotoCaption.length !== 0 && featuredPhotoCaption.length > textLimits.featuredPhotoCaption.max) {
		return { error: `Featured photo caption cannot be more than ${textLimits.featuredPhotoCaption.max} characters` };
	}
	return { success: true };
}
export function qualityTags(tag: string, tags?: Array<any>): CheckResult {
	if (tag.trim().length < textLimits.post_tag.min) {
		return { error: `Tag length cannot be less than ${textLimits.post_tag.min} characters` };
	}
	if (tag.trim().length > textLimits.post_tag.max) {
		return { error: `Tag length cannot be more than ${textLimits.post_tag.max} characters` };
	}
	if (tag.replace(/\s/, ``).trim() !== tag) {
		return { error: `Tag with spaces is not allowed` };
	}
	// Check for numbers, letters, underscores, dashes
	const validexp = /^[\w-]+$/;
	if (!validexp.test(tag)) {
		return { error: `Invalid character in tag` };
	}
	if (tags) {
		if (tags.length > 2) {
			return { error: `Maximum 3 tags are allowed` };
		}
		if (tags.some((t: Tag) => t.name === tag)) {
			return { error: `Duplicate tags are not allowed` };
		}
	}
	return { success: true };
}

export function qualityComment(input: string): CheckResult {
	if (input.length < textLimits.comment_content.min) {
		return { error: `Comment length cannot be less than ${textLimits.comment_content.min} characters` };
	}
	if (input.length > textLimits.comment_content.max) {
		return { error: `Comment length cannot be more than ${textLimits.comment_content.max} characters` };
	}
	return { success: true };
}

export function qualityContent(input: string): CheckResult {
	if (input.length < textLimits.post_content.min) {
		return { error: `Content length cannot be less than ${textLimits.post_content.min} characters` };
	}
	if (input.length > textLimits.post_content.max) {
		return { error: `Content length cannot be more than ${textLimits.post_content.max} characters` };
	}
	return { success: true };
}

export function qualityBio(input: string): CheckResult {
	if (input.length < textLimits.bio.min) {
		return { error: `Bio length cannot be less than ${textLimits.bio.min} characters` };
	}
	if (input.length > textLimits.bio.max) {
		return { error: `Bio length cannot be more than ${textLimits.bio.max} characters` };
	}
	return { success: true };
}

export function qualityLocation(input: string): CheckResult {
	if (input.length < textLimits.location.min) {
		return { error: `Location length cannot be less than ${textLimits.location.min} characters` };
	}
	if (input.length > textLimits.location.max) {
		return { error: `Location length cannot be more than ${textLimits.location.max} characters` };
	}
	return { success: true };
}
