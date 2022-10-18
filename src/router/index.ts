import { createWebHistory, createRouter } from 'vue-router';
import Index from '@/pages/Index.vue';
import Home from '@/pages/Home.vue';
import Discover from '@/pages/Discover/Index.vue';
import Bookmarks from '@/pages/Bookmarks.vue';
import PostEditor from '@/pages/Post/Editor.vue';
import PostReader from '@/pages/Post/Reader.vue';
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import Category from '@/pages/Discover/Category.vue';
import Profile from '@/pages/Profile/Index.vue';
import Posts from '@/pages/Profile/Posts.vue';
import Comments from '@/pages/Profile/Comments.vue';
import Reposts from '@/pages/Profile/Reposts.vue';
import Tag from '@/pages/Tag.vue';
import Help from '@/pages/Help.vue';
import Subscriptions from '@/pages/Subscriptions.vue';
import Settings from '@/pages/Settings/Index.vue';
import SettingsNetwork from '@/pages/Settings/Network.vue';
import SettingsSecurity from '@/pages/Settings/Security.vue';
import SettingsStyling from '@/pages/Settings/Styling.vue';
import SettingsAccount from '@/pages/Settings/Account.vue';
import SettingsHome from '@/pages/Settings/Nav.vue';
import Notifications from '@/pages/Settings/Notifications.vue';
import PaymentPolicy from '@/pages/PaymentPolicy.vue';
import ContentPolicy from '@/pages/ContentPolicy.vue';
import NotFound from '@/pages/404.vue';
import { useStore } from '@/store/session';

const routes = [
	{
		path: '/',
		name: 'Index',
		component: Index,
		meta: { requiresAuth: false, title: 'Home - Blogchain' },
	},
	{
		path: '/home',
		name: 'Home',
		component: Home,
		meta: {
			requiresAuth: false,
			title: 'Home - Blogchain',
		},
	},
	{
		path: '/discover',
		name: 'Discover',
		component: Discover,
		meta: {
			requiresAuth: false,
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
			requiresAuth: false,
			title: 'Bookmarks - Blogchain',
		},
	},
	{
		path: '/write',
		name: 'Post Editor',
		component: PostEditor,
		meta: {
			requiresAuth: false,
			title: 'Write a Post - Blogchain',
		},
	},
	{
		path: '/post/:post',
		name: 'Post Reader',
		component: PostReader,
		meta: {
			requiresAuth: false,
			title: 'Viewing a Post - Blogchain',
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
			title: 'Create an account on Blogchain',
		},
	},
	{
		path: '/id/:id',
		name: 'Profile',
		component: Profile,
		children: [
			{
				path: '',
				name: 'Posts',
				component: Posts,
			},
			{
				path: 'comments',
				name: 'Comments',
				component: Comments,
			},
			{
				path: 'reposts',
				name: 'Reposts',
				component: Reposts,
			},
		],
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
		path: '/subscriptions',
		name: 'Subscriptions',
		component: Subscriptions,
		meta: {
			requiresAuth: false,
			title: 'Subscriptions - Blogchain',
		},
	},
	{
		path: '/settings',
		name: 'Settings',
		component: Settings,
		children: [
			{
				path: '',
				name: 'Settings',
				component: SettingsHome,
			},
			{
				path: 'account',
				name: 'Account',
				component: SettingsAccount,
			},
			{
				path: 'network',
				name: 'Network',
				component: SettingsNetwork,
			},
			{
				path: 'security',
				name: 'Security',
				component: SettingsSecurity,
			},
			{
				path: 'styling',
				name: 'Styling',
				component: SettingsStyling,
			},
			{
				path: 'notifications',
				name: 'notifications',
				component: Notifications,
			},
		],
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
		path: '/content-policy',
		name: 'Content Policy',
		component: ContentPolicy,
		meta: {
			requiresAuth: false,
			title: 'Content Policy - Blogchain',
		},
	},
	{
		path: '/payment-policy',
		name: 'Payment Policy',
		component: PaymentPolicy,
		meta: {
			requiresAuth: false,
			title: 'PaymentPolicy - Blogchain',
		},
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'Not Found',
		component: NotFound,
		meta: {
			requiresAuth: false,
			title: 'Page not found - Blogchain',
		},
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(async (to) => {
	const store = useStore();
	if (to.meta.requiresAuth && !store.$state.id) {
		window.location.href = window.location.origin + '/login';
	}
	if (to.meta.title) {
		document.title = to.meta.title as string;
	}
});

export default router;
