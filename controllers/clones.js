const Clone = require("../models/Clone");
const callOctokit = require("../utils/call-octokit");
const isLastDay = require("../utils/is-last-day");

exports.getClones = async (owner, repo) => {
  try {
    const { status, data } = await callOctokit(
      "GET /repos/{owner}/{repo}/traffic/clones", 
      owner, 
      repo
    );

    if (status === 200) {
      const { clones } = data;
      const latestData = clones[clones.length - 1];
      const shouldUpdate = isLastDay(latestData.timestamp);
      if (shouldUpdate) {
        await Clone.create({ name: repo, ...latestData });
        console.log("getClones: ", repo);
      }
    } else {
      throw new Error("Error fetching clones: ", status);
    }
  } catch (error) {
    console.error(error.message);
  }
}
