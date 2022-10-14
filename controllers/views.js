const View = require("../models/View");
const callOctokit = require("../utils/call-octokit");
const isLastDay = require("../utils/is-last-day");

exports.getViews = async (owner, repo) => {
  try {
    const { status, data } = await callOctokit(
      "GET /repos/{owner}/{repo}/traffic/views",
      owner,
      repo
    );

    if (status === 200) {
      const { views } = data;
      const latestData = views[views.length - 1];
      const shouldUpdate = isLastDay(latestData.timestamp);
      if (shouldUpdate) {
        await View.create({ name: repo, ...latestData });
        console.log("getViews: ", repo);
      }
    } else {
      throw new Error("Error fetching views: ", status);
    }
  } catch (error) {
    // console.error(error.message);
    console.log("getViews: ", error.message, repo);
  }
};
