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

    console.log("getViews: repo %s", repo);

    if (status === 200) {
      const { views } = data;
      const latestData = views[views.length - 1];
      console.log("getViews: latestData %s ", latestData);
      const shouldUpdate = isLastDay(latestData.timestamp);
      console.log(
        "getViews: latestData %s shouldUpdate %s",
        latestData,
        shouldUpdate
      );
      if (shouldUpdate) {
        await View.create({ name: repo, ...latestData });
        console.log("getViews: View.create: ", repo);
      }
    } else {
      throw new Error("Error fetching views: ", status);
    }
  } catch (error) {
    // console.error(error.message);
    console.log("getViews: ", error.message, repo);
  }
};
