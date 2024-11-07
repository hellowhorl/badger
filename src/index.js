// src/index.js
const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const yaml = require('js-yaml');

async function run() {
  try {
    // Get the GitHub context
    const context = github.context;
    const userName = context.actor;

    // Read gatorgrade.yml file
    const gatorgradeFile = core.getInput('gatorgrade-file');
    const fileContent = fs.readFileSync(gatorgradeFile, 'utf8');
    const gatorgradeData = yaml.load(fileContent);

    // Process badges from gatorgrade checks
    const badges = await processBadges(gatorgradeData);
    
    // Log for debugging
    console.log('Processing badges for:', userName);
    console.log('Found badges:', badges);

    // Set output for GitHub Actions
    core.setOutput('badges', JSON.stringify(badges));
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function processBadges(checks) {
  const badges = [];
  
  // Process each check in the gatorgrade file
  checks.forEach(check => {
    if (check.badge) {
      const badge = {
        id: check.badge.name.toLowerCase().replace(/\s+/g, '-'),
        name: check.badge.name,
        description: check.badge.description,
        category: check.badge.category,
        checkType: check.check,
        achieved: true, // For testing - will be based on actual check results later
        imageUrl: generateBadgeUrl(check.badge)
      };
      badges.push(badge);
    }
  });
  
  return badges;
}

function generateBadgeUrl(badge) {
  const label = encodeURIComponent(badge.name.replace(/\s+/g, '_'));
  const message = encodeURIComponent('achieved');
  const color = 'success';
  
  return `https://img.shields.io/badge/${label}-${message}-${color}`;
}

run();