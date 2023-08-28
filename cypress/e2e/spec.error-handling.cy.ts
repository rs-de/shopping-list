describe("error handling", () => {
  it("shows error, if loading of shopping list fails", () => {
    [400, 500].forEach((statusCode) => {
      cy.intercept("GET", "/api/012345678901234567890000", {
        statusCode,
      });
      cy.visit("/012345678901234567890000");
      cy.contains("An error occurred");
    });
  });
});
