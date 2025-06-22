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

  it("Displays homeBox sections and navigation buttons", () => {
    cy.contains("h1", "Play the Movie Quiz!").should("be.visible");
    cy.contains("h1", "Top Players").should("be.visible");
    cy.contains("h1", "Your Profile").should("be.visible");
    cy.contains("h1", "Sign In to Play").should("be.visible");
    cy.contains("h1", "Follow Us").should("be.visible");
    cy.contains("button", "Play").should("exist");
    cy.contains("button", "View Rankings").should("exist");
    cy.contains("button", "Profile").should("exist");
    cy.contains("button", "Login").should("exist");
    cy.contains("Stay connected! Follow us on social media for updates, news, and more.").should("be.visible");
  });

  it("Checks social media links", () => {
    cy.get("a[href='https://www.facebook.com']").should("exist");
    cy.get("a[href='https://www.x.com']").should("exist");
    cy.get("a[href='https://www.instagram.com']").should("exist");
  });
});



