const Substitutioner = require('./src/Substitutioner');
const substitutioner = new Substitutioner();

// Configuration of the request parameters that get send to github
// The predefined settings are for: https://github.com/hpi-swt2/vm-portal

const requestParameter = {
    'group': 'hpi-swt2',                                  // name of the orga the repo is part of
    'repository': 'vm-portal',                            // name of the repository
    'maxRequestedIssueNumber': 200,                       // max number of overall fetched issues
    'issueFilterLabel': 'team scaffold',                  // the string of a label, that is applied to relevent issues (Rest gets ignored)
    'issueCreatedAfterDate' : '2018-12-05T15:00:00Z'      // only issues which were created after that date (format YYYY-MM-DDTHH:MM:SSZ)
};  

/********************************************************************************/
/**
 * Here are the changes of the issue text to final text in the tex file defined
 * The addRule method takes a regex and a string
 */

// Add rules for special characters
substitutioner.addRule(/\\/g, '\\textbackslash '); // This one has to be the first rule because it replaces backslashes which are TeX control commands

substitutioner.addRule(/#/g, '\\#');
substitutioner.addRule(/&/g, '\\&');
substitutioner.addRule(/_/g, '\\_'); // We have to use \txtit{} for that in the future beacuse _ underscore defines italic style
substitutioner.addRule(/>/g, '\\textgreater ');
substitutioner.addRule(/</g, '\\textless ');
substitutioner.addRule(/~/g, '\\textasciitilde ');
substitutioner.addRule(/~/g, '\\textasciitilde ');
substitutioner.addRule(/{/g, '\\{ ');
substitutioner.addRule(/}/g, '\\} ');
substitutioner.addRule(/\^/g, '\\textasciicircum ');
substitutioner.addRule(/\°/g, '\\circ ');

// ignores github links
substitutioner.addRule(/!\[.*\]\(.*\)/g, '');

// ignores github comment lines
substitutioner.addRule(/\[\/\/\].*/g, '');


/* Parse BUGS */

// Starts the description of the issue and makes 'Beschreibung:' a header
substitutioner.addRule(/\*{0,2}Annex:?\*{0,2}/gi, '\\subsection{Annex:} ');

// Starts the description of the issue and makes 'Beschreibung:' a header
substitutioner.addRule(/\*{0,2}Summary:?\*{0,2}/gi, '\\subsection{Summary:} ');

// Starts the description of the issue and makes 'Beschreibung:' a header
substitutioner.addRule(/\*{0,2}Steps to Reproduce:?\*{0,2}/gi, '\\subsection{Steps to Reproduce:} ');


/* Parse USER STORIES */

// Starts the description of the issue and makes 'Beschreibung:' a header
substitutioner.addRule(/\*{0,2}User Story:?\*{0,2}/gi, '\\subsection{User Story:} ');

// Starts the description of the acceptance criterias, makes 'Akzeptanzkriterien:' a header
// and starts a todolist in order to prefix the individual cirteriad with a checkbox
substitutioner.addRule(/\*{0,2}Acceptance Criteria:?\*{0,2}/gi, '\\subsection{Acceptance Criteria:} \\begin{todolist}');

// parse normal items/checkboxes
substitutioner.addRule(/- \[ \]/g, '\\item ');

// parse activated items/checkboxes
substitutioner.addRule(/- \[x\]/g, '\\item ');



// Ends the todolist and makes 'Priorität:' a header
// substitutioner.addRule(/\*{0,2}Priorität:?\*{0,2}/g, '\\end{todolist} \\subsection{Priorität:}');
// Makes 'Aufwandsschätzung:' a header
// substitutioner.addRule(/\*{0,2}Aufwandsschätzung:?\*{0,2}/g, '\\subsection{Aufwandsschätzung:}');


/**************************************************************************/

module.exports = {requestParameter, substitutioner};