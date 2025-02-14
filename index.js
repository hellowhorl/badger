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
    `${core.getInput('api-host')}/v1/badger/process`,
    {
        data: badges
    }
  );

}

const run = () => {

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
    username: owner,
    workflow_run_id: process.env.GITHUB_RUN_ID,
    commit_hash: github.context.payload.commits[0].id,
    grading_output: badges
  }

  postBadgeData(badges);

}

run();
