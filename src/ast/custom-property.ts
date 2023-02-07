import { Declaration } from 'postcss'

interface CustomPropertyArgs { 
  key: string;
  value: string;
}

export class CustomProperty {
  key: string
  value: string
  
  constructor({ key, value }: CustomPropertyArgs) {
    this.key = key
    this.value = value
  }

  toJSON() {
    return new Declaration({
      prop: this.key,
      value: this.value,
      raws: {
        before: '\n  ',
        after: '',
      }
    })
  }

  toString() {
    return this.toJSON().toString()
  }
}
