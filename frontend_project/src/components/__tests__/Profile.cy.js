import { mount } from 'cypress/vue'
import Profile from '../pages/Profile.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'

// Mock routes for testing navigation
const routes = [
  { path: '/login', name: 'Login', component: { template: '<div>Login Page</div>' } },
  { path: '/', name: 'Home', component: { template: '<div>Home Page</div>' } },
]

describe('Profile.vue', () => {
  let router

  // This runs before each test
  beforeEach(() => {
    // Setup a fresh Pinia store and a mock router for each test
    setActivePinia(createPinia())
    router = createRouter({
      history: createWebHistory(),
      routes,
    })
    // Spy on the router's push method to track navigation calls
    cy.spy(router, 'push').as('routerPush')
  })

  // Test case 1: The view for a guest (not logged in) user
  it('displays a login prompt for unauthenticated users', () => {
    mount(Profile, {
      global: {
        plugins: [router],
      },
    })

    // Check for the prompt message and login/register buttons
    cy.contains('h2', 'Profile is available only for authorized users').should('be.visible')
    cy.contains('button', 'Login').should('be.visible')
    cy.contains('button', 'Create Account').should('be.visible')
  })

  // Test case 2: The view for a logged-in user
  it('displays user profile information when authenticated', () => {
    // Simulate a logged-in user by populating the auth store
    const authStore = useAuthStore()
    authStore.currentUserProfile = ref({
      nickname: 'CypressUser',
      email: 'test@cypress.io',
      score: 1500,
    })
    // Also simulate the base user object required by the component
    authStore.user = {
      uid: 'test-uid',
      providerData: [{ providerId: 'password' }], // Simulate a password user
    }

    mount(Profile, {
      global: {
        plugins: [router],
      },
    })

    // Check that the user's details are displayed
    cy.contains('.username', 'CypressUser').should('be.visible')
    cy.contains('.label', 'Nickname:').siblings('.value').should('contain', 'CypressUser')
    cy.contains('.label', 'Email:').siblings('.value').should('contain', 'test@cypress.io')

    // Find the row containing the password label, then find the change button within it
    cy.contains('.setting-row', 'Password:')
      .find('button.btn-change')
      .should('be.visible')
  })

  // Test case 3: Opening and viewing the change password modal
  it('shows and hides the change password modal correctly', () => {
    // Simulate a logged-in user
    const authStore = useAuthStore()
    authStore.currentUserProfile = ref({ nickname: 'CypressUser', email: 'test@cypress.io' })
    authStore.user = {
      uid: 'test-uid',
      providerData: [{ providerId: 'password' }], // Simulate a password user
    }

    mount(Profile, {
      global: {
        plugins: [router],
      },
    })

    // Find the change password button within its row and click it
    cy.contains('.setting-row', 'Password:')
      .find('button.btn-change')
      .click()

    // Check that the modal and its contents are now visible
    cy.get('.modal-form').should('be.visible')
    cy.contains('h2', 'Change Password').should('be.visible')
    cy.get('input#oldPassword').should('be.visible')
    cy.get('input#newPassword').should('be.visible')
    cy.get('input#repeatPassword').should('be.visible')
    cy.contains('button', 'Save').should('be.visible')

    // Click the cancel button to close the modal
    cy.contains('button', 'Cancel').click()
    cy.get('.modal-form').should('not.exist')
  })

  // Test case 4: Change Password Form Logic
  describe('Change Password Form', () => {
    // Helper function to open the modal before each test in this block
    beforeEach(() => {
      // Simulate a logged-in user
      const authStore = useAuthStore()
      authStore.currentUserProfile = ref({ nickname: 'CypressUser', email: 'test@cypress.io' })
      authStore.user = { uid: 'test-uid', providerData: [{ providerId: 'password' }] }

      mount(Profile, {
        global: {
          plugins: [router],
        },
      })

      // Open the modal
      cy.contains('.setting-row', 'Password:').find('button.btn-change').click()
    })

    it('shows a validation error if new passwords do not match', () => {
      cy.get('#oldPassword').type('current-password')
      cy.get('#newPassword').type('new-password-1')
      cy.get('#repeatPassword').type('new-password-2')
      cy.get('.modal-form form').submit()

      cy.get('.error-message').should('contain', 'New passwords do not match.')
    })

    it('shows an error from the backend if password change fails', () => {
      // Stub the authStore method to simulate a failure
      const authStore = useAuthStore()
      cy.stub(authStore, 'changePassword').rejects(new Error('Wrong current password'))

      cy.get('#oldPassword').type('wrong-old-password')
      cy.get('#newPassword').type('new-valid-password')
      cy.get('#repeatPassword').type('new-valid-password')
      cy.get('.modal-form form').submit()

      // Check for the backend error message
      cy.get('.error-message').should('contain', 'Wrong current password')
    })

    it('shows a success message on successful password change', () => {
      // Stub the authStore method to simulate success
      const authStore = useAuthStore()
      cy.stub(authStore, 'changePassword').resolves()

      cy.get('#oldPassword').type('current-password')
      cy.get('#newPassword').type('new-awesome-password')
      cy.get('#repeatPassword').type('new-awesome-password')
      cy.get('.modal-form form').submit()

      // Check for the success message and that the error message is gone
      cy.get('.success-message').should('contain', 'Password changed successfully!')
      cy.get('.error-message').should('not.exist')
    })
  })
})
