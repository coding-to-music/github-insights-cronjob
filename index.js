const mongoose = require("mongoose");
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')

require('dotenv').config();

const { getClones } = require("./controllers/clones");
const { getReferrers } = require("./controllers/referrers");
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

const jobs = [getClones, getReferrers, getViews];
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
  try {
    await runCronJob();
  } catch (error) {
    console.error(error.message);
  }
}

const scheduler = new ToadScheduler()

const task = new AsyncTask('simple task', () => main(), (error) => console.error(error.message));
const job = new SimpleIntervalJob({ days: 14, }, task)

scheduler.addSimpleIntervalJob(job)

// when stopping your app
// scheduler.stop()
