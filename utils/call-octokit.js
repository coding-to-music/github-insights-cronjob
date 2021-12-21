require('dotenv').config();
const { Octokit } = require("@octokit/core");

const callOctokit = async (route, owner, repo) => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  return await octokit.request(route, { owner, repo });
}

module.exports = callOctokit;
