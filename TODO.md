

Currently, build.js just imports `css/properties.js`, which is just a list of vanilla css properties and their valid values
and constructs a metric shit tonne of css rules from it. 

We additionally need to:

[] Do a similar thing for `design-system/globalTokens.js`
[] Do a similar thing for `design-system/aliasTokens.js`
  - The difficulty here is that  `css/properties.js` was just a flat object, where as `globalTokens.js` contains nested properties,
    like `color.teal.500`. So, we need a more sophisticated `JS2CSS()` function that handles that. 
[] Do a similar thing with utility classes


[] Implement command line args