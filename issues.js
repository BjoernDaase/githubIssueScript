const request = require('request').defaults({headers: {'User-Agent': 'Test'}})
const fs = require('fs')
const config = require('./Configuration')

const {group, repository, maxRequestedIssueNumber, issueFilterLabel} = config

const requestAdress = `https://api.github.com/repos/${group}/${repository}/issues?per_page=${maxRequestedIssueNumber}\n`;

function issueData(issue){                      // parses the individual issues
    return [
        issue.number,
        issue.title,
        issue.body
            .replace(/- \[ \]/g, '\\item ')
            .replace(/- \[x\]/g, '\\item ')
            .replace(/#/g, '\\#')
            .replace(/!\[.*\]\(.*\)/g, '')      // filters github links that cannot be parsed by latex
            .replace(/\*{0,2}Akzeptanzkriterien:?\*{0,2}/gi, '\\subsection{Akzeptanzkriterien:} \\begin{todolist}')
            .replace(/\*{0,2}Beschreibung:?\*{0,2}/gi, '\\subsection{Beschreibung:} ')            
            .replace(/\*{0,2}Priorität:?\*{0,2}/g, '\\end{todolist} \\subsection{Priorität:}')
            .replace(/\*{0,2}Aufwandsschätzung:?\*{0,2}/g, '\\subsection{Aufwandsschätzung:}')]
}

function texIt(number, header, body){
    let text = ''
    text += '\\begin{minipage}{\\textwidth}'
    text += `\\section{\\#${number}: ${header}}\n`
    text += body
    text += '\\end{minipage}\n\n\n'
    text += '\\vspace{42px}'

    return text
}

function texAll(issues){    // appends all filtered issues in one file after parsing them 
    let text = ''
    text += '\\documentclass[11pt, a4paper]{article}\\pagenumbering{gobble} \\usepackage{enumitem,amssymb}\\newlist{todolist}{itemize}{2}\\setlist[todolist]{label=$\\square$}'
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

request(requestAdress, function (error, response, body) {
    let path = './issues/', title = 'issues.tex'
    if (!error) {
        let results = JSON.parse(body)
        const relevantResults = results.filter(issue => issue.labels.map(x => x.name).includes(issueFilterLabel))

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }

        fs.writeFile(path + title,
            texAll(relevantResults), 
            (err) => {
                if(err){
                    console.log(err)
                }
            })
            
            console.log(`Fetched ${relevantResults.length} issues and wrote them to ${title}`)
    }
    else {
        console.log('error:', error); // Print the error if one occurred
    }
});

