const Substitutioner = require('./Substitutioner');
const substitutioner = new Substitutioner();

// Configuration of the request parameters that get send to github
// The predefined settings are for: https://github.com/hpi-swt2/vm-portal

const requestParameter = {
    'group': 'hpi-swt2',                        // name of the orga the repo is part of
    'repository': 'vm-portal',                  // name of the repository
    'maxRequestedIssueNumber': 200,             // max number of overall fetched issues
    'issueFilterLabel': 'team scaffold'         // the string of a label, that is applied to relevent issues (Rest gets ignored)
};

/********************************************************************************/
/**
 * Here are the changes of the issue text to final text in the tex file defined
 * The addRule method takes a regex and a string
 */

// enables usage of # in the issue text, because it is a special character in markdown
substitutioner.addRule(/#/g, '\\#');

// ignores github links
substitutioner.addRule(/!\[.*\]\(.*\)/g, '');

// Starts the description of the issue and makes 'Beschreibung:' a header
substitutioner.addRule(/\*{0,2}Beschreibung:?\*{0,2}/gi, '\\subsection{Beschreibung:} ');

// Starts the description of the acceptance criterias, makes 'Akzeptanzkriterien:' a header
// and starts a todolist in order to prefix the individual cirteriad with a checkbox
substitutioner.addRule(/\*{0,2}Akzeptanzkriterien:?\*{0,2}/gi, '\\subsection{Akzeptanzkriterien:} \\begin{todolist}');

// parse normal items/checkboxes
substitutioner.addRule(/- \[ \]/g, '\\item ');

// parse activated items/checkboxes
substitutioner.addRule(/- \[x\]/g, '\\item ');

// Ends the todolist and makes 'Priorität:' a header
substitutioner.addRule(/\*{0,2}Priorität:?\*{0,2}/g, '\\end{todolist} \\subsection{Priorität:}');

// Makes 'Aufwandsschätzung:' a header
substitutioner.addRule(/\*{0,2}Aufwandsschätzung:?\*{0,2}/g, '\\subsection{Aufwandsschätzung:}');

/**************************************************************************/

module.exports = {requestParameter, substitutioner};