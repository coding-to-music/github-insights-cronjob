const Fork = require("../models/Fork");
const callOctokit = require("../utils/call-octokit");
const isLastDay = require("../utils/is-last-day");

exports.getForks = async (owner, repo) => {
  try {
    const { status, data } = await callOctokit(
      "GET /repos/{owner}/{repo}/forks_count",
      owner,
      repo
    );

    if (status === 200) {
      const { forks } = data;
      const latestData = forks[forks.length - 1];
      const shouldUpdate = isLastDay(latestData.timestamp);
      if (shouldUpdate) {
        await Fork.create({ name: repo, ...latestData });
        console.log("getForks: ", repo);
      }
    } else {
      throw new Error("Error fetching forks: ", status);
    }
  } catch (error) {
    console.error(error.message);
  }
};
