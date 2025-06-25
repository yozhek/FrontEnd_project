import { mount } from 'cypress/vue'
import { createPinia, setActivePinia } from 'pinia'
import Registration from '../pages/Registration.vue'
import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

// Mock routes for testing navigation
const routes = [
  { path: '/login', name: 'Login', component: { template: '<div>Login Page</div>' } },
  { path: '/profile', name: 'Profile', component: { template: '<div>Profile Page</div>' } },
  {
    path: '/set-nickname',
    name: 'SetNickname',
    component: { template: '<div>Set Nickname Page</div>' },
  },
]

describe('Registration.vue', () => {
  let pinia
  let router
  let authStore

  beforeEach(() => {
    // Setup fresh store, router, and stubs for each test
    pinia = createPinia()
    setActivePinia(pinia)
    authStore = useAuthStore()

    router = createRouter({
      history: createWebHistory(),
      routes,
    })

    // Spy on router.push to track navigation
    cy.spy(router, 'push').as('routerPush')

    // Mount the component
    mount(Registration, {
      global: {
        plugins: [pinia, router],
      },
    })
  })

  it('renders the registration form correctly', () => {
    cy.contains('h2', 'Create Your Account')
    cy.get('input#username').should('be.visible')
    cy.get('input#email').should('be.visible')
    cy.get('input#password').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Create Account')
    cy.get('button').should('contain', 'Already have an account? Login')
  })

  it('allows user to type into form fields', () => {
    cy.get('input#username').type('testuser')
    cy.get('input#username').should('have.value', 'testuser')
    cy.get('input#email').type('test@example.com')
    cy.get('input#email').should('have.value', 'test@example.com')
    cy.get('input#password').type('password123')
    cy.get('input#password').should('have.value', 'password123')
  })

  it('shows an error if email is already in use', () => {
    // Stub the register method to simulate a specific backend error
    cy.stub(authStore, 'register').rejects({ code: 'auth/email-already-in-use' })

    cy.get('input#username').type('newuser')
    cy.get('input#email').type('existing@example.com')
    cy.get('input#password').type('password123')
    cy.get('form').submit()

    // Ensure the specific error message is visible to the user
    cy.get('.auth-form .error-message').should('contain', 'This email is already in use')
  })

  it('shows an error for a weak password', () => {
    cy.stub(authStore, 'register').rejects({ code: 'auth/weak-password' })

    cy.get('input#username').type('newuser')
    cy.get('input#email').type('new@example.com')
    cy.get('input#password').type('123')
    cy.get('form').submit()

    cy.get('.error-message').should('contain', 'Password should be at least 6 characters')
  })

  it('shows the email verification screen on successful registration', () => {
    const mockUser = { uid: '123', email: 'test@example.com' }
    cy.stub(authStore, 'register').resolves(mockUser)

    cy.get('input#username').type('testuser')
    cy.get('input#email').type('test@example.com')
    cy.get('input#password').type('password123')
    cy.get('form').submit()

    // Check that the verification screen is shown
    cy.contains('h2', 'Verify your email').should('be.visible')
    cy.contains('A verification email has been sent to').should('be.visible')
    cy.contains('b', 'test@example.com').should('be.visible')
  })

  it('redirects to login when the login button is clicked', () => {
    cy.contains('button', 'Already have an account? Login').click()
    cy.get('@routerPush').should('be.calledWith', '/login')
  })

  it('handles Google registration and redirects to set nickname', () => {
    // Simulate a new user via Google
    cy.stub(authStore, 'loginWithGoogle').callsFake(() => {
      authStore.userProfile = null // No profile exists
      return Promise.resolve()
    })

    cy.get('.google-btn').click()
    cy.get('@routerPush').should('be.calledWith', { name: 'SetNickname' })
  })
})
