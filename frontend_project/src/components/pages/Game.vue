<template>
  <div v-if="gameStore.loading" class="loading-modal">
    <div class="spinner"></div>
    <h2 class="loading-text">Loading game...</h2>
  </div>

  <div class="game-container">
    <!-- Game Rules Section -->
    <div class="rules-section" v-if="!gameStore.showGame && !gameStore.showDifficulty && !gameStore.showResults">
      <div class="rules-content">
        <h2>How to Play</h2>
        <ul>
          <li>You will be shown screenshots from various movies</li>
          <li>Choose the correct movie title from the given options</li>
          <li>Complete all questions to see your final score</li>
          <li>Your achievements will be saved for the leaderboard</li>
        </ul>
        <ul v-if="!isAuthenticated" >
          <li class="progress-warning">Your progress will not be saved.</li>
          <li class="progress-warning">To save your progress, please log in.</li>
        </ul>
        <button class="play-button" @click="gameStore.setShowDifficulty(true)">Play Now</button>
      </div>
    </div>
    <!-- Difficulty Selection -->
    <div class="difficulty-modal" v-if="gameStore.showDifficulty">
      <div class="difficulty-content">
        <h2>Select Difficulty</h2>
        <div class="difficulty-options">
          <button @click="gameStore.startGame('easy')" class="difficulty-btn easy">Easy</button>
          <button @click="gameStore.startGame('medium')" class="difficulty-btn medium">Medium</button>
          <button @click="gameStore.startGame('hard')" class="difficulty-btn hard">Hard</button>
        </div>
      </div>
    </div>

    <!-- Game Interface -->
    <div class="game-interface" v-if="gameStore.showGame">
      <div class="progress-bar">
        <div class="progress" :style="{ width: gameStore.progress + '%' }"></div>
      </div>
      <div class="question-container">
        <div class="screenshot-wrapper">
          <img :src="gameStore.currentQuestion.screenshot" alt="Movie Screenshot" class="movie-screenshot" />
          <FactsButton :movieTitle="gameStore.currentQuestion.original_title" :isAnswered="!!gameStore.selectedAnswer" v-if="gameStore.showGame" />
        </div>
        <div class="options-container">
          <button
            v-for="option in gameStore.currentQuestion.options"
            :key="option"
            @click="!gameStore.selectedAnswer && gameStore.checkAnswer(option)"
            class="option-btn"
            :disabled="!!gameStore.selectedAnswer"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>
    <!-- Results Screen -->
    <div class="results-screen" v-if="gameStore.showResults">
      <div class="quizResults">
        <h2>Quiz Results</h2>
        <div class="stats">
          <p>Correct Answers: {{ gameStore.correctAnswers }}</p>
          <p>Total Questions: {{ gameStore.totalQuestions }}</p>
          <p>Score: {{ gameStore.score }}%</p>
          <p>
            Points this game:
            <span>{{ gameStore.gamePoints > 0 ? '+' : '' }}{{ gameStore.gamePoints }}</span>
          </p>
          <p>Your total score: {{ gameStore.userScore }}</p>
          <h3>Review your answers:</h3>
        </div>
      </div>
      <div class="review-list">
        <div v-for="(ans, idx) in gameStore.userAnswers" :key="idx" class="review-item">
          <img :src="ans.question.screenshot" class="review-screenshot" alt="Movie Screenshot" />
          <div class="review-info">
            <p><strong>Correct answer:</strong> {{ ans.question.correctAnswer }}</p>
            <p
              :class="{
                wrong: ans.selected !== ans.question.correctAnswer,
                correct: ans.selected === ans.question.correctAnswer,
              }"
            >
              <strong>Your answer:</strong> {{ ans.selected }}
            </p>
            <p>
              <strong>Points for this question:</strong>
              <span>{{ ans.points > 0 ? '+' : '' }}{{ ans.points }}</span>
            </p>
          </div>
        </div>
      </div>
      <button @click="gameStore.resetGame()" class="play-again-btn">Play Again</button>
    </div>
  </div>
</template>

<script>
import FactsButton from '@/components/components/FactsButton.vue'
import { useGameStore } from '@/stores/game'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

