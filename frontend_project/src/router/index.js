import { createRouter, createWebHistory } from 'vue-router'
import Game from '@/components/pages/Game.vue'
import Home from '@/components/pages/Home.vue'
import Leaderboard from '@/components/pages/Leaderboard.vue'
import Login from '@/components/pages/Login.vue'
import Profile from '@/components/pages/Profile.vue'
import Registration from '@/components/pages/Registration.vue'
import SetNickname from '@/components/pages/SetNickname.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/game',
      component: Game,
    },
    {
      path: '/leaderboard',
      component: Leaderboard,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/profile',
      component: Profile,
    },
    {
      path: '/registration',
      component: Registration,
    },
    {
      path: '/set-nickname',
      name: 'SetNickname',
      component: SetNickname
    }
  ],
})

export default router
