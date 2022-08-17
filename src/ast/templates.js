export const root = () => ({
  "type": "root",
  "nodes": []
})

export const rule = ({ selector, propertyName, propertyValue }) => ({
  "type": "rule",
  selector,
  "raws": {
    "before": "\n",
    "between": " ",
    "semicolon": true,
    "after": "\n"
  },
  "nodes": [
    declaration({propertyName, propertyValue})
  ]
})

const declaration = ({propertyName, propertyValue}) => ({
  "raws": {
    "before": "\n  ",
    "between": ": "
  },
  "type": "decl",
  prop: propertyName,
  value: propertyValue,
})
