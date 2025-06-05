import { Rule } from './rules';

export class Authoriser {
  rules: Rule[];

  constructor() {
    this.rules = [];
  }

  public addRule(rule : Rule) : void {
    this.rules.push(rule);
  }

  public removeRule(ruleId : string) {
    this.rules.map(rule => rule.id !== ruleId);
  }

  public authoriseRequest(action : string, role : 'admin' | 'developer'| 'user',
    classification : 1 | 2 | 3 | 4 | 5 ) : boolean {
    return this.rules.find(rule => rule.action === action
        && rule.role === role
        && classification <= rule.clasifiction,
    )? true : false;
  }
};
