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

      const doc = await View.findOneAndUpdate(
        { name: repo },
        { $set: { ...latestData } },
        { upsert: true, new: true }
      );
      console.log("getViews: doc: %s", doc);
    } else {
      throw new Error("Error fetching views: ", status);
    }
  } catch (error) {
    // console.error(error.message);
    console.log("getViews: ", error.message, repo);
  }
};
