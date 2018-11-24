const config = {
    'group': 'hpi-swt2',                        // name of the orga the repo is part of
    'repository': 'vm-portal',                  // name of the repository
    'maxRequestedIssueNumber': 200,             // max number of overall fetched issues
    'issueFilterLabel': 'team scaffold'         // the string of a label, that is applied to relevent issues (Rest gets ignored)
};

module.exports = config;