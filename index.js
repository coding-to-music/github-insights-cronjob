const mongoose = require("mongoose");

require('dotenv').config();

const { getClones } = require("./controllers/clones");
const { getViews } = require("./controllers/views");

const uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error.message);    
  }
}

const jobs = [ getClones, getViews ];
const repos = [
  { owner: "zhyd1997", repo: "Eorg" },
  { owner: "SoftMaple", repo: "docs" },
  { owner: "SoftMaple", repo: "Editor" },
]

const runCronJob = async () => {
  try {
    await connectDB();
    await Promise.all(jobs.map(job => repos.map(({ owner, repo }) => job(owner, repo))));
  } catch (error) {
    console.error(error.message);
  }
}

async function main() {
  // 30s
  const ms = 30 * 1000;

  try {
    await runCronJob();
    // stop cron job
    setTimeout(() => {
      mongoose.disconnect();
    }, ms);
  } catch (error) {
    console.error(error.message);
  }
}

main();
