# github-insights-cronjob

# 🚀 Node cron job 🚀

https://github.com/coding-to-music/github-insights-cronjob

by SoftMaple https://github.com/softmaple

https://github.com/softmaple/insights-cronjob

```java
MONGO_URI=
OCTOKIT_TOKEN=
```

## GitHub

```java
git init
git add .
git remote remove origin
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:coding-to-music/github-insights-cronjob.git
git push -u origin main
```

# insights-cronjob

[![cron](https://github.com/SoftMaple/insights-cronjob/actions/workflows/main.yml/badge.svg)](https://github.com/SoftMaple/insights-cronjob/actions/workflows/main.yml)

![Disabled Github Actions](https://ik.imagekit.io/1winv85cn8g/SoftMaple/CRON/disable-github-action_geKFGNyx9.png)
Using [MongoDB Atlas triggers](https://docs.atlas.mongodb.com/triggers) instead.

[API documentation](https://docs.github.com/en/rest/reference/repository-metrics#traffic)

cron job using github actions.

Before start, run `cp .env.local.example .env`.

## Example of how data is retrieved

views.js

```
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
      console.log("getViews: data %s ", data);
      const { views } = data;
      console.log("getViews: views %s ", views);
      const latestData = views[views.length - 1];
      console.log("getViews: latestData %s ", latestData);

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
```

```
npm run start
```

Output:

```
> github-insights-cronjob@1.0.0 start
> node index.js

Connecting to MongoDB...
Connected to MongoDB
------- started -------
getViews: repo sass-mern-image-uploader
getViews: data { count: 12, uniques: 1, views: [Array] }
getViews: views [ [Object] ]
getViews: latestData { timestamp: '2022-10-06T00:00:00Z', count: 12, uniques: 1 }
getViews: doc: {
  _id: new ObjectId("634dbb70fda60bcbb8023215"),
  name: 'sass-mern-image-uploader',
  __v: 0,
  count: 12,
  createdAt: 2022-10-17T20:30:40.331Z,
  timestamp: '2022-10-06T00:00:00Z',
  uniques: 1,
  updatedAt: 2022-10-17T20:53:57.753Z
}
------- stopped -------
Disconnected from MongoDB
```

## Example queries for the GitHub API

Shell

```java
curl \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/traffic/clones

curl \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/coding-to-music/coding-to-music/traffic/clones
```

GitHub CLI

```java
gh api \
  -H "Accept: application/vnd.github.v3+json" \
  /repos/OWNER/REPO/traffic/clones

gh api \
  -H "Accept: application/vnd.github.v3+json" \
  /repos/coding-to-music/coding-to-music/traffic/clones

gh api \
  -H "Accept: application/vnd.github.v3+json" \
  /repos/coding-to-music/coding-to-music/traffic/views
```

## Get a repository

https://docs.github.com/en/rest/repos/repos#get-a-repository

```
curl \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  https://api.github.com/repos/OWNER/REPO
```

## Deploying to Render

This plugin will extract info from Heroku and put it into a Docker file.

```java
heroku plugins:install @renderinc/heroku-import
```

Output:

```java
warning ../../../package.json: No license field
warning ../../../../../../package.json: No license field
warning "eslint-config-oclif > eslint-config-xo-space@0.27.0" has incorrect peer dependency "eslint@>=7.20.0".
warning "eslint-config-oclif > eslint-plugin-mocha@9.0.0" has incorrect peer dependency "eslint@>=7.0.0".
warning "eslint-config-oclif > eslint-plugin-unicorn@36.0.0" has incorrect peer dependency "eslint@>=7.32.0".
warning "eslint-config-oclif > eslint-config-xo-space > eslint-config-xo@0.35.0" has incorrect peer dependency "eslint@>=7.20.0".
warning "eslint-config-oclif > eslint-plugin-unicorn > eslint-template-visitor@2.3.2" has incorrect peer dependency "eslint@>=7.0.0".
warning "eslint-config-oclif > eslint-plugin-unicorn > eslint-template-visitor > @babel/eslint-parser@7.16.3" has incorrect peer dependency "eslint@^7.5.0 || ^8.0.0".
Installing plugin @renderinc/heroku-import... installed v1.1.0
```

```java
heroku render:import --app github-insights-cronjob
```

Output:

```java

=== Gathering information about Heroku app
Verifying Heroku app exists and CLI is logged in... ✔️
Verifying app is using a single, official Heroku buildpack... ✔️
Getting stack image... heroku-20
Getting and translating plan... Heroku Free $0/mo --> Render Free $0/mo
Getting instance count... 1
Getting custom domains... 0 custom domain(s)
Getting environment variables... 2 environment variable(s)
Getting add-ons... 0 add-on(s)

? Select addons to import.

Create render.yaml file and Dockerfile.render? This will overwrite any existing files with the same name. (y/n): y
Generating render.yaml file... done
Generating Dockerfile.render... done

=== Environment variables excluded from render.yaml
The following environment variables were not included in the generated
  render.yaml file because they potentially contain secrets. You may need to
  manually add them to your service in the Render Dashboard.

- JWT_SECRET:

=== Follow these steps to complete import of service(s) and database(s) to Render
1. Add, commit, and push the generated render.yaml and Dockerfile.render to GitHub or GitLab.
2. Go to https://dashboard.render.com/select-repo?type=iac
3. Search for and select this repository.
4. Verify the plan showing the resources that Render will create, and
   then click 'Create New Resources'.
5. After the resources are deployed, you may need to manually add
   the above environment variables to your Web Service in the Render Dashboard.
   They were not included in the generated render.yaml because they potentially
   contain secrets.
```

## GitHub

```java
git init
git add .
git remote remove origin
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:coding-to-music/github-insights-cronjob.git
git push -u origin main
```

## Heroku

```java
heroku create github-insights-cronjob
```

## Heroku MongoDB Environment Variables

```java
heroku config:set

heroku config:set JWT_SECRET="secret"

heroku config:set PUBLIC_URL="https://github-insights-cronjob.herokuapp.com"

```

## Push to Heroku

```java
git push heroku

# or

npm run deploy
```
