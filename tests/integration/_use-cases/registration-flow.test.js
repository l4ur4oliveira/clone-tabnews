import activation from "models/activation.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow (all successful)", () => {
  let createUserResponseBody;

  test("Create user account", async () => {
    const createUserResponse = await fetch(
      "http://localhost:3000/api/v1/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "RegristrationFlow",
          email: "regristration.flow@test.com",
          password: "RegristrationFlowPassword",
        }),
      },
    );

    expect(createUserResponse.status).toBe(201);

    createUserResponseBody = await createUserResponse.json();

    expect(createUserResponseBody).toEqual({
      id: createUserResponseBody.id,
      username: "RegristrationFlow",
      email: "regristration.flow@test.com",
      features: ["read:activation_token"],
      password: createUserResponseBody.password,
      created_at: createUserResponseBody.created_at,
      updated_at: createUserResponseBody.updated_at,
    });
  });

  test("Receive activation email", async () => {
    const lastEmail = await orchestrator.getLastEmail();

    const activationToken = await activation.findOneByUserId(
      createUserResponseBody.id,
    );

    expect(lastEmail.sender).toBe("<contato@test.com>");
    expect(lastEmail.recipients[0]).toBe("<regristration.flow@test.com>");
    expect(lastEmail.subject).toBe("Activate your registration!");
    expect(lastEmail.text).toContain("RegristrationFlow");
    expect(lastEmail.text).toContain(activationToken.id);
  });

  test("Activate account", () => {});

  test("Login", () => {});

  test("Get user information", () => {});
});
