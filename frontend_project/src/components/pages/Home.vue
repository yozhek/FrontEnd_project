<template>
  <div>
    <p>
      MovieGuess is the ultimate challenge for movie lovers!
      Test your knowledge by guessing movies based on a single screenshot — can you recognize them all?

      🟡 Explore screenshots from iconic and obscure films
      🟡 Climb the Leaderboard by earning points with correct answers
      🟡 Track your progress and stats in your personal Profile
      🟡 Log in to compete with friends and movie buffs around the world
      🟡 Stay connected — follow us on social media for updates and challenges
    </p>
  </div>

  <div class="first-container">
    <homeBox info="game"></homeBox>
    <homeBox info="leaderboard"></homeBox>
  </div>

  <div class="second-container">
    <homeBox info="profile"></homeBox>
    <homeBox info="login"></homeBox>
    <homeBox info="social-networks"></homeBox>
  </div>
</template>

<script>
import homeBox from '@/components/components/home-box.vue'
export default {
  components: {homeBox},
  data(){
    return{}
  },
  methods: {}
}
</script>

<style scoped>

.first-container{
  width: auto;
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.second-container{
  width: auto;
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
</style>
