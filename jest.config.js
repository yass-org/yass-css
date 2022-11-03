//Jest testing tutorial for Selenium JavaScript Testing
// This configuration properties are taken from the official Jest documentation which is available at https://jestjs.io/docs/en/configuration.html 
//const {default} = require('jest-config');
module.exports = {
	// It indicates that each one imported modules in the tests must be mocked automatically
 	automock: false,
	// It indicates that it must prevent running the assessments after the primary failure is encountered
 	bail: false,
	// It indicates the "browser" field in package.Json when resolving modules
 	browser: false,
	// It indicates the listing where Jest must save the cached dependency details gathered from all throughout the tests
 	cacheDirectory: "/var/folders/jest_dx",
	// It suggests that the framework must automatically clean mock calls and instances between each test
	clearMocks: true,
	// It shows whether or not it have to have the coverage data collected while executing the test
 	collectCoverage: false,
	// It indicates that each one imported modules in the tests must be mocked automatically
// It indicates that an array of record extensions our modules should be using
 	moduleFileExtensions: [
   	"js",
   	"json",
   	"jsx",
   	"node"
 	],
	// It suggests the Jest to have an enum that specifies notification mode. Requires notify: true
 	notifyMode: "always",
	// It indicates the framework to have a preset this is used as a base for Jest's configuration
 	preset: null,
	// It suggests to run tests from one or extra projects
 	projects: null,
	// This indicates using the configuration to add custom newshounds to Jest
 	reporters: undefined,
	// This configuration shows the Jest to routinely reset mock state between every test
 	resetMocks: false,
	// This property suggests Jest to reset the module registry earlier than walking each person test
 	resetModules: false,
	// This configuration indicates Jest testing framework  to the course of a custom resolver
 	resolver: null,
     // This configuration indicates Jest to the course of a custom resolver
 	// This configuration indicates the Jest to allows us to apply a custom runner in preference to Jest's default inbuilt Jest test runner
 	runner: "jest-runner",
	// This configuration factors to the trails to modules that run a few code to configure or installation the test environment before each test run
 	setupFiles: [],
	// This configuration indicates the Jest to the direction to a module that runs some code to configure or installation the testing framework before than each test run 
 	setupFilesAfterEnv: null,
	// This configuration factors the Jest to the list of paths of the snapshot serializer modules that Jest must use for each of the snapshot testing
 	snapshotSerializers: [],
	// This configuration suggests the Jest to allow using a custom outcome or the result processor
 	testResultsProcessor: null,
	// This configuration shows the Jest to permit the usage of a new custom test runner instead of the default
 	testRunner: "jasmine2",
	// This configuration shows the Jest testing framework to assign the URL for the jsdom environment. It is shown in properties and configuration like the location.Href testURL: "http://localhost",
 	testURL: "http://localhost",
	// This property points to the setting of the price to "faux" lets in the use of fake timers for capabilities which includes "setTimeout"
 	timers: "real",
	// This property suggests the Jest to a map from regular expressions to paths to transformers
 	transform: null,
	// This configuration shows the Jest to an array of regex expression sample strings which are matched towards all source record paths, matched documents will pass transformation
 	transformIgnorePatterns: [
   	"/node_modules/"
 	],
	// It suggests that a map from ordinary regex to module names that permit to stub out assets with a single module
 	moduleNameMapper: {},
	// It suggests that an array of regex expression sample strings, matched against all module paths before considered 'visible' to the module loader
 	modulePathIgnorePatterns: [],
	// It suggests the Jest to prompt notifications for take a look at results
 	notify: false,
	// This configuration indicates the Jest which take a look at  test environment it need to use for the testing run
 	testEnvironment: "jest-environment-jsdom",
	// This configuration shows the Jest to the options so one can be passed to the testEnvironment
 	testEnvironmentOptions: {},
	// This configuration shows the Jest to add a location field to test the outcome of the run
 	testLocationInResults: false,
	// This configuration factors to the glob patterns Jest uses to detect test files
 	testMatch: [
   	"**/__tests__/**/*.js?(x)",
   	"test/**/*.ts",
   	"**/?(*.)+(spec|test).js?(x)"
 	],
	// This configuration indicates the Jest to an array of regexp pattern strings that are matched towards all test paths, matched tests are skipped
 	testPathIgnorePatterns: [
   	"/node_modules/"
 	],
	// This configuration points to the regexp sample Jest makes use of to detect test files
 	testRegex: "",
	// This configuration shows the Jest to routinely restore mock state among every tests that are executed
 	restoreMocks: false,
	// This configuration suggests framework to the root listing that Jest should check for the test cases and modules inside them
 	rootDir: null,
	// This configuration shows the Jest framework to the list of paths to directories that Jest ought to use to look for files inside them
	roots: [
   	"<rootDir>"
 	],
 	// It indicates that an array of glob patterns indicating a hard and fast of files for which insurance statistics ought to be collected
 	collectCoverageFrom: null,
	// It indicates the directory in which Jest ought to output its coverage documents and test files
	coverageDirectory: 'coverage',
	// This property shows that an array of regexp sample strings used to skip the test coverage collection
 	coveragePathIgnorePatterns: [
   	"/node_modules/"
 	], 
	// It indicates that a list of reporter names that Jest makes use of whilst writing coverage reports
 	coverageReporters: [
   	"json",
   	"text",
   	"lcov",
   	"clover"
 	],
	// This property shows that an item that configures minimal threshold enforcement for coverage reports
 	coverageThreshold: null,
	// This property shows that framework have to make call of deprecated APIs and throw helpful errors messages
 	errorOnDeprecated: false,
	// This property indicates the Jest testing framework to force insurance collection from ignored files using a array of glob patterns
 	forceCoverageMatch: [],
	// It suggests the route to a module which exports an async characteristic this is triggered as soon as earlier than all test suites
 	globalSetup: null,
	// It shows the course of the module which exports an async function that is brought on as soon as after all test suites
 	globalTeardown: null,
	// It suggests the set of world variables that are required to be available in all test environments
 	globals: {},
	// It indicates an array of directory names to be searched recursively up from the requiring module's location
 	moduleDirectories: [
   	"node_modules"
 	],
	// This configuration shows the  Jest testing framework to an array of regexp sample strings which might be matched against all modules earlier than the module loader will mechanically return a mock data for the test case
 	unmockedModulePathPatterns: undefined,
	// This configuration shows the  Jest testing framework whether or not each separate test cases should be reported during the executed test run
 	verbose: true,
	// This configuration shows the  Jest testing framework to an array of regexp patterns which might be matched against all source document paths before re-running tests in watch mode
 	watchPathIgnorePatterns: [],
	// This configuration shows the Jest testing framework whether or not the watchman should be used for document crawling
 	watchman: true,
  };