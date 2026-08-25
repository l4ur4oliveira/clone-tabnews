import database from "infra/database.js";
import email from "infra/email.js";
import { NotFoundError } from "infra/errors.js";
import webServer from "infra/webserver.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 minutes

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId, expiresAt) {
    const results = await database.query({
      text: `
        INSERT INTO
          user_activation_tokens (user_id, expires_at)
        VALUES
          ($1, $2)
        RETURNING
          *
        ;`,
      values: [userId, expiresAt],
    });

    return results.rows[0];
  }
}

async function findOneValidById(tokenId) {
  const activationTokenObject = await runSelectQuery(tokenId);
  return activationTokenObject;

  async function runSelectQuery(tokenId) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          user_activation_tokens
        WHERE
          id = $1
          AND used_at IS NULL
          AND expires_at > NOW()
        LIMIT
          1
      ;`,
      values: [tokenId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Activation token was not found or is expired.",
        action: "Please, register again.",
      });
    }

    return results.rows[0];
  }
}

async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "DevTest <contato@test.com>",
    to: user.email,
    subject: "Activate your registration!",
    text: `${user.username}, click the link below to activate your registration.

${webServer.origin}/registration/activate/${activationToken.id}

Best regards,
Test Team.`,
  });
}

const activation = {
  create,
  findOneValidById,
  sendEmailToUser,
};

export default activation;
