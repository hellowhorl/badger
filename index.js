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

const makeAPICall = (checks) => {
  // POST request to report results
  axios.post(
    `${core.getInput('api_host')}/v1/badger/`,
    {
      owner: owner,
      checks: checks
    }
  ).then(
    (response) => {
      return console.log(response);
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
  let checks = JSON.stringify(
    outcome.checks.filter(
      (check) => check.badges
    )
  );

}

run();
