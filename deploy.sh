#!/bin/bash

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
    TRAVIS_COMMIT_RANGE="FETCH_HEAD...$TRAVIS_BRANCH"
else
    echo "Not going to deploy, as we're in a PR"
    exit 0
fi

openssl aes-256-cbc -K $encrypted_b13950a340e6_key -iv $encrypted_b13950a340e6_iv -in id_rsa.enc -out /tmp/id_rsa -d

git diff --name-only $TRAVIS_COMMIT_RANGE | grep -qvE '(^(calendars))/' || {
    echo "Only calendar was updated, stopping build process."
    exit
}

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Clone the existing gh-pages for this repo into out/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deply)
git clone $REPO out
cd out
git checkout master

## Perform the actual updates
yarn install
node src/index.js

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
if git diff --quiet; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add -A .
git commit -m "Automated updates to the calendar feed"

chmod 600 /tmp/id_rsa
eval `ssh-agent -s`
ssh-add /tmp/id_rsa

git push $SSH_REPO master
