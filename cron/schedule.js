const spawn = require("child_process").spawn;
const schedule = require("node-schedule");

// run at 6am daily
schedule.scheduleJob("0 0 6 * * ?", () => {
  console.log("Launching patagooch scraper.\n");

  spawn("node", ["index.js"]);
});
