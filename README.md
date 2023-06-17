# Yass CSS

This readme is for information about developing `yass-css`. For documentation on how to use `yass-css`, see: https://github.com/yass-org/yass-docs


## Development

To get a development server running for Yass, follow these steps:
```bash
$ git clone git@github.com:yass-org/yass-css.git
$ cd yass-css
$ npm i --location=global # This will install yass-css globally. This is useful for testing changes to yass when used in other projects
$ npm run dev # This will watch for changes, and regenerate the build folder.
```

Then, in another terminal window:
```bash
$ mkdir test-app
$ cd test-app
$ npx yass-css # This will run the global version of yass-css you installed in the previous section.
```
