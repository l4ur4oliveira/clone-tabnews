import orchestrator from "tests/orchestrator.js";
import email from "infra/email.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.deleteAllEmails();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await email.send({
      from: "DevTest <contato@oliveilaura.com.br>",
      to: "me@oliveilaura.com.br",
      subject: "Test shot",
      text: "Email test's body.",
    });

    await email.send({
      from: "DevTest <contato@oliveilaura.com.br>",
      to: "me@oliveilaura.com.br",
      subject: "Last shot",
      text: "Last email test's body.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contato@oliveilaura.com.br>");
    expect(lastEmail.recipients[0]).toBe("<me@oliveilaura.com.br>");
    expect(lastEmail.subject).toBe("Last shot");
    expect(lastEmail.text).toBe("Last email test's body.\n");
  });
});
