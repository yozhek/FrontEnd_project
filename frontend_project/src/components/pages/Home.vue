<template>
  <div class="main_home">
    <div class="main-info">
      <p class="home-description">
        <strong>MovieGuess</strong> is the ultimate challenge for movie lovers!<br />
        Test your knowledge by guessing movies based on a single screenshot — can you recognize them all?
      </p>
      <ul class="features-list">
        <li>Explore screenshots from iconic and obscure films</li>
        <li>Climb the <strong>Leaderboard</strong> by earning points with correct answers</li>
        <li>Track your progress and stats in your personal <strong>Profile</strong></li>
        <li>Log in to compete with friends and movie buffs around the world</li>
        <li>Stay connected — follow us on social media for updates and challenges</li>
      </ul>
    </div>

    <div class="first-container">
      <homeBox info="game"></homeBox>
      <homeBox info="leaderboard"></homeBox>
    </div>

    <div class="second-container">
      <div class="box-for-tablets">
        <homeBox info="profile"></homeBox>
        <homeBox info="login"></homeBox>
      </div>
      <homeBox info="social-networks"></homeBox>
    </div>
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
.box-for-tablets{
  display: flex;
  gap: 50px;
  min-width: 66.6%;
}

.main_home{
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  gap: 40px;
  min-height: 83vh;
}

.home-description{
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.features-list{
  font-size: 1.3rem;
}

.main-info{
  box-sizing: border-box;
  width: 100%;
  border-radius: 20px;
  padding: 40px;
  background: var(--color-white);
}

.first-container{
  width: auto;
  display: flex;
  gap: 40px;
}

.second-container{
  width: auto;
  display: flex;
  gap: 40px;
}

ul, p{
  color: var(--color-black);
}

@media (max-width: 1024px) {
  .box-for-tablets{
    gap: 20px;
  }

  .main_home{
    gap: 20px;
  }

  .first-container{
    width: auto;
    display: flex;
    gap: 20px;
  }

  .second-container{
    width: auto;
    display: flex;
    gap: 20px;
  }
}

@media (max-width: 1000px) {

  .main_home{
    gap: 20px;
  }

  .first-container{
    width: auto;
    display: flex;
    gap: 20px;
  }


  .second-container{
    width: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 600px) {
  .first-container{
    display: flex;
    flex-direction: column;
  }

  .box-for-tablets{
    display: flex;
    flex-direction: column;
  }

  .main-info{
    padding: 20px;
  }
}

</style>
