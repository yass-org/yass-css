# Yass CSS

Atomic CSS that encodes your design system.

## Quickstart
```bash
$ npx yass-css # Use Yass default design system
$ npx yass-css path/to/tokens # Use your own design system
```

## Core concepts
  
### Easy to learn
By default, Yass generates atomic classes that look just like regular CSS. For example, if you want to apply `display: flex;`, you would write: 
```html
  <div class="display:flex"></div>
```
Any CSS that conforms to your design system can be rewritten as Yass classes.

### Design system first
While most other atomic CSS libraries ship with a prebuilt design system, and then allow customisations through theming, Yass exists to create atomic classes from your design system. Think of it as "[Tailwind CSS](https://v2.tailwindcss.com/docs) + [Style Dictionary](https://amzn.github.io/style-dictionary/#/)"

You provide an array of design tokens, and Yass will create atomic classes that conform to your tokens, for example:
```json
{
  "key": "brand-primary", 
  "value": "hsl(220, 80%, 50%)",
  "category": "color",
}
```

will generate
```css
:root {
  --brand-primary: hsl(220, 80%, 50%);
}

.color\\:brand-primary { color: var(--brand-primary); }
.background-color\\:brand-primary { color: var(--brand-primary); }
.border-color\\:brand-primary { color: var(--brand-primary); }
/* ... other color related css rules */
```

which can be used like:
```html
<p class="color:brand-primary">Yass</p>
```

Note: `color`, `background-color`, `border-color`, etc classes were generated because `"category": "color"` was set on the token. If you wish to be more specific, you can instead define: `"properties": ["border-left-color"]` instead. This can be useful for setting setting different text colors vs background colors with similar token names.  

### Yass is the subset of CSS that conforms to your design system
While not strictly true, this is a useful mental model to have when writing Yass. If you have a spacing related design token called `size.100`, then 




## Design Tokens
A design token is a key/value pair that links a raw color, size, elevation, opacity, etc with a semantic name. These can be codified using a language like JSON:
```json
[
  {
    "key": "blue-500", 
    "value": "hsl(220, 80%, 50%)"
  },
  {
    "key": "blue-600", 
    "value": "hsl(220, 80%, 40%)"
  }
]
```

If you have used a tool like [Style Dictionary](https://amzn.github.io/style-dictionary/#/) before, then this will be familiar to you. Yass takes a slightly different approach to token definitions, in that we prefer a flat array over the nesting that Style Dictionary has. 

## Customisation/Configurability

### Global level
Global level configuration can be done via a `yass.config.json` file in your projects root directory (or wherever you run `npx yass-css` from).

### Token level


## Production
Similar to Tailwind, Yass currently generates very large stylesheets. This is usually fine in development (unless the stylesheet is over ~20mb). But in production, we highly recommend using a tool like [PurgeCSS](https://purgecss.com/) to remove any unused styles. A more streamlined developer experience for this is an active area of development in Yass.

