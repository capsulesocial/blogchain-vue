import { createWebHistory, createRouter } from 'vue-router'
import Index from '../pages/Index.vue'
import Home from '../pages/Home.vue'
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
			title: 'Overview - Author dashboard - Blogchain',
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
