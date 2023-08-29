describe("User interface ", () => {
  it("Shows message, if creation of shopping list failed due to rate limiting", () => {
    cy.intercept("POST", "/api", {
      statusCode: 429,
    });
    cy.visit("/");
    cy.contains("button", "New shopping list").click();
    cy.contains("There are too many");
  });
  it("Shows message, if creation of shopping list failed dut to unknown error", () => {
    [400, 500].forEach((statusCode) => {
      cy.intercept("POST", "/api", {
        statusCode,
      });
      cy.visit("/");
      cy.contains("button", "New shopping list").click();
      cy.contains("An error occurred");
    });
  });

  it("Shows message, if loading of shopping list failed", () => {
    [400, 500].forEach((statusCode) => {
      cy.intercept("GET", "/api/012345678901234567890000", {
        statusCode,
      });
      cy.visit("/012345678901234567890000");
      cy.contains("An error occurred");
    });
  });

  it("Shows message, if add, delete or change an article failed", () => {
    [400, 500].forEach((statusCode) => {
      cy.intercept("GET", "/api/012345678901234567890000", {
        statusCode: 200,
        body: { articles: [], _id: "012345678901234567890000" },
      });
      cy.intercept("PATCH", "/api/012345678901234567890000", {
        statusCode,
      });
      cy.visit("/012345678901234567890000");
      cy.get("input[name=new]").type("Milk{enter}");
      cy.contains("An error occurred");
    });
  });
});
