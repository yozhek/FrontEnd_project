import Home from '../pages/Home.vue';

describe('Home Page', () => {
  beforeEach(() => {
    cy.mount(Home);
  });

  it('Displays main description and feature list', () => {
    cy.get('.home-description')
      .should('contain', 'MovieGuess is the ultimate challenge for movie lovers!');
    cy.get('.features-list')
      .should('be.visible')
      .within(() => {
        cy.contains("Explore screenshots from iconic and obscure films");
        cy.contains("Climb the Leaderboard by earning points with correct answers");
        cy.contains("Track your progress and stats in your personal Profile");
        cy.contains("Log in to compete with friends and movie buffs around the world");
        cy.contains("Stay connected — follow us on social media for updates and challenges");
      });
  });

  it("Displays homeBox sections, descriptions and navigation buttons", () => {
    cy.contains("h1", "Play the Movie Quiz!").should("be.visible");
    cy.contains("h1", "Top Players").should("be.visible");
    cy.contains("h1", "Your Profile").should("be.visible");
    cy.contains("h1", "Sign In to Play").should("be.visible");
    cy.contains("h1", "Follow Us").should("be.visible");
    cy.contains("button", "Play").should("exist");
    cy.contains("button", "View Rankings").should("exist");
    cy.contains("button", "Profile").should("exist");
    cy.contains("button", "Login").should("exist");
    cy.contains("Guess the movie from a single frame. Test your film knowledge and challenge yourself!").should('be.visible');
    cy.contains("See who scored the most points. Compete with others and climb to the top of the leaderboard!").should('be.visible');
    cy.contains("Check your stats, track your progress, and personalize your experience.").should('be.visible');
    cy.contains("Log in to save your scores, track your performance, and join the leaderboard.").should('be.visible');
    cy.contains("Stay connected! Follow us on social media for updates, news, and more.").should('be.visible');
  });

  it('Checks social media links: href, target, rel', () => {
    const socialLinks = [
      { href: 'https://www.facebook.com' },
      { href: 'https://www.x.com' },
      { href: 'https://www.instagram.com' },
    ];
    socialLinks.forEach(({ href }) => {
      cy.get(`a[href='${href}']`)
        .should('exist')
        .and('have.attr', 'target', '_blank')
        .and('have.attr', 'rel', 'noopener noreferrer');
    });
  });

  // Навигация по кнопкам (корректно для компонентных тестов)
  it('Navigation buttons are inside RouterLink with correct "to" prop', () => {
    cy.contains('button', 'Play').parent().should('have.attr', 'to', '/game');
    cy.contains('button', 'View Rankings').parent().should('have.attr', 'to', '/leaderboard');
    cy.contains('button', 'Profile').parent().should('have.attr', 'to', '/profile');
    cy.contains('button', 'Login').parent().should('have.attr', 'to', '/login');
  });
});



