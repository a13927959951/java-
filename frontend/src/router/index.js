import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/game/:levelId',
    name: 'Game',
    component: () => import('../views/GameView.vue')
  },
  {
    path: '/endless',
    name: 'Endless',
    component: () => import('../views/EndlessView.vue')
  },
  {
    path: '/mindmap',
    name: 'Mindmap',
    component: () => import('../views/MindmapView.vue')
  },
  {
    path: '/ai-assistant',
    name: 'AiAssistant',
    component: () => import('../views/AiAssistantView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router