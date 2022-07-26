import { Emotions } from './config';

export interface IFace {
	label: Exclude<Emotions, `no-emotion`> | `default`;
	light: any;
	dark: any;
}

export interface IFaceWithoutDefault {
	label: Exclude<Emotions, `no-emotion`>;
	light: any;
	dark: any;
}

export const faces: Record<string, IFace> = {
	default: {
		label: `default`,
		light: require(`@/assets/images/reactions/light/confident.webp`),
		dark: require(`@/assets/images/reactions/dark/confident.webp`),
	},
	admiration: {
		label: `admiration`,
		light: require(`@/assets/images/reactions/light/admiration.webp`),
		dark: require(`@/assets/images/reactions/dark/admiration.webp`),
	},
	aloof: {
		label: `aloof`,
		light: require(`@/assets/images/reactions/light/aloof.webp`),
		dark: require(`@/assets/images/reactions/dark/aloof.webp`),
	},
	awe: {
		label: `awe`,
		light: require(`@/assets/images/reactions/light/awe.webp`),
		dark: require(`@/assets/images/reactions/dark/awe.webp`),
	},
	bored: {
		label: `bored`,
		light: require(`@/assets/images/reactions/light/bored.webp`),
		dark: require(`@/assets/images/reactions/dark/bored.webp`),
	},
	brave: {
		label: `brave`,
		light: require(`@/assets/images/reactions/light/brave.webp`),
		dark: require(`@/assets/images/reactions/dark/brave.webp`),
	},
	calm: {
		label: `calm`,
		light: require(`@/assets/images/reactions/light/calm.webp`),
		dark: require(`@/assets/images/reactions/dark/calm.webp`),
	},
	committed: {
		label: `committed`,
		light: require(`@/assets/images/reactions/light/committed.webp`),
		dark: require(`@/assets/images/reactions/dark/committed.webp`),
	},
	confident: {
		label: `confident`,
		light: require(`@/assets/images/reactions/light/confident.webp`),
		dark: require(`@/assets/images/reactions/dark/confident.webp`),
	},
	cringe: {
		label: `cringe`,
		light: require(`@/assets/images/reactions/light/cringe.webp`),
		dark: require(`@/assets/images/reactions/dark/cringe.webp`),
	},
	curious: {
		label: `curious`,
		light: require(`@/assets/images/reactions/light/curious.webp`),
		dark: require(`@/assets/images/reactions/dark/curious.webp`),
	},
	defiant: {
		label: `defiant`,
		light: require(`@/assets/images/reactions/light/defiant.webp`),
		dark: require(`@/assets/images/reactions/dark/defiant.webp`),
	},
	detached: {
		label: `detached`,
		light: require(`@/assets/images/reactions/light/detached.webp`),
		dark: require(`@/assets/images/reactions/dark/detached.webp`),
	},
	determined: {
		label: `determined`,
		light: require(`@/assets/images/reactions/light/determined.webp`),
		dark: require(`@/assets/images/reactions/dark/determined.webp`),
	},
	disgusted: {
		label: `disgusted`,
		light: require(`@/assets/images/reactions/light/disgusted.webp`),
		dark: require(`@/assets/images/reactions/dark/disgusted.webp`),
	},
	distracted: {
		label: `distracted`,
		light: require(`@/assets/images/reactions/light/distracted.webp`),
		dark: require(`@/assets/images/reactions/dark/distracted.webp`),
	},
	empathy: {
		label: `empathy`,
		light: require(`@/assets/images/reactions/light/empathy.webp`),
		dark: require(`@/assets/images/reactions/dark/empathy.webp`),
	},
	enlighten: {
		label: `enlighten`,
		light: require(`@/assets/images/reactions/light/enlighten.webp`),
		dark: require(`@/assets/images/reactions/dark/enlighten.webp`),
	},
	enthusiastic: {
		label: `enthusiastic`,
		light: require(`@/assets/images/reactions/light/enthusiastic.webp`),
		dark: require(`@/assets/images/reactions/dark/enthusiastic.webp`),
	},
	excited: {
		label: `excited`,
		light: require(`@/assets/images/reactions/light/excited.webp`),
		dark: require(`@/assets/images/reactions/dark/excited.webp`),
	},
	fearful: {
		label: `fearful`,
		light: require(`@/assets/images/reactions/light/fearful.webp`),
		dark: require(`@/assets/images/reactions/dark/fearful.webp`),
	},
	fearless: {
		label: `fearless`,
		light: require(`@/assets/images/reactions/light/fearless.webp`),
		dark: require(`@/assets/images/reactions/dark/fearless.webp`),
	},
	friendly: {
		label: `friendly`,
		light: require(`@/assets/images/reactions/light/friendly.webp`),
		dark: require(`@/assets/images/reactions/dark/friendly.webp`),
	},
	fulfilled: {
		label: `fulfilled`,
		light: require(`@/assets/images/reactions/light/fulfilled.webp`),
		dark: require(`@/assets/images/reactions/dark/fulfilled.webp`),
	},
	furious: {
		label: `furious`,
		light: require(`@/assets/images/reactions/light/furious.webp`),
		dark: require(`@/assets/images/reactions/dark/furious.webp`),
	},
	glad: {
		label: `glad`,
		light: require(`@/assets/images/reactions/light/glad.webp`),
		dark: require(`@/assets/images/reactions/dark/glad.webp`),
	},
	guffaw: {
		label: `guffaw`,
		light: require(`@/assets/images/reactions/light/guffaw.webp`),
		dark: require(`@/assets/images/reactions/dark/guffaw.webp`),
	},
	happy: {
		label: `happy`,
		light: require(`@/assets/images/reactions/light/happy.webp`),
		dark: require(`@/assets/images/reactions/dark/happy.webp`),
	},
	hateful: {
		label: `hateful`,
		light: require(`@/assets/images/reactions/light/hateful.webp`),
		dark: require(`@/assets/images/reactions/dark/hateful.webp`),
	},
	heartbroken: {
		label: `heartbroken`,
		light: require(`@/assets/images/reactions/light/heartbroken.webp`),
		dark: require(`@/assets/images/reactions/dark/heartbroken.webp`),
	},
	hesitant: {
		label: `hesitant`,
		light: require(`@/assets/images/reactions/light/hesitant.webp`),
		dark: require(`@/assets/images/reactions/dark/hesitant.webp`),
	},
	hostile: {
		label: `hostile`,
		light: require(`@/assets/images/reactions/light/hostile.webp`),
		dark: require(`@/assets/images/reactions/dark/hostile.webp`),
	},
	hush: {
		label: `hush`,
		light: require(`@/assets/images/reactions/light/hush.webp`),
		dark: require(`@/assets/images/reactions/dark/hush.webp`),
	},
	incredulous: {
		label: `incredulous`,
		light: require(`@/assets/images/reactions/light/incredulous.webp`),
		dark: require(`@/assets/images/reactions/dark/incredulous.webp`),
	},
	indifferent: {
		label: `indifferent`,
		light: require(`@/assets/images/reactions/light/indifferent.webp`),
		dark: require(`@/assets/images/reactions/dark/indifferent.webp`),
	},
	informed: {
		label: `informed`,
		light: require(`@/assets/images/reactions/light/informed.webp`),
		dark: require(`@/assets/images/reactions/dark/informed.webp`),
	},
	interested: {
		label: `interested`,
		light: require(`@/assets/images/reactions/light/interested.webp`),
		dark: require(`@/assets/images/reactions/dark/interested.webp`),
	},
	intrigued: {
		label: `intrigued`,
		light: require(`@/assets/images/reactions/light/intrigued.webp`),
		dark: require(`@/assets/images/reactions/dark/intrigued.webp`),
	},
	lol: {
		label: `lol`,
		light: require(`@/assets/images/reactions/light/lol.webp`),
		dark: require(`@/assets/images/reactions/dark/lol.webp`),
	},
	lovely: {
		label: `lovely`,
		light: require(`@/assets/images/reactions/light/lovely.webp`),
		dark: require(`@/assets/images/reactions/dark/lovely.webp`),
	},
	mad: {
		label: `mad`,
		light: require(`@/assets/images/reactions/light/mad.webp`),
		dark: require(`@/assets/images/reactions/dark/mad.webp`),
	},
	offended: {
		label: `offended`,
		light: require(`@/assets/images/reactions/light/offended.webp`),
		dark: require(`@/assets/images/reactions/dark/offended.webp`),
	},
	on_it: {
		label: `on_it`,
		light: require(`@/assets/images/reactions/light/on_it.webp`),
		dark: require(`@/assets/images/reactions/dark/on_it.webp`),
	},
	proud: {
		label: `proud`,
		light: require(`@/assets/images/reactions/light/proud.webp`),
		dark: require(`@/assets/images/reactions/dark/proud.webp`),
	},
	regret: {
		label: `regret`,
		light: require(`@/assets/images/reactions/light/regret.webp`),
		dark: require(`@/assets/images/reactions/dark/regret.webp`),
	},
	revolted: {
		label: `revolted`,
		light: require(`@/assets/images/reactions/light/revolted.webp`),
		dark: require(`@/assets/images/reactions/dark/revolted.webp`),
	},
	sad: {
		label: `sad`,
		light: require(`@/assets/images/reactions/light/sad.webp`),
		dark: require(`@/assets/images/reactions/dark/sad.webp`),
	},
	satisfied: {
		label: `satisfied`,
		light: require(`@/assets/images/reactions/light/satisfied.webp`),
		dark: require(`@/assets/images/reactions/dark/satisfied.webp`),
	},
	shocked: {
		label: `shocked`,
		light: require(`@/assets/images/reactions/light/shocked.webp`),
		dark: require(`@/assets/images/reactions/dark/shocked.webp`),
	},
	sick: {
		label: `sick`,
		light: require(`@/assets/images/reactions/light/sick.webp`),
		dark: require(`@/assets/images/reactions/dark/sick.webp`),
	},
	skeptical: {
		label: `skeptical`,
		light: require(`@/assets/images/reactions/light/skeptical.webp`),
		dark: require(`@/assets/images/reactions/dark/skeptical.webp`),
	},
	spiritless: {
		label: `spiritless`,
		light: require(`@/assets/images/reactions/light/spiritless.webp`),
		dark: require(`@/assets/images/reactions/dark/spiritless.webp`),
	},
	spunky: {
		label: `spunky`,
		light: require(`@/assets/images/reactions/light/spunky.webp`),
		dark: require(`@/assets/images/reactions/dark/spunky.webp`),
	},
	suspicious: {
		label: `suspicious`,
		light: require(`@/assets/images/reactions/light/suspicious.webp`),
		dark: require(`@/assets/images/reactions/dark/suspicious.webp`),
	},
	terrified: {
		label: `terrified`,
		light: require(`@/assets/images/reactions/light/terrified.webp`),
		dark: require(`@/assets/images/reactions/dark/terrified.webp`),
	},
	triggered: {
		label: `triggered`,
		light: require(`@/assets/images/reactions/light/triggered.webp`),
		dark: require(`@/assets/images/reactions/dark/triggered.webp`),
	},
	trippy: {
		label: `trippy`,
		light: require(`@/assets/images/reactions/light/trippy.webp`),
		dark: require(`@/assets/images/reactions/dark/trippy.webp`),
	},
	violent: {
		label: `violent`,
		light: require(`@/assets/images/reactions/light/violent.webp`),
		dark: require(`@/assets/images/reactions/dark/violent.webp`),
	},
	whine: {
		label: `whine`,
		light: require(`@/assets/images/reactions/light/whine.webp`),
		dark: require(`@/assets/images/reactions/dark/whine.webp`),
	},
	wild: {
		label: `wild`,
		light: require(`@/assets/images/reactions/light/wild.webp`),
		dark: require(`@/assets/images/reactions/dark/wild.webp`),
	},
	zzz: {
		label: `zzz`,
		light: require(`@/assets/images/reactions/light/zzz.webp`),
		dark: require(`@/assets/images/reactions/dark/zzz.webp`),
	},
};

