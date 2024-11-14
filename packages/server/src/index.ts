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
import { getRaceResult } from "./services/race-results-svc";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = path.join(__dirname, "../../proto");

app.use(express.static(staticDir));

// Define the route handler using the correct type
app.get("/race/:raceId", (req: Request, res: Response): void => {
    const { raceId } = req.params;
    const raceData = getRaceResult(raceId);
  
    if (!raceData) {
      res.status(404).send("Race not found");
      return;
    }
  
    const page = new RaceResultPage(raceData);
    res.set("Content-Type", "text/html").send(page.render());
});
  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});