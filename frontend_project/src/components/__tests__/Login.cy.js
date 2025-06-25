import { mount } from 'cypress/vue';
import { createPinia, setActivePinia } from 'pinia';
import Login from '../pages/Login.vue';
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

// Mock routes
const routes = [
  { path: '/profile', name: 'Profile', component: { template: '<div>Profile Page</div>' } },
  {
    path: '/registration',
    name: 'Registration',
    component: { template: '<div>Registration Page</div>' },
  },
  {
    path: '/set-nickname',
    name: 'SetNickname',
    component: { template: '<div>Set Nickname Page</div>' },
  },
];

describe('Login.vue', () => {
  let pinia;
  let router;
  let authStore;

  beforeEach(() => {
    // Create a new Pinia store and router for each test
    pinia = createPinia();
    setActivePinia(pinia);
    authStore = useAuthStore();

    router = createRouter({
      history: createWebHistory(),
      routes,
    });
    cy.spy(router, 'push').as('routerPush');

    // Mount the component with Pinia and the mock router
    mount(Login, {
      global: {
        plugins: [pinia, router],
      },
    });
  });

  it('renders the login form correctly', () => {
    cy.contains('h2', 'Welcome to MovieGuess');
    cy.get('input#email').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Login');
    cy.get('button').should('contain', 'Create Account');
    cy.get('button.google-btn').should('be.visible');
  });

  it('allows user to type into email and password fields', () => {
    cy.get('input#email').type('test@example.com');
    cy.get('input#email').should('have.value', 'test@example.com');
    cy.get('input#password').type('password123');
    cy.get('input#password').should('have.value', 'password123');
  });

  it('shows an error message for failed login', () => {
    cy.stub(authStore, 'login').rejects({ code: 'auth/wrong-password' });

    cy.get('input#email').type('test@example.com');
    cy.get('input#password').type('wrong-password');
    cy.get('button[type="submit"]').click();

    cy.get('.error-message').should('be.visible');
    cy.get('.error-message').should('contain', 'Incorrect password. Please try again.');
  });

  it('redirects to profile on successful login', () => {
    cy.stub(authStore, 'login').resolves();

    cy.get('input#email').type('test@example.com');
    cy.get('input#password').type('password123');
    cy.get('button[type="submit"]').click();

    cy.get('@routerPush').should('be.calledWith', '/profile');
  });

  it('redirects to set-nickname on successful Google login if profile is incomplete', () => {
    cy.stub(authStore, 'loginWithGoogle').callsFake(() => {
      authStore.userProfile = null;
      return Promise.resolve();
    });

    cy.get('.google-btn').click();

    cy.get('@routerPush').should('be.calledWith', { name: 'SetNickname' });
  });

  it('redirects to profile on successful Google login if profile is complete', () => {
    cy.stub(authStore, 'loginWithGoogle').callsFake(() => {
      authStore.userProfile = { nickname: 'TestUser' };
      return Promise.resolve();
    });

    cy.get('.google-btn').click();

    cy.get('@routerPush').should('be.calledWith', '/profile');
  });

  it('redirects to registration page when "Create Account" is clicked', () => {
    cy.contains('button', 'Create Account').click();
    cy.get('@routerPush').should('be.calledWith', '/registration');
  });
});