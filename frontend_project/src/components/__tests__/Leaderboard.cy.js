import { mount } from 'cypress/vue'
import Leaderboard from '../pages/Leaderboard.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('Leaderboard.vue', () => {
  beforeEach(() => {
    // Setup Pinia for the component
    setActivePinia(createPinia())
  })

  it('renders the leaderboard with all required elements', () => {
    // Mount the component
    mount(Leaderboard)

    // Check for the main title
    cy.contains('h1', 'Leaderboard').should('be.visible')

    // Check for the sort buttons
    cy.get('.sort-controls').should('be.visible')
    cy.contains('button', 'Day').should('be.visible')
    cy.contains('button', 'Week').should('be.visible')
    cy.contains('button', 'Month').should('be.visible')
    cy.contains('button', 'All time').should('be.visible')

    // Check that the list of leaders is rendered
    // We expect 10 items based on the hardcoded data
    cy.get('.leader-list .leader-item').should('have.length', 10)

    // Check for the first player's structure (without checking the actual name)
    cy.get('.leader-item').first().within(() => {
      cy.get('.place').should('be.visible')
      cy.get('.nickname').should('be.visible')
      cy.get('.score').should('be.visible')
      cy.get('.medal.gold').should('be.visible')
    })

    // Check that the "You" section is not visible by default (when not authenticated)
    cy.contains('.leader-item', 'You').should('not.exist')
  })

  it('shows the authenticated user`s position', () => {
    // Mock the auth store to simulate an authenticated user
    const authStore = useAuthStore()
    authStore.user = { uid: 'test-user', emailVerified: true } // Simulate a logged-in user

    // Mount the component
    mount(Leaderboard)

    // Now the "You" section should be visible
    cy.contains('.leader-item', 'You').should('be.visible')
  })
})
