<template>
  <div class="main-info">
    <div class="profile-page">
      <!-- Левая карточка с фото и никнеймом -->
      <div class="profile-card">
        <div class="avatar-wrapper">
          <img src="@/assets/img.png" alt="avatar" class="avatar" />
        </div>
        <h2 class="username">{{ user.nickname }}</h2>

        <div class="info-list">
          <div class="info-item">
            <span class="label">Nickname:</span>
            <span class="value">{{ user.nickname }}</span>
          </div>
          <div class="info-item">
            <span class="label">Points:</span>
            <span class="value">{{ user.totalPoints }} ⭐</span>
          </div>
        </div>
      </div>

      <!-- Правая колонка с двумя карточками -->
      <div class="right-cards">
        <!-- Верхняя карточка: Quiz summary -->
        <div class="quiz-card">
          <h3>Quiz Summary</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="label">Quizzes Taken:</span>
              <span class="value">{{ user.quizzesCompleted }}</span>
            </div>
            <div class="info-item">
              <span class="label">Highest Score:</span>
              <span class="value">98</span>
            </div>
            <div class="info-item">
              <span class="label">Average Score:</span>
              <span class="value">85</span>
            </div>
          </div>
        </div>

        <!-- Нижняя карточка: Настройки -->
        <div class="settings-card">
          <h3>Settings</h3>
          <div class="info-list">
            <div class="info-item setting-row">
              <div>
                <span class="label">Email:</span>
                <span class="value">{{ user.email }}</span>
              </div>
              <button class="btn-change">Change</button>
            </div>

            <div class="info-item setting-row">
              <div>
                <span class="label">Password:</span>
                <span class="value">••••••••</span>
              </div>
              <button class="btn-change">Change</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const user = reactive({
  email: 'admin@gmail.com',
  nickname: 'MovieKing',
  quizzesCompleted: 12,
  totalPoints: 875,
})
</script>



<style scoped>
@import '@/assets/profile.css';

</style>
