import database from "infra/database";
import { InternalServerError } from "infra/errors";

async function status(req, res) {
  try {
    const updatedAt = new Date().toISOString();

    const dbVersionResult = await database.query("SHOW server_version;");
    const dbVersionValue = dbVersionResult.rows[0].server_version;

    const dbMaxConnectionsResult = await database.query(
      "SHOW max_connections;",
    );
    const dbMaxConnectionsValue =
      dbMaxConnectionsResult.rows[0].max_connections;

    const dbName = process.env.POSTGRES_DB;
    const dbOpenedConnectionsResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [dbName],
    });
    const dbOpenedConnectionsValue = dbOpenedConnectionsResult.rows[0].count;

    res.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          max_connections: parseInt(dbMaxConnectionsValue),
          opened_connections: dbOpenedConnectionsValue,
          version: dbVersionValue,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log("\nErro dentro do catch do controller...");
    console.error(publicErrorObject);

    res.status(500).json(publicErrorObject);
  }
}

export default status;
