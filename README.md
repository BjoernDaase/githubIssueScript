# Github Issue Script
This script fetches issues from public github repositories and writes them to a tex file. The issues get fetched how they are written (usually in markdown) and 

## Installation
* Clone the repository
* Navigate to the folder from the command line
* Execute: 
``` npm install ```

## Configuration
Usually all configurations should be made in the Configuration.js file, where you can edit the request parameter (e.g. repo name) and define how the issue text should be transformed to latex. 

## Usage
* Adjust the settings in the Configuration.js
* In the cloned folder execute:
``` npm run fetchIssues ```
* Now there is a issues.tex file in the issues subdiretory
* You should compile this with your local tex installation



