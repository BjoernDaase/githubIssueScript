const request = require('request').defaults({headers: {'User-Agent': 'Test'}})
const fs = require('fs')
const config = require('../Configuration')

const {group, repository, maxRequestedIssueNumber, issueFilterLabel, issueCreatedAfterDate} = config.requestParameter

const requestAdress = `https://api.github.com/repos/${group}/${repository}/issues?per_page=${maxRequestedIssueNumber}\n`;

function issueData(issue){                      // parses the individual issues
    return [
        issue.number,
        issue.title,
        config.substitutioner.substitute(issue.body)]
}

function texIt(number, header, body){           // wraps an issue and gives it a header
    let text = ''
    text += '\\begin{minipage}{\\textwidth}'
    text += `\\section{\\#${number}: ${header}}\n`
    text += body
    /*
    If we have a User Story we opened a todolist for the Acceptance Criteria.
    We know that it's the last subsection so we can close it at the end but we only want to do it if it's a User Story and not if it's a bug.
    The way we determine if it's a User Story atm is not nice but it works.
    */
    if (body.includes('\\subsection{Acceptance Criteria:}')) {
        text += `\\end{todolist}`
    }
    text += '\\end{minipage}\n\n\n'
    text += '\\vspace{42px}'

    return text
}

function texAll(issues){    // appends all filtered issues in one file after parsing them 
    let text = ''
    text += '\\documentclass[11pt, a4paper]{article}\\pagenumbering{gobble} \\usepackage[geometry]{ifsym} \\usepackage{enumitem,amssymb}\\newlist{todolist}{itemize}{2}\\setlist[todolist]{label=\\SmallSquare}'
    text += '\n\n\\date{}\\begin{document}'
    
    // some latex magic for not writing numbers berfore sections and subsections
    text += `\\makeatletter
    \\renewcommand{\\@seccntformat}[1]{%
      \\ifcsname prefix@#1\\endcsname
        \\csname prefix@#1\\endcsname
      \\else
        \\csname the#1\\endcsname\\quad
      \\fi}
    \\newcommand\\prefix@section{}
    \\renewcommand{\\@seccntformat}[1]{%
        \\ifcsname prefix@#1\\endcsname
          \\csname prefix@#1\\endcsname
        \\else
          \\csname the#1\\endcsname\\quad
        \\fi}
      \\newcommand\\prefix@subsection{}
      \\makeatother\n
    `

    for(const issue of issues){
        text += texIt(...issueData(issue))
    }

    text += '\\end{document}'
    return text
}

function ensurePath(path){
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

request(requestAdress, function (error, response, body) {
    let path = './issues/', title = 'issues.tex'
    if (!error) {
        let results = JSON.parse(body)
        console.log(results)
        if (results.constructor.name.toString = 'Array') { // GitHub did not answer a valid response
            // First check date and then check the label
            let relevantResults = results.filter(issue => issue.created_at > issueCreatedAfterDate).filter(issue => issue.labels.map(x => x.name).includes(issueFilterLabel))

            ensurePath(path);

            fs.writeFile(path + title,
                texAll(relevantResults), 
                (err) => {
                    if(err){
                        console.log(err)
                    }
                })
                
                console.log(`Fetched ${relevantResults.length} issues and wrote them to ${path}${title}`)
        } else {
            console.log('error:', results)
        }
    }
    else {
        console.log('error:', error); // Print the error if one occurred
    }
});

