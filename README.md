# Github Issue Script
This script fetches issues from public github repositories and writes them to a tex file. The issues get fetched how they are written (usually in markdown) and 

## Installation
* Clone the repository
* Navigate to the folder from the command line
* Execute: 
``` npm install ```
* If you wan't the .tex to be compiled automatically you also need ``` pdflatex ``` (works only under UNIXoid systems). On Debian based systems (e.g. Ubuntu) it can be installed by executing: ``` sudo apt install texlive-science ```. 

## Configuration
Usually all configurations should be made in the Configuration.js file, where you can edit the request parameter (e.g. repo name) and define how the issue text should be transformed to latex. 

## Usage
* Adjust the settings in the Configuration.js
1. Generate a .pdf file (UNIXoid systems only)
* navigate to the cloned folder
* Make the ``` fetchIssues.sh ``` file executable by running:
``` chmod +x fetchIssues.sh ```
* Exexcute
``` ./fetchIssues.sh ```
2. Generare the .tex file only
* In the cloned folder execute:
``` npm run fetchIssues ```
* Now there is a issues.tex file in the issues subdiretory
* You should compile this with your local tex installation

## Latex particularities
In the context of the issue.tex there are the following things for latex defined:
* Every issue will get wrapped in a minipage so it does not get seperated at pagebreak (it also ensures the issue goes on a new page if it cannot fit at the left space)
* Sections and subsection will not get prefixed with a number
