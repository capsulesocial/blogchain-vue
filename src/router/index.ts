import { createWebHistory, createRouter } from 'vue-router';
import { useStore } from '@/store/session';

const Index = () => import('@/pages/Index.vue');
const Home = () => import('@/pages/Home.vue');
const Discover = () => import('@/pages/Discover/Index.vue');
const Bookmarks = () => import('@/pages/Bookmarks.vue');
const PostEditor = () => import('@/pages/Post/Editor.vue');
const PostReader = () => import('@/pages/Post/Reader.vue');
const Login = () => import('@/pages/Login.vue');
const Register = () => import('@/pages/Register.vue');
const Category = () => import('@/pages/Discover/Category.vue');
const Profile = () => import('@/pages/Profile/Index.vue');
const Posts = () => import('@/pages/Profile/Posts.vue');
const Comments = () => import('@/pages/Profile/Comments.vue');
const Reposts = () => import('@/pages/Profile/Reposts.vue');
const Tag = () => import('@/pages/Tag.vue');
const Help = () => import('@/pages/Help.vue');
const Subscriptions = () => import('@/pages/Subscriptions.vue');
const Settings = () => import('@/pages/Settings/Index.vue');
const SettingsNetwork = () => import('@/pages/Settings/Network.vue');
const SettingsSecurity = () => import('@/pages/Settings/Security.vue');
const SettingsStyling = () => import('@/pages/Settings/Styling.vue');
const SettingsAccount = () => import('@/pages/Settings/Account.vue');
const SettingsHome = () => import('@/pages/Settings/Nav.vue');
const Notifications = () => import('@/pages/Settings/Notifications.vue');
const PaymentPolicy = () => import('@/pages/PaymentPolicy.vue');
const ContentPolicy = () => import('@/pages/ContentPolicy.vue');
const NotFound = () => import('@/pages/404.vue');

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
				name: 'Notifications',
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
