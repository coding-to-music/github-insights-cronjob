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

      console.log("getStars: ", stars, latestData);

      const doc = await Star.findOneAndUpdate(
        { name: repo },
        { $set: { ...latestData } },
        { upsert: true, new: true }
      );
      console.log("getStars: doc: %s", doc);
    } else {
      throw new Error("Error fetching stars: ", status);
    }
  } catch (error) {
    // console.error(error.message);
    console.log("getStars: ", error.message, repo);
  }
};
