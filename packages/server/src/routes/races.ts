import express, { Request, Response } from "express";
import { RaceResult } from "../models/race-results";

import raceService from "../services/race-results-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
        raceService.index()
            .then((list) => res.json(list))
            .catch((err) => res.status(500).send(err));
});
    
router.get("/:raceId", (req: Request, res: Response) => {
    const { raceId } = req.params;

    raceService.get(raceId)
    .then((raceResult) => {
        if (raceResult) {
            res.json(raceResult);
        } else {
            res.status(404).send("Race not found");
        }
    })
    .catch((err) => res.status(500).send(err));
});

router.post("/", (req: Request, res: Response) => {
    const newRace = req.body;
    
    raceService.create(newRace)
        .then((race: RaceResult) =>
            res.status(201).json(race)
        )
        .catch((err) => res.status(500).send(err));
});

router.put("/:raceid", (req: Request, res: Response) => {
    const { raceid } = req.params;
    const newRace = req.body;
  
    raceService
      .update(raceid, newRace)
      .then((race: RaceResult) => res.json(race))
      .catch((err) => res.status(404).end());
});

router.delete("/:raceid", (req: Request, res: Response) => {
    const { raceid } = req.params;

    console.log(`Received delete request for raceId: ${raceid}`);
  
    raceService.remove(raceid)
      .then(() => res.status(204).end())
      .catch((err) => res.status(404).send(err));
});

router.get('/:raceId/individual-results', (req: Request, res: Response) => {
    const { raceId } = req.params;
  
    raceService.getIndividualResults(raceId)
      .then((results) => res.json(results))
      .catch((err) => {
        console.error(err);
        res.status(404).send(`Individual results for race ${raceId} not found`);
    });
});

router.get('/:raceId/team-results', (req: Request, res: Response) => {
    const { raceId } = req.params;
  
    raceService.getTeamResults(raceId)
      .then((results) => res.json(results))
      .catch((err) => {
        console.error(err);
        res.status(404).send(`Team results for race ${raceId} not found`);
    });
});

router.get('/:raceId/individual-results/:athleteId', (req: Request, res: Response) => {
    const { raceId } = req.params;
    const athleteId = parseInt(req.params.athleteId, 10);
  
    raceService.getIndividualResult(raceId, athleteId)
      .then((results) => res.json(results))
      .catch((err) => {
        console.error(err);
        res.status(404).send(`Individual results for race ${raceId} not found`);
    });
});

router.get('/:raceId/team-results/:teamId', (req: Request, res: Response) => {
    const { raceId } = req.params;
    const teamId = parseInt(req.params.teamId, 10);
  
    raceService.getTeamResult(raceId, teamId)
      .then((results) => res.json(results))
      .catch((err) => {
        console.error(err);
        res.status(404).send(`Team results for race ${raceId} not found`);
    });
});


export default router;