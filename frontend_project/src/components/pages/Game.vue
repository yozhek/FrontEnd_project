<template>
  <div class="game-container">
    <!-- Game Rules Section -->
    <div class="rules-section" v-if="!showGame && !showDifficulty && !showResults">
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
        <button class="play-button" @click="showDifficulty = true">Play Now</button>
      </div>
    </div>

    <!-- Difficulty Selection -->
    <div class="difficulty-modal" v-if="showDifficulty">
      <div class="difficulty-content">
        <h2>Select Difficulty</h2>
        <div class="difficulty-options">
          <button @click="startGame('easy')" class="difficulty-btn easy">Easy</button>
          <button @click="startGame('medium')" class="difficulty-btn medium">Medium</button>
          <button @click="startGame('hard')" class="difficulty-btn hard">Hard</button>
        </div>
      </div>
    </div>

    <!-- Game Interface -->
    <div class="game-interface" v-if="showGame">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="question-container">
        <img :src="currentQuestion.screenshot" alt="Movie Screenshot" class="movie-screenshot" />
        <div class="options-container">
          <button
            v-for="option in currentQuestion.options"
            :key="option"
            @click="!selectedAnswer && checkAnswer(option)"
            class="option-btn"
            :disabled="!!selectedAnswer"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>

    <!-- Results Screen -->
    <div class="results-screen" v-if="showResults">
      <div class="quizResults">
        <h2>Quiz Results</h2>
        <div class="stats">
          <p>Correct Answers: {{ correctAnswers }}</p>
          <p>Total Questions: {{ totalQuestions }}</p>
          <p>Score: {{ score }}%</p>
        </div>
        <h3>Review your answers:</h3>
      </div>
      <div class="review-list">
        <div v-for="(ans, idx) in userAnswers" :key="idx" class="review-item">
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
          </div>
        </div>
      </div>
      <button @click="resetGame" class="play-again-btn">Play Again</button>
    </div>
  </div>
</template>

<script>
const API_KEY = '563f70945fc2525450acc89c06c8c972'
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default {
  name: 'GameView',
  data() {
    return {
      showDifficulty: false,
      showGame: false,
      showResults: false,
      difficulty: '',
      currentQuestionIndex: 0,
      selectedAnswer: null,
      correctAnswers: 0,
      totalQuestions: 10,
      progress: 0,
      questions: [],
      currentQuestion: {
        screenshot: '',
        options: [],
        correctAnswer: '',
        original_title: '',
      },
      loading: false,
      error: '',
      userAnswers: [],
    }
  },
  methods: {
    async startGame(difficulty) {
      this.difficulty = difficulty
      this.showDifficulty = false
      this.showGame = false
      this.showResults = false
      this.loading = true
      this.error = ''
      this.currentQuestionIndex = 0
      this.correctAnswers = 0
      this.progress = 0
      this.selectedAnswer = null
      this.userAnswers = []
      try {
        await this.loadQuestions()
        this.currentQuestion = this.questions[0]
        this.showGame = true
      } catch {
        this.error = 'Failed to load questions. Please try again.'
      } finally {
        this.loading = false
      }
    },
    async loadQuestions() {
      let sortBy, minVoteCount, maxVoteCount
      if (this.difficulty === 'easy') {
        sortBy = 'popularity.desc'
        minVoteCount = 500
      } else if (this.difficulty === 'medium') {
        sortBy = 'popularity.desc'
        minVoteCount = 100
        maxVoteCount = 500
      } else {
        sortBy = 'popularity.asc'
        minVoteCount = 50
      }
      let movies = await this.fetchMovies(sortBy, minVoteCount, maxVoteCount)
      let allMovies = movies;
      movies = shuffle(movies).slice(0, this.totalQuestions)
      this.questions = await Promise.all(
        movies.map(async (movie) => {
          const screenshots = await this.fetchScreenshots(movie.id)
          const screenshot =
            screenshots.length > 0
              ? IMAGE_BASE_URL + screenshots[0].file_path
              : IMAGE_BASE_URL + movie.backdrop_path
          let options = [movie.original_title]
          let otherMovies = shuffle(allMovies.filter((m) => m.id !== movie.id)).slice(0, 3)
          options = options.concat(otherMovies.map((m) => m.original_title))
          options = shuffle(options)
          return {
            screenshot,
            options,
            correctAnswer: movie.original_title,
            original_title: movie.original_title,
          }
        }),
      )
    },
    async fetchMovies(sortBy, minVoteCount, maxVoteCount) {
      let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${sortBy}&vote_count.gte=${minVoteCount}`
      if (maxVoteCount !== null && maxVoteCount !== undefined) {
        url += `&vote_count.lte=${maxVoteCount}`;
      }
      const response = await fetch(url)
      const data = await response.json()
      return data.results.filter((m) => m.backdrop_path && m.title)
    },
    async fetchScreenshots(movieId) {
      const url = `${BASE_URL}/movie/${movieId}/images?api_key=${API_KEY}`
      const response = await fetch(url)
      const data = await response.json()
      return data.backdrops || []
    },
    checkAnswer(answer) {
      this.userAnswers.push({
        question: this.currentQuestion,
        selected: answer,
      })
      this.selectedAnswer = answer
      this.nextQuestion()
    },
    nextQuestion() {
      this.currentQuestionIndex++
      this.selectedAnswer = null
      if (this.currentQuestionIndex < this.questions.length) {
        this.currentQuestion = this.questions[this.currentQuestionIndex]
        this.progress = (this.currentQuestionIndex / this.totalQuestions) * 100
      } else {
        this.correctAnswers = this.userAnswers.filter(
          (ans, idx) => ans.selected === this.questions[idx].correctAnswer,
        ).length
        this.showResults = true
        this.showGame = false
      }
    },
    resetGame() {
      this.showResults = false
      this.showDifficulty = true
      this.currentQuestionIndex = 0
      this.correctAnswers = 0
      this.progress = 0
      this.selectedAnswer = null
      this.userAnswers = []
    },
  },
  computed: {
    score() {
      return Math.round((this.correctAnswers / this.totalQuestions) * 100)
    },
    isAuthenticated() {
      const authStore = useAuthStore()
      return storeToRefs(authStore).isAuthenticated.value
    },
  },
}
</script>

<style scoped>
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  background: #4caf50;
  color: white;
}

.medium {
  background: #ffc107;
  color: black;
}
.hard {
  background: #f44336;
  color: white;
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
  margin-bottom: 20px;
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
  color: #f44336;
}
.review-info .correct {
  color: #4caf50;
}

.progress-warning {
  color: #f44336;
  font-weight: 600;
}

</style>
