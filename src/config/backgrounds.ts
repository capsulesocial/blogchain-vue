export interface IBackground {
	id: string;
	type: string;
	light: any;
	dark: any;
	label: string;
}
import mainBGLight from '@/assets/images/backgrounds/light/mainBG.webp';
import mainBGDark from '../assets/images/backgrounds/dark/mainBG.webp';
import blogginLifeLight from '../assets/images/backgrounds/light/blogn_life.webp';
import blogginLifeDark from '../assets/images/backgrounds/dark/blogn_life.webp';
import blueStrokeLight from '../assets/images/backgrounds/light/blue_stroke.webp';
import blueStrokeDark from '../assets/images/backgrounds/light/blue_stroke.webp';
import brainGuyLight from '../assets/images/backgrounds/light/brain_guy.webp';
import brainGuyDark from '../assets/images/backgrounds/dark/brain_guy.webp';
import buoyLight from '../assets/images/backgrounds/light/buoy.webp';
import buoyDark from '../assets/images/backgrounds/dark/buoy.webp';
import greenStrokeLight from '../assets/images/backgrounds/light/green_stroke.webp';
import greenStrokeDark from '../assets/images/backgrounds/light/green_stroke.webp';
import jellyLight from '../assets/images/backgrounds/light/jelly.webp';
import jellyDark from '../assets/images/backgrounds/dark/jelly.webp';
import neonPinkLight from '../assets/images/backgrounds/light/neon_pink_stroke.webp';
import neonPinkDark from '../assets/images/backgrounds/dark/neon_pink_stroke.webp';
import neonLight from '../assets/images/backgrounds/light/neon_stroke.webp';
import neonDark from '../assets/images/backgrounds/dark/neon_stroke.webp';
import pinkLight from '../assets/images/backgrounds/light/pink_stroke.webp';
import pinkDark from '../assets/images/backgrounds/light/pink_stroke.webp';
import sharkmanLight from '../assets/images/backgrounds/light/sharkman.webp';
import sharkmanDark from '../assets/images/backgrounds/dark/sharkman.webp';
import textureText01Light from '../assets/images/backgrounds/light/texture-text01.webp';
import textureText01Dark from '../assets/images/backgrounds/dark/texture-text01.webp';
import urban01Light from '../assets/images/backgrounds/light/urbanstuff.webp';
import urban01Dark from '../assets/images/backgrounds/dark/urbanstuff.webp';
import urban02Light from '../assets/images/backgrounds/light/urbanstuff001.webp';
import urban02Dark from '../assets/images/backgrounds/dark/urbanstuff001.webp';
import greenMeshLight from '../assets/images/backgrounds/light/green.webp';
import greenMeshDark from '../assets/images/backgrounds/dark/green.webp';
import orangeMeshLight from '../assets/images/backgrounds/light/orange.webp';
import orangeMeshDark from '../assets/images/backgrounds/dark/orange.webp';
import blueMeshLight from '../assets/images/backgrounds/light/blue.webp';
import blueMeshDark from '../assets/images/backgrounds/dark/blue.webp';
import pinkMeshLight from '../assets/images/backgrounds/light/pink.webp';
import pinkMeshDark from '../assets/images/backgrounds/dark/pink.webp';
import yellowMeshLight from '../assets/images/backgrounds/light/yellow.webp';
import yellowMeshDark from '../assets/images/backgrounds/dark/yellow.webp';
import philosopherLight from '../assets/images/backgrounds/light/old_guy.webp';
import philosopherDark from '../assets/images/backgrounds/dark/old_guy.webp';

export const backgrounds: IBackground[] = [
	{
		id: `default`,
		type: `local`,
		light: mainBGLight,
		dark: mainBGDark,
		label: `Default`,
	},
	{
		id: `blogginLife`,
		type: `local`,
		light: blogginLifeLight,
		dark: blogginLifeDark,
		label: `Bloggin' life`,
	},
	{
		id: `blueStroke`,
		type: `local`,
		light: blueStrokeLight,
		dark: blueStrokeDark,
		label: `Blue stroke`,
	},
	{
		id: `brainGuy`,
		type: `local`,
		light: brainGuyLight,
		dark: brainGuyDark,
		label: `Brain guy`,
	},
	{
		id: `buoy`,
		type: `local`,
		light: buoyLight,
		dark: buoyDark,
		label: `Buoy`,
	},
	{
		id: `greenStroke`,
		type: `local`,
		light: greenStrokeLight,
		dark: greenStrokeDark,
		label: `Green stroke`,
	},
	{
		id: `jelly`,
		type: `local`,
		light: jellyLight,
		dark: jellyDark,
		label: `Jelly`,
	},
	{
		id: `neonPinkStroke`,
		type: `local`,
		light: neonPinkLight,
		dark: neonPinkDark,
		label: `Neon pink stroke`,
	},
	{
		id: `neonStroke`,
		type: `local`,
		light: neonLight,
		dark: neonDark,
		label: `Neon stroke`,
	},
	{
		id: `pinkStroke`,
		type: `local`,
		light: pinkLight,
		dark: pinkDark,
		label: `Pink stroke`,
	},
	{
		id: `sharkman`,
		type: `local`,
		light: sharkmanLight,
		dark: sharkmanDark,
		label: `Sharkman`,
	},
	{
		id: `philosopher`,
		type: `Philosopher`,
		light: philosopherLight,
		dark: philosopherDark,
		label: `Philosopher`,
	},
	{
		id: `textureText01`,
		type: `local`,
		light: textureText01Light,
		dark: textureText01Dark,
		label: `Texture text 01`,
	},
	{
		id: `urban01`,
		type: `local`,
		light: urban01Light,
		dark: urban01Dark,
		label: `Urban 01`,
	},
	{
		id: `urban02`,
		type: `local`,
		light: urban02Light,
		dark: urban02Dark,
		label: `Urban 02`,
	},
	{
		id: `greenMesh`,
		type: `local`,
		light: greenMeshLight,
		dark: greenMeshDark,
		label: `Green Mesh`,
	},
	{
		id: `orangeMesh`,
		type: `local`,
		light: orangeMeshLight,
		dark: orangeMeshDark,
		label: `Orange Mesh`,
	},
	{
		id: `blueMesh`,
		type: `local`,
		light: blueMeshLight,
		dark: blueMeshDark,
		label: `Blue Mesh`,
	},
	{
		id: `pinkMesh`,
		type: `local`,
		light: pinkMeshLight,
		dark: pinkMeshDark,
		label: `Pink Mesh`,
	},
	{
		id: `yellowMesh`,
		type: `local`,
		light: yellowMeshLight,
		dark: yellowMeshDark,
		label: `Yellow Mesh`,
	},
];

export function getCurrentBG(id: string): IBackground {
	const bg = backgrounds.find((b) => b.id === id);
	if (bg) {
		return bg;
	}

	return backgrounds[0];
}
