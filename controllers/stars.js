const Star = require("../models/Star");
const callOctokit = require("../utils/call-octokit");
const isLastDay = require("../utils/is-last-day");

exports.getStars = async (owner, repo) => {
  try {
    const { status, data } = await callOctokit(
      "GET /repos/{owner}/{repo}/stargazers_count",
      owner,
      repo
    );

    if (status === 200) {
      const { stars } = data;
      const latestData = stars[stars.length - 1];
      const shouldUpdate = isLastDay(latestData.timestamp);
      if (shouldUpdate) {
        await Star.create({ name: repo, ...latestData });
        console.log("getStars: ", repo);
      }
    } else {
      throw new Error("Error fetching stars: ", status);
    }
  } catch (error) {
    console.error(error.message);
  }
};
