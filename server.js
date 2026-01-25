import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "mocks", "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Custom middleware for delay (2 seconds)
server.use((req, res, next) => {
  setTimeout(next, 2000);
});

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(
    `JSON Server is running with 2s delay on http://localhost:${PORT}`,
  );
});
