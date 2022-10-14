const mongoose = require("mongoose");

require("dotenv").config();

const { getClones } = require("./controllers/clones");
const { getViews } = require("./controllers/views");

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error.message);
  }
};

const jobs = [getClones, getViews];
const repos = [
  { owner: "coding-to-music", repo: "nestjs-prisma-multi-database" },
  {
    owner: "coding-to-music",
    repo: "grafana-nginx-prometheus-postgres-node-exporter-jmx-cadvisor",
  },
  {
    owner: "coding-to-music",
    repo: "tempo-otel-open-telemetry-loki-prometheus-grafana",
  },
  {
    owner: "coding-to-music",
    repo: "docker-flask-mongodb-k8-grafana-mqtt-fastapi",
  },
  { owner: "coding-to-music", repo: "k6-influxdb-grafana-docker-load-testing" },
  { owner: "coding-to-music", repo: "postgres-postgrest-cloudflare-docker" },
  { owner: "coding-to-music", repo: "facebook-firebase-next-chat" },
  { owner: "coding-to-music", repo: "chalice-workshop" },
  { owner: "coding-to-music", repo: "mongoose-mongodb-upload-images" },
  { owner: "coding-to-music", repo: "nuxt-supabase-full-multi-user-blog" },
  { owner: "coding-to-music", repo: "battlecode2021" },
  { owner: "coding-to-music", repo: "coding-to-music" },
  { owner: "coding-to-music", repo: "sass-mern-image-uploader" },
  { owner: "coding-to-music", repo: "coding-to-music.github.io" },
];

const runCronJob = async () => {
  try {
    await connectDB();
    console.log("------- started -------");
    await Promise.all(
      jobs.map((job) => repos.map(({ owner, repo }) => job(owner, repo)))
    );
  } catch (error) {
    console.error(error.message);
  }
};

async function main() {
  // 30s
  const ms = 30 * 1000;

  try {
    await runCronJob();
    // stop cron job
    setTimeout(async () => {
      console.log("------- stopped -------");
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }, ms);
  } catch (error) {
    console.error(error.message);
  }
}

main();
