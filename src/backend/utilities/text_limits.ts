const textLimits = {
	post_title: {
		min: 12,
		max: 90,
	},
	post_subtitle: {
		min: 12,
		max: 180,
	},
	post_content: {
		min: 400,
		max: 100000,
	},
	post_tag: {
		min: 1,
		max: 50,
	},
	post_images: {
		min: 0,
		max: 10,
	},
	username: {
		min: 3,
		max: 18,
	},
	profile_name: {
		min: 3,
		max: 32,
	},
	comment_content: {
		min: 1,
		max: 5000,
	},
	number_of_tags: {
		max: 3,
		min: 0, // not implemented
	},
	email: {
		min: 5,
		max: 200,
	},
	featuredPhotoCaption: {
		min: 5,
		max: 180,
	},
	bio: {
		min: 0,
		max: 5000,
	},
	location: {
		min: 0,
		max: 100,
	},
};

export default textLimits;
