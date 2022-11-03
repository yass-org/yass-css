
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


export const isRuleDefinitionArray = (obj: any) => {
  if(!Array.isArray(obj)) {
    return false
  }

  let isRuleDefinition = true

  obj.forEach((el) => {
    if(el.separator === undefined) {
      isRuleDefinition = false
      return
    }  
  })

  return isRuleDefinition
}