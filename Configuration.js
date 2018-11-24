const Substitutioner = require('./Substitutioner');

const requestParameter = {
    'group': 'hpi-swt2',                        // name of the orga the repo is part of
    'repository': 'vm-portal',                  // name of the repository
    'maxRequestedIssueNumber': 200,             // max number of overall fetched issues
    'issueFilterLabel': 'team scaffold'         // the string of a label, that is applied to relevent issues (Rest gets ignored)
};

const substitutioner = new Substitutioner();

substitutioner.addRule(/- \[ \]/g, '\\item ');
substitutioner.addRule(/- \[x\]/g, '\\item ');
substitutioner.addRule(/#/g, '\\#');
substitutioner.addRule(/!\[.*\]\(.*\)/g, '');
substitutioner.addRule(/\*{0,2}Akzeptanzkriterien:?\*{0,2}/gi, '\\subsection{Akzeptanzkriterien:} \\begin{todolist}');
substitutioner.addRule(/\*{0,2}Beschreibung:?\*{0,2}/gi, '\\subsection{Beschreibung:} ');
substitutioner.addRule(/\*{0,2}Priorität:?\*{0,2}/g, '\\end{todolist} \\subsection{Priorität:}');
substitutioner.addRule(/\*{0,2}Aufwandsschätzung:?\*{0,2}/g, '\\subsection{Aufwandsschätzung:}');

module.exports = {requestParameter, substitutioner};