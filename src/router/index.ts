import { createWebHistory, createRouter } from 'vue-router'
import Index from '../pages/Index.vue'
import Home from '../pages/Home.vue'
import Discover from '../pages/Discover.vue'
import Bookmarks from '../pages/Bookmarks.vue'
import Post from '../pages/Post.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Category from '@/pages/Category.vue'
import Profile from '@/pages/Profile.vue'
import Comments from '@/pages/Comments.vue'
import Reposts from '@/pages/Reposts.vue'
import Tag from '@/pages/Tag.vue'
import Help from '@/pages/Help.vue'
import Subscriptions from '@/pages/Subscriptions.vue'
import Settings from '@/pages/Settings.vue'
import SettingsNetwork from '@/pages/SettingsNetwork.vue'
import SettingsSecurity from '@/pages/SettingsSecurity.vue'
import SettingsStyling from '@/pages/SettingsStyling.vue'
import SettingsAccount from '@/pages/SettingsAccount.vue'
import PaymentPolicy from '@/pages/PaymentPolicy.vue'
import { useStore } from '@/store/session'

const routes = [
	{
		path: '/',
		name: 'Index',
		component: Index,
		meta: { requiresAuth: true, title: 'Author dashboard - Blogchain' },
	},
	{
		path: '/home',
		name: 'Home',
		component: Home,
		meta: {
			requiresAuth: true,
			title: 'Home - Blogchain',
		},
	},
	{
		path: '/discover',
		name: 'Discover',
		component: Discover,
		meta: {
			requiresAuth: true,
			title: 'Discover - Blogchain',
		},
	},
	{
		path: '/discover/:category',
		name: 'Category',
		component: Category,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/bookmarks',
		name: 'Bookmarks',
		component: Bookmarks,
		meta: {
			requiresAuth: true,
			title: 'Bookmarks - Blogchain',
		},
	},
	{
		path: '/post',
		name: 'Post',
		component: Post,
		meta: {
			requiresAuth: true,
			title: 'Posts - Blogchain',
		},
	},
	{
		path: '/login',
		name: 'Login',
		component: Login,
		meta: {
			requiresAuth: false,
			title: 'Login - Blogchain',
		},
	},
	{
		path: '/register',
		name: 'Register',
		component: Register,
		meta: {
			requiresAuth: false,
			title: 'Register - Blogchain',
		},
	},
	{
		path: '/id/:id',
		name: 'Profile',
		component: Profile,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/id/:id/:comments',
		name: 'Comments',
		component: Comments,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/id/:id/:reposts',
		name: 'Reposts',
		component: Reposts,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/tag/:tag',
		name: 'Tag',
		component: Tag,
		meta: {
			requiresAuth: false,
		},
	},
	{
		path: '/help',
		name: 'Help',
		component: Help,
		meta: {
			requiresAuth: false,
			title: 'Help - Blogchain',
		},
	},
	{
		path: '/subscriptions',
		name: 'Subscriptions',
		component: Subscriptions,
		meta: {
			requiresAuth: true,
			title: 'Subscriptions - Blogchain',
		},
	},
	{
		path: '/settings',
		name: 'Settings',
		component: Settings,
		meta: {
			requiresAuth: true,
			title: 'Settings - Blogchain',
		},
	},
	{
		path: '/settings/network',
		name: 'SettingsNetwork',
		component: SettingsNetwork,
		meta: {
			requiresAuth: true,
			title: 'SettingsNetwork - Blogchain',
		},
	},
	{
		path: '/settings/security',
		name: 'SettingsSecurity',
		component: SettingsSecurity,
		meta: {
			requiresAuth: true,
			title: 'SettingsSecurity - Blogchain',
		},
	},
	{
		path: '/settings/styling',
		name: 'SettingsStyling',
		component: SettingsStyling,
		meta: {
			requiresAuth: true,
			title: 'SettingsStyling - Blogchain',
		},
	},
	{
		path: '/settings/acount',
		name: 'SettingsAccount',
		component: SettingsAccount,
		meta: {
			requiresAuth: true,
			title: 'SettingsAccount - Blogchain',
		},
	},
	{
		path: '/paymentpolicy',
		name: 'PaymentPolicy',
		component: PaymentPolicy,
		meta: {
			requiresAuth: false,
			title: 'PaymentPolicy - Blogchain',
		},
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach(async (to) => {
	const store = useStore()
	if (to.meta.requiresAuth && !store.$state.id) {
		window.location.href = window.location.origin + '/login'
	}
	if (to.meta.title) {
		;(document as any).title = to.meta.title
	}
})

export default router
