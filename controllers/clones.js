const Clone = require("../models/Clone");
const callOctokit = require("../utils/call-octokit")

exports.getClones = async (owner, repo) => {
  try {
    const clones = await callOctokit(
      "GET /repos/{owner}/{repo}/traffic/clones", 
      owner, 
      repo
    );

    if (clones.status === 200) {
      await Clone.create({name: repo, ...clones.data});
    }
  } catch (error) {
    console.error(error.message);
  }
}
