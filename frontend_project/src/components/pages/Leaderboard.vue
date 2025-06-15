<template>
  <div class="leaderboard-container">
    <h1 class="leaderboard-title">Leaderboard</h1>
    <div class="sort-controls">
      <button
        v-for="option in sortOptions"
        :key="option.value"
        :class="['sort-btn', { active: selectedSort === option.value }]"
        @click="selectedSort = option.value"
      >
        {{ option.label }}
      </button>
    </div>
    <ul class="leader-list">
      <li
        v-for="(player, idx) in sortedLeaders"
        :key="player.nickname"
        :class="['leader-item', { top1: idx === 0, top2: idx === 1, top3: idx === 2 }]"
      >
        <span class="place">{{ idx + 1 }}</span>
        <span class="nickname">{{ player.nickname }}</span>
        <span class="score">{{ player.score }} pts</span>
        <span v-if="idx === 0" class="medal gold">🥇</span>
        <span v-else-if="idx === 1" class="medal silver">🥈</span>
        <span v-else-if="idx === 2" class="medal bronze">🥉</span>
      </li>
      <template v-if="isAuthenticated">
        <div class="divider"></div>
        <li class="leader-item">
          <span class="place">228</span>
          <span class="nickname">You</span>
          <span class="score">0 pts</span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const sortOptions = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'All time', value: 'all' },
]
const selectedSort = ref('all')

const allLeaders = [
  { nickname: 'MovieKing', score: 1200 },
  { nickname: 'QuizQueen', score: 1150 },
  { nickname: 'FilmFan', score: 1100 },
  { nickname: 'CinemaStar', score: 1050 },
  { nickname: 'Blockbuster', score: 1000 },
  { nickname: 'OscarHunter', score: 950 },
  { nickname: 'PopcornPro', score: 900 },
  { nickname: 'ScreenGenius', score: 850 },
  { nickname: 'ReelMaster', score: 800 },
  { nickname: 'TicketTaker', score: 750 },
]

// Для болванки просто меняем порядок/состав в зависимости от выбранного периода
const sortedLeaders = computed(() => {
  if (selectedSort.value === 'day') {
    return [...allLeaders].sort((a, b) => b.score - a.score).slice(0, 10)
  } else if (selectedSort.value === 'week') {
    return [...allLeaders].sort((a, b) => a.score - b.score).slice(0, 10)
  } else if (selectedSort.value === 'month') {
    return [...allLeaders].sort((a, b) => (b.score + (a.nickname.length - b.nickname.length) * 10) - a.score).slice(0, 10)
  } else {
    return allLeaders
  }
})
</script>

<style scoped>
.leaderboard-container {
  background: var(--color-white);
  border-radius: 20px;
  box-shadow: 0 0 20px var(--color-black-shadow);
  padding: 2rem 2rem 2rem 2rem;
  width: 50%;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.5s;
}

.leaderboard-container:hover {
  transform: scale(1.01);
  box-shadow: 0 10px 30px var(--color-black-shadow);
}

.leaderboard-title {
  color: var(--color-primary);
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
}

.sort-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.sort-btn {
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s, color 0.3s, transform 0.3s;
  box-shadow: 0 2px 8px var(--color-black-shadow);
}

.sort-btn:hover, .sort-btn.active:hover {
  transform: scale(1.2);
  box-shadow: 0 7px 12px var(--color-black-shadow);
}

.sort-btn.active{
  background: var(--color-accent);
  color: var(--color-white);

}

.leader-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.leader-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-white);
  border-radius: 20px;
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  color: var(--color-primary);
  box-shadow: 0 2px 8px var(--color-black-shadow);
  transition: transform 0.3s, box-shadow 0.3s;
}
.leader-item:hover {
  transform: scale(1.03) translateY(-2px);
  box-shadow: 0 6px 16px var(--color-black-shadow);
}

.leader-item.top1 {
  border: 2px solid gold;
  background: linear-gradient(90deg, #ffe46a 0%, rgb(255, 250, 207) 100%);
  font-size: 1.35rem;
  font-weight: bold;
  z-index: 3;
}
.leader-item.top2 {
  border: 2px solid silver;
  background: linear-gradient(90deg, #c0c0c0 0%, #f8fafd 100%);
  z-index: 2;
}
.leader-item.top3 {
  border: 2px solid #cd7f32;
  background: linear-gradient(90deg, #ffb763 0%, #fff2d3 100%);
  z-index: 1;
}

.place {
  font-size: 1.5rem;
  font-weight: bold;
  width: 2.5rem;
  text-align: center;
}
.nickname {
  flex: 1;
  margin-left: 1.5rem;
  font-weight: 500;
  letter-spacing: 1px;
}
.score {
  font-weight: bold;
  color: var(--color-accent);
  margin-right: 1rem;
}
.medal {
  font-size: 1.7rem;
  margin-left: 0.5rem;
}
@media (max-width: 700px) {
  .leaderboard-container {
    max-width: 98vw;
    padding: 1rem 0.5rem;
  }
  .leader-item {
    font-size: 1rem;
    padding: 0.7rem 0.7rem;
  }
  .leaderboard-title {
    font-size: 2rem;
  }
}
.divider {
  width: 100%;
  height: 2px;
  background: var(--color-black-shadow);
  margin: 1rem 0;
  opacity: 0.3;
  border-radius: 20px;
}
</style>
