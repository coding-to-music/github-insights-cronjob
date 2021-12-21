const Referrer = require("../models/Referrer");
const callOctokit = require("../utils/call-octokit")

exports.getReferrers = async (owner, repo) => {
  try {
    const { status, data } = await callOctokit(
      "GET /repos/{owner}/{repo}/traffic/popular/referrers",
      owner,
      repo
    );

    if (status === 200) {
      await Referrer.create({ name: repo, referrers: data });
    }
  } catch (error) {
    console.error(error.message);
  }
}
