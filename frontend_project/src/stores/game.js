import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { updateUserScore, getUserProfile } from '@/services/userProfile'

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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const useGameStore = defineStore('game', {
  state: () => ({
    APIrestriction: 500,
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
    gamePoints: 0,
    userScore: 0,
    questionPoints: [],
  }),

  getters: {
    score: (state) => {
      return Math.round((state.correctAnswers / state.totalQuestions) * 100)
    },
    isAuthenticated: () => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated
    },
  },

  actions: {
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
      this.gamePoints = 0
      this.questionPoints = []
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
      let pagesForGame = []
      let movies = []

      if (this.APIrestriction === null || this.APIrestriction === undefined) {
        let totalPages = await this.fetchTotalPages(sortBy, minVoteCount)
        minVoteCount = 5
        sortBy = 'popularity.desc'

        if (this.difficulty === 'easy') {
          let pagesEasyLevel = totalPages * 0.2
          for (let i = 0; i < this.totalQuestions; i++) {
            pagesForGame.push(getRandomInt(1, pagesEasyLevel));
          }
        } else if (this.difficulty === 'medium') {
          let minPageMediumLevel = totalPages * 0.2 + 1
          let maxPageMediumLevel = totalPages * 0.5
          for (let i = 0; i < this.totalQuestions; i++) {
            pagesForGame.push(getRandomInt(minPageMediumLevel, maxPageMediumLevel));
          }
        } else {
          let minPageHardLevel = totalPages * 0.5 + 1
          for (let i = 0; i < this.totalQuestions; i++) {
            pagesForGame.push(getRandomInt(minPageHardLevel, totalPages));
          }
        }

        for (let i = 0; i < this.totalQuestions; i++){
          const data = await this.fetchMovies(sortBy, minVoteCount, null ,pagesForGame[i]);
          movies.push(data)
        }
      }
      else {
        for (let i = 0; i < this.totalQuestions; i++) {
          pagesForGame.push(getRandomInt(1, this.APIrestriction));
        }

        if (this.difficulty === 'easy') {
          sortBy = 'popularity.desc'
          minVoteCount = 300
          maxVoteCount = null
        } else if (this.difficulty === 'medium') {
          sortBy ='popularity.desc'
          minVoteCount = 100
          maxVoteCount = 299
        } else {
          sortBy = 'popularity.asc'
          minVoteCount = 100
          maxVoteCount = null
        }

        for (let i = 0; i < this.totalQuestions; i++){
          let actPage = pagesForGame[i]
          const data = await this.fetchMovies(sortBy, minVoteCount, maxVoteCount , actPage);
          movies.push(data)
        }
      }

      let allMovies = movies;
      movies = shuffle(movies).slice(0, this.totalQuestions)
      this.questions = await Promise.all(
        movies.map(async (movie) => {
          let numOfEL = movie.length
          let randIndx = getRandomInt(0, numOfEL-1)

          const screenshots = await this.fetchScreenshots(movie[randIndx].id)
          const screenshot =
            screenshots.length > 0
              ? IMAGE_BASE_URL + screenshots[0].file_path
              : IMAGE_BASE_URL + movie[randIndx].backdrop_path
          let options = [movie[randIndx].title]

          let otherMovies = shuffle(allMovies.map(page =>
            page.filter(film => film.id !== movie[randIndx].id)
          )).slice(0, 3)

          options = options.concat(otherMovies.map((m) => {
            let numOfELOther = m.length
            let randIndxOther = getRandomInt(0, numOfELOther-1)
            return m[randIndxOther].title
          }))

          options = shuffle(options)
          return {
            screenshot,
            options,
            correctAnswer: movie[randIndx].title,
            original_title: movie[randIndx].title,
          }
        }),
      )
    },

    async fetchMovies(sortBy, minVoteCount, maxVoteCount, page) {
      let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&page=${page}&sort_by=${sortBy}&vote_count.gte=${minVoteCount}`
      if (maxVoteCount !== null) {
        url += `&vote_count.lte=${maxVoteCount}`
      }
      const response = await fetch(url)
      const data = await response.json()
      return data.results.filter((m) => m.backdrop_path && m.title)
    },

    async fetchTotalPages(sortBy, minVoteCount) {
      let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&page=1&sort_by=${sortBy}&vote_count.gte=${minVoteCount}`
      const response = await fetch(url)
      const data = await response.json()
      return data.total_pages
    },

    async fetchScreenshots(movieId) {
      const url = `${BASE_URL}/movie/${movieId}/images?api_key=${API_KEY}`
      const response = await fetch(url)
      const data = await response.json()
      return data.backdrops || []
    },

    getPointsForAnswer(isCorrect) {
      let points = 0
      if (this.difficulty === 'easy') points = 1
      else if (this.difficulty === 'medium') points = 3
      else points = 5
      return isCorrect ? points : -points
    },

    async updateUserScoreInFirebase() {
      const authStore = useAuthStore()
      const user = authStore.user
      if (user) {
        await updateUserScore(user.uid, this.gamePoints)
        const profile = await getUserProfile(user.uid)
        this.userScore = profile?.score ?? 0
      }
    },

    checkAnswer(answer) {
      const isCorrect = answer === this.currentQuestion.correctAnswer
      const points = this.getPointsForAnswer(isCorrect)
      this.questionPoints.push(points)
      this.gamePoints += points
      this.userAnswers.push({
        question: this.currentQuestion,
        selected: answer,
        points: points,
        isCorrect: isCorrect,
      })
      this.selectedAnswer = answer
      this.nextQuestion()
    },

    async nextQuestion() {
      this.currentQuestionIndex++
      this.selectedAnswer = null
      if (this.currentQuestionIndex < this.questions.length) {
        this.currentQuestion = this.questions[this.currentQuestionIndex]
        this.progress = (this.currentQuestionIndex / this.totalQuestions) * 100
      } else {
        this.correctAnswers = this.userAnswers.filter(
          (ans, idx) => ans.selected === this.questions[idx].correctAnswer,
        ).length
        await this.updateUserScoreInFirebase()
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
      this.gamePoints = 0
      this.questionPoints = []
    },

    setShowDifficulty(value) {
      this.showDifficulty = value
    }
  }
})
