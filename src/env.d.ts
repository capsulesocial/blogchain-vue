/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>;
	export default component;
}

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	readonly VITE_CAPSULE_SERVER: string;
	readonly VITE_CONTRACT_NAME: string;
	readonly VITE_NEAR_NETWORK: string;
	readonly VITE_HOME_DIR: string;
	readonly VITE_NEAR_NODE_URL: string;
	readonly VITE_NEAR_WALLET_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
