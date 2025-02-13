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

const isBadgeOwned = async (check) => {

  // POST to badge data search
  let data = await axios.post(
    `${core.getInput('api_host')}/v1/badger/search`,
    {
      username: owner,
      //badge: 
    }
  );

  return Object.keys(data).length > 0;

}

const addBadgeData = async (check) => {

  // POST request to report results
  await axios.post(
    `${core.getInput('api_host')}/v1/badger/`,
    {
      user: owner,
      check: check
    }
  );

}

const updateBadgeData = async (check) => {

  // PATCH request to update badging data
  await axios.path(
    `${core.getInput('api_host')}/v1/badger/${owner}`,
    {
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
  );
  console.log(badges);

  // Discover whether user already has a badge
  /*for(let badge of badges) {
    if(isBadgeOwned(badge)) {
        
    }
  }*/
}

run();
