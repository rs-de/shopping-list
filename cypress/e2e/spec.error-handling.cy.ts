describe("User feedback", () => {
  it("If creation of shopping list fails due to rate limiting", () => {
    cy.intercept("POST", "/api", {
      statusCode: 429,
    });
    cy.visit("/");
    cy.contains("button", "New shopping list").click();
    cy.contains("There are too many");
  });

  it("If loading of shopping list fails", () => {
    [400, 500].forEach((statusCode) => {
      cy.intercept("GET", "/api/012345678901234567890000", {
        statusCode,
      });
      cy.visit("/012345678901234567890000");
      cy.contains("An error occurred");
    });
  });
});
