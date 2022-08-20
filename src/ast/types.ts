
export interface PropertyTemplate {
  type: "decl",
  raws: {
    before: string
    between: string
  },
  prop: string
  value: string
}

export interface RuleTemplate {
  type: "rule"
  selector: string
  raws: {
    "before": string
    "between": string
    "semicolon": boolean
    "after": string
  },
  "nodes": PropertyTemplate[]
}

export interface RootTemplate {
  type: 'root'
  nodes: RuleTemplate[]
}
