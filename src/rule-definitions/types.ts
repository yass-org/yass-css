export interface PropertyDefinition { 
  token: string, 
  propertyValue: string 
}

export interface RuleDefinition {
  propertyNames: string[]
  separator: string
  propertyValues: PropertyDefinition[] |  RuleDefinition[],
}
