const core = require('@actions/core');
const github = require('@actions/github');

const fs = require('fs');
const path = require('path');
const util = require('util');
const async = require('async');
const yaml = require('js-yaml');

const octokit = github.getOctokit(
  process.env.GITHUB_TOKEN
);

const makeAPICall = (checks) => {

  

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
  let checks = JSON.stringify(
    outcome.checks.filter(
      (check) => check.badges
    )
  );

}

run();
