const Fork = require("../models/Fork");
const callOctokit = require("../utils/call-octokit");
const isLastDay = require("../utils/is-last-day");

exports.getForks = async (owner, repo) => {
  try {
    const { status, data } = await callOctokit(
      "GET /repos/{owner}/{repo}",
      owner,
      repo
    );

    if (status === 200) {
      // console.log("getForks: status %s", status);

      // console.log("getForks: data %s", data);

      const { forks_count } = data;
      console.log("getForks: forks_count %s", forks_count);

      // const latestData = forks[forks.length - 1];

      // console.log("getForks: ", forks, latestData);

      const doc = await Fork.findOneAndUpdate(
        { name: repo },
        { $set: { ...forks_count } },
        { upsert: true, new: true }
      );
      console.log("getForks: doc: %s", doc);
    } else {
      throw new Error("Error fetching forks: ", status);
    }
  } catch (error) {
    // console.error(error.message);
    console.log("getForks: ", error.message, repo);
  }
};
