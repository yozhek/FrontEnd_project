<script>
const API_KEY = '563f70945fc2525450acc89c06c8c972'
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

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
      let sortBy, minVoteCount, year
      if (this.difficulty === 'easy') {
        sortBy = 'popularity.desc'
        minVoteCount = 1000
        year = undefined
      } else if (this.difficulty === 'medium') {
        sortBy = 'popularity.asc'
        minVoteCount = 100
        year = undefined
      } else {
        sortBy = 'popularity.asc'
        minVoteCount = 5
        year = undefined
      }
      let movies = await this.fetchMovies(sortBy, minVoteCount, year)
      movies = shuffle(movies).slice(0, this.totalQuestions)
      this.questions = await Promise.all(
        movies.map(async (movie) => {
          const screenshots = await this.fetchScreenshots(movie.id)
          const screenshot =
            screenshots.length > 0
              ? IMAGE_BASE_URL + screenshots[0].file_path
              : IMAGE_BASE_URL + movie.backdrop_path
          let options = [movie.original_title]
          let otherMovies = shuffle(movies.filter((m) => m.id !== movie.id)).slice(0, 3)
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
    async fetchMovies(sortBy, minVoteCount, year) {
      let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ru-RU&sort_by=${sortBy}&vote_count.gte=${minVoteCount}`
      if (year) url += `&primary_release_date.lte=${year}-12-31`
      url += '&with_original_language=en'
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
      setTimeout(() => {
        this.nextQuestion()
      }, 500)
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
  },
}
</script>

<template>
  <div class="game-container">
    <!-- Game Rules Section -->
    <div class="rules-section" v-if="!showGame && !showDifficulty && !showResults">
      <h1>Movie Quiz Game</h1>
      <div class="rules-content">
        <h2>How to Play</h2>
        <ul>
          <li>You will be shown screenshots from various movies</li>
          <li>Choose the correct movie title from the given options</li>
          <li>Complete all questions to see your final score</li>
          <li>Your achievements will be saved for the leaderboard</li>
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
      <h2>Quiz Results</h2>
      <div class="stats">
        <p>Correct Answers: {{ correctAnswers }}</p>
        <p>Total Questions: {{ totalQuestions }}</p>
        <p>Score: {{ score }}%</p>
      </div>
      <h3>Review your answers:</h3>
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

<style scoped>
.review-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.review-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 1rem;
}
.review-screenshot {
  width: 180px;
  border-radius: 8px;
}
.review-info {
  flex: 1;
}
.review-info p {
  margin: 0.3rem 0;
  font-size: 1.1rem;
}
.review-info .wrong {
  color: #f44336;
}
.review-info .correct {
  color: #4caf50;
}
</style>
