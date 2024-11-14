"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_path = __toESM(require("path"));
var import_race_results = require("./pages/race-results");
var import_race_results_svc = require("./services/race-results-svc");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = import_path.default.join(__dirname, "../../proto");
app.use(import_express.default.static(staticDir));
app.get("/race/:raceId", (req, res) => {
  const { raceId } = req.params;
  const raceData = (0, import_race_results_svc.getRaceResult)(raceId);
  if (!raceData) {
    res.status(404).send("Race not found");
    return;
  }
  const page = new import_race_results.RaceResultPage(raceData);
  res.set("Content-Type", "text/html").send(page.render());
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
