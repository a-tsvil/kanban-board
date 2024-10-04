import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import column from "./controllers/column.mjs";
import card from "./controllers/card.mjs";

const app = express();

console.log(process.env);

app.use(cors());
app.use(bodyParser.json());

app.use("/api/column", column);
app.use("/api/card", card);

app.listen(8000, (err) => {
  if (err) console.error(err);
  else console.log("kanban_board api started");
});
