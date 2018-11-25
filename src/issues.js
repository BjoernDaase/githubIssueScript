const request = require('request').defaults({headers: {'User-Agent': 'Test'}})
const fs = require('fs')
const config = require('../Configuration')

const {group, repository, maxRequestedIssueNumber, issueFilterLabel, private} = config.requestParameter
const {username, password} = config.credentials

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

function ensurePath(path){
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

function callback(error, response, body) {
    let path = './issues/', title = 'issues.tex'
    if (!error) {
        let results = JSON.parse(body)
        
        if(!(results instanceof Array)){
            console.log('Could not fetch issues from ' + repository);
            console.log('First check if any of this is misspelled: ')
            console.log('\t' + group)
            console.log('\t' + repository)
            console.log('\nIf they are correct and the repository is private you probably missspelled your credentials')
            return;
        }


        const relevantResults = results.filter(issue => issue.labels.map(x => x.name).includes(issueFilterLabel))

        ensurePath(path);

        fs.writeFile(path + title,
            texAll(relevantResults), 
            (err) => {
                if(err){
                    console.log(err)
                }
            })
            
        console.log(`Fetched ${relevantResults.length} issues and wrote them to ${path}${title}`)
    }
    else {
        console.log('error:', error); // Print the error if one occurred
    }
}

if(private){
    requestFunction = request.get(requestAdress, {
        'auth': {
            'user': username,
            'pass': password
        }
    }, callback)
}
else{
    requestFunction = request.get(requestAdress, callback)
}
