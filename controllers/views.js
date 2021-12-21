const View = require("../models/View");
const callOctokit = require("../utils/call-octokit")

exports.getViews = async (owner, repo) => {
  try {
    const views = await callOctokit(
      "GET /repos/{owner}/{repo}/traffic/views", 
      owner, 
      repo
    );

    if (views.status === 200) {
      await View.create({name: repo, ...views.data});
    }
  } catch (error) {
    console.error(error.message);
  }
}
