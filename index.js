const core = require('@actions/core');
const github = require('@actions/github');

const fs = require('fs');
const path = require('path');
const util = require('util');
const async = require('async');
const yaml = require('js-yaml');
const axios = require('axios');

const octokit = github.getOctokit(
  process.env.GITHUB_TOKEN
);

const owner = github.context.payload.repository.owner.login;

const postBadgeData = async (badges) => {

  // POST to badge data search
  let data = await axios.post(
    `${core.getInput('api-host')}/v1/badger/process/`,
    {
        data: badges
    }
  );

}

const getLatestAuthor = async () => {
  let info = await octokit.rest.repos.listCommits({
    owner: owner,
    repo: github.context.payload.repository.name,
    sha: process.env.GITHUB_REF_NAME
  });
  return info.data[0].author.login;
}

const run = async () => {

  // Collect results from gatorgrader run
  let outcome = JSON.parse(
    fs.readFileSync(
      core.getInput('grader-report'),
      "utf-8"
    )
  );

  // Filter only the checks with badges
  let badges = outcome.checks.filter(
    (check) => check.badges && check.status === true
  ).map(
    (check) => check.badges
  ).reduce(
    (badge)=>{badge}
  );

  badges = {
    repository_name: github.context.payload.repository.name,
    username: await getLatestAuthor(),
    workflow_run_id: process.env.GITHUB_RUN_ID,
    commit_hash: github.context.payload.commits[0].id,
    grading_output: badges
  }

  postBadgeData(badges);

}

run();
