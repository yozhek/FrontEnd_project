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
    mount(Game, {
      global: {
        plugins: [createPinia()],
      },
    });
  });

  it('completes the game on Easy, then Play Again on Medium, then Play Again on Hard', () => {
    // Start on Easy
    cy.contains('How to Play').should('exist');
    cy.contains('Play Now').should('exist').click();
    cy.contains('Easy').should('exist').click();
    cy.get('.game-interface', { timeout: 10000 }).should('exist');
    for (let i = 0; i < 10; i++) {
      cy.get('.option-btn', { timeout: 10000 }).first().should('exist').click();
    }
    cy.contains('Quiz Results', { timeout: 10000 }).should('exist');
    cy.get('.play-again-btn', { timeout: 10000 }).should('exist').click();

    // Now on Medium
    cy.contains('Medium').should('exist').click();
    cy.get('.game-interface', { timeout: 10000 }).should('exist');
    for (let i = 0; i < 10; i++) {
      cy.get('.option-btn', { timeout: 10000 }).first().should('exist').click();
    }
    cy.contains('Quiz Results', { timeout: 10000 }).should('exist');
    cy.get('.play-again-btn', { timeout: 10000 }).should('exist').click();

    // Now on Hard
    cy.contains('Hard').should('exist').click();
    cy.get('.game-interface', { timeout: 10000 }).should('exist');
    for (let i = 0; i < 10; i++) {
      cy.get('.option-btn', { timeout: 10000 }).first().should('exist').click();
    }
    cy.contains('Quiz Results', { timeout: 10000 }).should('exist');
    cy.get('.play-again-btn', { timeout: 10000 }).should('exist');
  });
});
