const spawn = require("child_process").spawn;
const schedule = require("node-schedule");

schedule.scheduleJob("0 0 6 * * ?", () => {
  console.log("Launching patagooch scraper.\n");
  spawn("node", ["index.js"]);
});
