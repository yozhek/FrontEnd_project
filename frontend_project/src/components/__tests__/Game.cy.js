import { mount } from 'cypress/vue';
import { createPinia, setActivePinia } from 'pinia';
import Game from '../pages/Game.vue';
import { useAuthStore } from '@/stores/auth';

describe('GameView', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    authStore.$state = {
      user: {
        uid: 'test_user_id',
        email: 'test@example.com',
        emailVerified: true,
      },
      userProfile: {
        email: 'test@example.com',
        nickname: 'TestUser',
        score: 100,
      },
      loading: false,
      error: null,
    };
  });

  it('Completes the game flow from rules to results', () => {
    mount(Game, {
      global: {
        plugins: [createPinia()],
      },
    });

    // Check rules page and click "Play Now"
    cy.contains('How to Play').should('exist');
    cy.contains('Play Now').should('exist').click();

    // Choose difficulty
    cy.contains('Easy').should('exist').click();

    //Wait for the game interface
    cy.get('.game-interface', { timeout: 10000 }).should('exist');

    //Answer all questions
    for (let i = 0; i < 10; i++) {
      cy.get('.option-btn', { timeout: 10000 }).first().should('exist').click();
    }

    // Verify results page
    cy.contains('Quiz Results', { timeout: 10000 }).should('exist');
    cy.contains('Play Again', { timeout: 10000 }).should('exist');
  });
});
