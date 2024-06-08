const { exec } = require("node:child_process");
function checkPostgres() {
  exec("docker exec postgres-dev pg_isready -h localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    process.stdout.write("\n🟢 Postgres is ready!\n");
  }
}

process.stdout.write("\n🔴 Waiting for Postgres to be ready...");
checkPostgres();