export const faceGroupings: Array<[IFace, IFace, IFace]> = [
	// Positive
	[faces.curious, faces.informed, faces.enlighten],
	[faces.glad, faces.happy, faces.excited],
	[faces.confident, faces.brave, faces.fearless],
	[faces.defiant, faces.determined, faces.on_it],
	[faces.enthusiastic, faces.lol, faces.guffaw],
	[faces.intrigued, faces.interested, faces.committed],
	[faces.proud, faces.admiration, faces.awe],
	// Neutral
	[faces.empathy, faces.friendly, faces.lovely],
	[faces.calm, faces.satisfied, faces.fulfilled],
	[faces.mad, faces.hostile, faces.violent],
	[faces.hush, faces.wild, faces.zzz],
	[faces.regret, faces.spunky, faces.trippy],

	// Negative
	[faces.distracted, faces.bored, faces.spiritless],
	[faces.cringe, faces.offended, faces.hateful],
	[faces.triggered, faces.shocked, faces.furious],
	[faces.disgusted, faces.sick, faces.revolted],
	[faces.suspicious, faces.incredulous, faces.skeptical],
	[faces.hesitant, faces.fearful, faces.terrified],
	[faces.aloof, faces.indifferent, faces.detached],
	[faces.sad, faces.whine, faces.heartbroken],
];
