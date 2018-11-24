class Substitutioner{
    constructor(){
        this.rules = []
    }

    addRule(regex, text){
        this.rules.push({pattern: regex, substitution: text});
    }

    substitute(string){
        for(const rule of this.rules){
            string = string.replace(rule.pattern, rule.substitution);
        }

        return string;
    }
}

module.exports = Substitutioner;