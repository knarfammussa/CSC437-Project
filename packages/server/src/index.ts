// import express, { Request, Response } from "express";

// const app = express();
// const port = process.env.PORT || 3000;
// const staticDir = process.env.STATIC || "public";

// app.use(express.static(staticDir));

// app.get("/hello", (req: Request, res: Response) => {
//     res.send("Hello, World");
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

import express, { Request, Response, RequestHandler } from "express";
import path from "path";
import { RaceResultPage } from "./pages/race-results";
import raceService from "./services/race-results-svc";
import { connect } from "./services/mongo";
import races from "./routes/races"
import auth, { authenticateUser } from "./routes/auth";
import { LoginPage } from "./pages/auth";
import fs from "node:fs/promises";

connect("racing");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || path.join(__dirname, "../../app/dist");

app.use(express.static(staticDir));

app.use(express.json());

app.use("/api/races", races);

app.use("/auth", auth);

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

// Define the route handler using the correct type
app.get("/race/:raceId", (req: Request, res: Response): void => {
    const { raceId } = req.params;
    raceService.get(raceId).then((raceData) => {
      if (!raceData) {
        res.status(404).send("Race not found");
        return;
      }
      const page = new RaceResultPage(raceData);

      res.set("Content-Type", "text/html").send(page.render());
    }).catch((err) => {
      res.status(500).send(`Error fetching race result: ${err.message}`);
    });
});

app.get("/login", (req: Request, res: Response) => {
  const page = new LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});

app.listen(port, () => {
    console.log(`Server is running and serving files from ${staticDir}`);
    console.log(`Server is running on http://localhost:${port}`);
});