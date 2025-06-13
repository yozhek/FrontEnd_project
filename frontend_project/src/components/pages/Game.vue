<template>
  <div class="game-container">
    <!-- Game Rules Section -->
    <div class="rules-section" v-if="!showGame && !showDifficulty">
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
            @click="checkAnswer(option)"
            class="option-btn"
            :class="{ selected: selectedAnswer === option }"
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
      <button @click="resetGame" class="play-again-btn">Play Again</button>
    </div>
  </div>
</template>

<script>
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
      questions: [], // This will be populated with actual questions
      currentQuestion: {
        screenshot: '',
        options: [],
        correctAnswer: '',
      },
    }
  },
  methods: {
    startGame(difficulty) {
      this.difficulty = difficulty
      this.showDifficulty = false
      this.showGame = true
      this.loadQuestions()
    },
    loadQuestions() {
      // TODO: Load questions based on difficulty
      // This is a placeholder for the actual questions
      this.questions = [
        {
          screenshot: '/path/to/screenshot1.jpg',
          options: ['Movie 1', 'Movie 2', 'Movie 3', 'Movie 4'],
          correctAnswer: 'Movie 1',
        },
        // Add more questions here
      ]
      this.currentQuestion = this.questions[0]
    },
    checkAnswer(answer) {
      this.selectedAnswer = answer
      if (answer === this.currentQuestion.correctAnswer) {
        this.correctAnswers++
      }

      setTimeout(() => {
        this.nextQuestion()
      }, 1000)
    },
    nextQuestion() {
      this.currentQuestionIndex++
      this.selectedAnswer = null

      if (this.currentQuestionIndex < this.questions.length) {
        this.currentQuestion = this.questions[this.currentQuestionIndex]
        this.progress = (this.currentQuestionIndex / this.totalQuestions) * 100
      } else {
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
    },
  },
  computed: {
    score() {
      return Math.round((this.correctAnswers / this.totalQuestions) * 100)
    },
  },
}
</script>

<style scoped>
.game-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.rules-section {
  text-align: center;
  padding: 2rem;
}

.rules-content {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.rules-content ul {
  text-align: left;
  margin: 2rem 0;
}

.rules-content li {
  margin: 1rem 0;
  font-size: 1.1rem;
}

.play-button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.play-button:hover {
  background: #45a049;
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
  border-radius: 10px;
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
  border-radius: 5px;
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
  margin: 0 auto;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #ddd;
  border-radius: 5px;
  margin-bottom: 2rem;
}

.progress {
  height: 100%;
  background: #4caf50;
  border-radius: 5px;
  transition: width 0.3s;
}

.question-container {
  text-align: center;
}

.movie-screenshot {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.options-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.option-btn {
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.option-btn:hover {
  border-color: #4caf50;
}

.option-btn.selected {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.results-screen {
  text-align: center;
  padding: 2rem;
}

.stats {
  margin: 2rem 0;
  font-size: 1.2rem;
}

.play-again-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.play-again-btn:hover {
  background: #45a049;
}
</style>