export default {
  name: 'GameView',
  components: { FactsButton },
  setup() {
    const gameStore = useGameStore()
    const authStore = useAuthStore()
    const { isAuthenticated } = storeToRefs(authStore)

    return {
      gameStore,
      isAuthenticated
    }
  },
  mounted() {
    this.gameStore.showDifficulty = false
    this.gameStore.showGame = false
    this.gameStore.showResults = false
    this.gameStore.currentQuestionIndex = 0
    this.gameStore.correctAnswers = 0
    this.gameStore.progress = 0
    this.gameStore.selectedAnswer = null
    this.gameStore.userAnswers = []
    this.gameStore.gamePoints = 0
    this.gameStore.questionPoints = []
    this.gameStore.questions = []
    this.gameStore.currentQuestion = {
      screenshot: '',
      options: [],
      correctAnswer: '',
      original_title: '',
    }
    this.gameStore.loading = false
    this.gameStore.error = ''
  }
}
</script>

<style scoped>

.screenshot-wrapper {
  position: relative;
  margin-bottom: 20px;
  //display: inline-block;
}

.loading-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.spinner {
  width: 60px; height: 60px;
  border: 8px solid var(--color-white);
  border-top: 8px solid var(--color-accent);
  border-radius: 100px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
.loading-text{
  color: var(--color-white);
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.rules-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  text-align: center;
}

.rules-content {
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  background: var(--color-white);
  width: auto;
  box-shadow: 0 0 20px var(--color-black-shadow);
  padding: 40px;
  border-radius: 20px;
  transition: all 0.5s;
}

.rules-content:hover {
  transform: scale(1.01);
  box-shadow: 0 10px 30px var(--color-black-shadow);
}

.rules-content ul {
  list-style: none;
  text-align: center;
  padding: 0;
  margin: 40px 0;
}

h1{
  font-size: 3rem;
}
h2{
  font-size: 2rem;
}

.rules-content li {
  margin: 1rem 0;
  font-size: 1.5rem;
}

.play-button {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.play-button:hover {
  transform: scale(1.1);
  background: var(--color-accent);
}

.difficulty-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.difficulty-content {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
}

.difficulty-options {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.difficulty-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: transform 0.2s;
}

.difficulty-btn:hover {
  transform: scale(1.05);
}

.easy {
  background: var(--color-green);
  color: white;
}

.medium {
  background: var(--color-yellow);
  color: var(--color-black);
}
.hard {
  background: var(--color-red);
  color: var(--color-white);
}

.game-interface {
  max-width: 1000px;
  background: var(--color-white);
  border-radius: 20px;
  box-shadow: 0 0 20px var(--color-black-shadow);
  padding: 40px;
  transition: all 0.5s;
}
.game-interface:hover {
  transform: scale(1.01);
  box-shadow: 0 10px 30px var(--color-black-shadow);
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: var(--color-primary-light);
  border-radius: 20px;
  margin-bottom: 20px;
}

.progress {
  height: 100%;
  background: var(--color-accent);
  border-radius: 20px;
  transition: width 1s;
}

.question-container {
  text-align: center;
}

.movie-screenshot {
  max-width: 100%;
  height: auto;
  border-radius: 20px;
  //margin-bottom: 20px;
}

.options-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.option-btn {
  font-size: 1.3rem;
  padding: 1rem;
  border: 2px solid var(--color-primary);
  border-radius: 20px;
  background: var(--color-white);
  cursor: pointer;
  transition: all 0.3s;
}

.option-btn:hover {
  transform: scale(1.03);
  background: var(--color-primary-light);
  border-color: var(--color-accent);
}

.results-screen {
  text-align: center;
}

.quizResults{
  background: var(--color-white);
  border-radius: 20px;
  padding: 20px;
}

.stats {
  margin: 20px 0;
  font-size: 1.2rem;
}

.play-again-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.play-again-btn:hover {
  transform: scale(1.1);
  background: var(--color-accent);
}

.review-list {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.review-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-white);
  box-shadow: 0 0 20px var(--color-black-shadow);
  border-radius: 20px;
  padding: 10px;
  transition: all 0.5s;
}
.review-item:hover {
  transform: scale(1.01);
  box-shadow: 0 10px 30px var(--color-black-shadow);
}

.review-screenshot {
  width: 350px;
  border-radius: 20px;
  transition: all 0.5s;
}

.review-screenshot:hover{
  transform: scale(1.7) translateY(-40px);

}

.review-info {
  flex: 1;
}

.review-info p {
  margin: 10px 0;
  font-size: 1.3rem;
}
.review-info .wrong {
  color: var(--color-red);
}
.review-info .correct {
  color: var(--color-green);
}

.progress-warning {
  color: #f44336;
  font-weight: 600;
}

</style>
