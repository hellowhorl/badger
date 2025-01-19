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

const run = () => {

}

run();
