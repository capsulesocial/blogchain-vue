/*
 * Copyright (c) 2021-2022 Capsule Social, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
import { createWebHistory, createRouter } from 'vue-router';
import Index from '../pages/Index.vue';
import Home from '../pages/Home.vue';
import Discover from '../pages/Discover/Index.vue';
import Bookmarks from '../pages/Bookmarks.vue';
import Post from '../pages/Post.vue';
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import Category from '@/pages/Discover/Category.vue';
import Profile from '@/pages/Profile/Index.vue';
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
import PaymentPolicy from '@/pages/PaymentPolicy.vue';
import ContentPolicy from '@/pages/ContentPolicy.vue';
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
		path: '/post',
		name: 'Post',
		component: Post,
		meta: {
			requiresAuth: false,
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
			title: 'Create an account on Blogchain',
		},
	},
	{
		path: '/id/:id',
		name: 'Profile',
		component: Profile,
		children: [
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
		meta: {
			requiresAuth: false,
			title: 'Settings - Blogchain',
		},
	},
	{
		path: '/settings/network',
		name: 'SettingsNetwork',
		component: SettingsNetwork,
		meta: {
			requiresAuth: false,
			title: 'SettingsNetwork - Blogchain',
		},
	},
	{
		path: '/settings/security',
		name: 'SettingsSecurity',
		component: SettingsSecurity,
		meta: {
			requiresAuth: false,
			title: 'SettingsSecurity - Blogchain',
		},
	},
	{
		path: '/settings/styling',
		name: 'SettingsStyling',
		component: SettingsStyling,
		meta: {
			requiresAuth: false,
			title: 'SettingsStyling - Blogchain',
		},
	},
	{
		path: '/settings/acount',
		name: 'SettingsAccount',
		component: SettingsAccount,
		meta: {
			requiresAuth: false,
			title: 'SettingsAccount - Blogchain',
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
		(document as any).title = to.meta.title;
	}
});

export default router;
