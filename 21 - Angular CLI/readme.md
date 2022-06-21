# Angular CLI

## Content

- [ng new](#ng-new)
- [Configuration Files](#configuration-files)
- [CLI Commands](#cli-commands)
- [angular.json](#angular.json)
- [Schematics](#schematics)
- [ng add](#ng-add)
- [ng generate](#ng-generate)
- [ng update](#ng-update)
- [ng deploy](#ng-deploy)
- [Differential Loading](#differential-loading)
- [Multiple Projects](#multiple-projects)

---

## ng new

It is possible to get all the info about a command using the `--help` flag:
```
$ ng new --help

arguments:
  name
    The name of the new workspace and initial project.

options:
  --collection (-c)
    A collection of schematics to use in generating the initial application.
  --commit 
    Initial git repository commit information.
  --create-application 
    Create a new initial application project in the 'src' folder of the new workspace. When false, creates an empty workspace with no initial application. You can then use the generate application command so that all applications are created in the projects folder.
  --defaults 
    Disable interactive input prompts for options with a default.
  --directory 
    The directory name to create the workspace in.
  --dry-run (-d)
    Run through and reports activity without writing out results.
  --force (-f)
    Force overwriting of existing files.
  --help 
    Shows a help message for this command in the console.
  --inline-style (-s)
    Include styles inline in the component TS file. By default, an external styles file is created and referenced in the component TypeScript file.
  --inline-template (-t)
    Include template inline in the component TS file. By default, an external template file is created and referenced in the component TypeScript file.
  --interactive 
    Enable interactive input prompts.
  --minimal 
    Create a workspace without any testing frameworks. (Use for learning purposes only.)
  --new-project-root 
    The path where new projects will be created, relative to the new workspace root.
  --package-manager 
    The package manager used to install dependencies.
  --prefix (-p)
    The prefix to apply to generated selectors for the initial project.
  --routing 
    Generate a routing module for the initial project.
  --skip-git (-g)
    Do not initialize a git repository.
  --skip-install 
    Do not install dependency packages.
  --skip-tests (-S)
    Do not generate "spec.ts" test files for the new project.
  --strict 
    Creates a workspace with stricter type checking and stricter bundle budgets settings. This setting helps improve maintainability and catch bugs ahead of time. For more information, see https://angular.io/guide/strict-mode
  --style 
    The file extension or preprocessor to use for style files.
  --verbose (-v)
    Add more details to output logging.
  --view-encapsulation 
    The view encapsulation strategy to use in the initial project.
```

All the available CLI command are available in the [Official Documentation](https://angular.io/cli)

## Configuration Files

- `.editorconfig`: used to standardize the editor code style
- `.browserslistrc`: defines the supported browsers by the application
- `karma.conf.js`: test configurations
- `package.json`: packages and versions used by the application and run scripts definition
- `tsconfig.json`: TypeScript configuration options, 
it contains also some angular specific options

## CLI Commands

It is possible to list all the available commands using:
```
$ ng help

Available Commands:
  add Adds support for an external library to your project.
  analytics Configures the gathering of Angular CLI usage metrics. See https://angular.io/cli/usage-analytics-gathering.
  build (b) Compiles an Angular app into an output directory named dist/ at the given output path. Must be executed from within a workspace directory.
  deploy Invokes the deploy builder for a specified project or for the default project in the workspace.
  config Retrieves or sets Angular configuration values in the angular.json file for the workspace.
  doc (d) Opens the official Angular documentation (angular.io) in a browser, and searches for a given keyword.
  e2e (e) Builds and serves an Angular app, then runs end-to-end tests.
  extract-i18n (i18n-extract, xi18n) Extracts i18n messages from source code.
  generate (g) Generates and/or modifies files based on a schematic.
  help Lists available commands and their short descriptions.
  lint (l) Runs linting tools on Angular app code in a given project folder.
  new (n) Creates a new workspace and an initial Angular application.
  run Runs an Architect target with an optional custom builder configuration defined in your project.
  serve (s) Builds and serves your app, rebuilding on file changes.
  test (t) Runs unit tests in a project.
  update Updates your application and its dependencies. See https://update.angular.io/
  version (v) Outputs Angular CLI version.

For more detailed help run "ng [command name] --help"
```

#### ng serve

Allows to run the application:
```
$ ng serve --help

Builds and serves your app, rebuilding on file changes.
usage: ng serve <project> [options]

arguments:
  project
    The name of the project to build. Can be an application or a library.

options:
  --allowed-hosts 
    List of hosts that are allowed to access the dev server.
  --browser-target 
    A browser builder target to serve in the format of `project:target[:configuration]`. You can also pass in more than one configuration name as a comma-separated list. Example: `project:target:production,staging`.
  --configuration (-c)
    One or more named builder configurations as a comma-separated list as specified in the "configurations" section of angular.json.
    The builder uses the named configurations to run the given target.
    For more information, see https://angular.io/guide/workspace-config#alternate-build-configurations.
    Setting this explicitly overrides the "--prod" flag.
  --disable-host-check 
    Don't verify connected clients are part of allowed hosts.
  --help 
    Shows a help message for this command in the console.
  --hmr 
    Enable hot module replacement.
  --host 
    Host to listen on.
  --live-reload 
    Whether to reload the page on change, using live-reload.
  --open (-o)
    Opens the url in default browser.
  --poll 
    Enable and define the file watching poll time period in milliseconds.
  --port 
    Port to listen on.
  --prod 
    Shorthand for "--configuration=production".
    Set the build configuration to the production target.
    By default, the production target is set up in the workspace configuration such that all builds make use of bundling, limited tree-shaking, and also limited dead code elimination.
  --proxy-config 
    Proxy configuration file. For more information, see https://angular.io/guide/build#proxying-to-a-backend-server.
  --public-host 
    The URL that the browser client (or live-reload client, if enabled) should use to connect to the development server. Use for a complex dev server setup, such as one with reverse proxies.
  --serve-path 
    The pathname where the application will be served.
  --ssl 
    Serve using HTTPS.
  --ssl-cert 
    SSL certificate to use for serving HTTPS.
  --ssl-key 
    SSL key to use for serving HTTPS.
  --verbose 
    Adds more details to output logging.
  --watch 
    Rebuild on change.
```

#### ng generate

Allows to create schematics:
```
$ ng generate --help

Generates and/or modifies files based on a schematic.
usage: ng generate <schematic> [options]

arguments:
  schematic
    The schematic or collection:schematic to generate.

options:
  --defaults 
    Disable interactive input prompts for options with a default.
  --dry-run (-d)
    Run through and reports activity without writing out results.
  --force (-f)
    Force overwriting of existing files.
  --help 
    Shows a help message for this command in the console.
  --interactive 
    Enable interactive input prompts.

Available Schematics:
  Collection "@schematics/angular" (default):
    app-shell
    application
    class
    component
    directive
    enum
    guard
    interceptor
    interface
    library
    module
    pipe
    resolver
    service
    service-worker
    web-worker
```

It is possible to have more information rquiring help on the specific schematic:
```
$ ng generate component --help

Create an Angular component.
usage: ng generate component <name> [options]

arguments:
  schematic
    The schematic or collection:schematic to generate.
  name
    The name of the component.

options:
  --change-detection (-c)
    The change detection strategy to use in the new component.
  --defaults 
    Disable interactive input prompts for options with a default.
  --display-block (-b)
    Specifies if the style will contain `:host { display: block; }`.
  --dry-run (-d)
    Run through and reports activity without writing out results.
  --export 
    The declaring NgModule exports this component.
  --flat 
    Create the new files at the top level of the current project.
  --force (-f)
    Force overwriting of existing files.
  --help 
    Shows a help message for this command in the console.
  --inline-style (-s)
    Include styles inline in the component.ts file. Only CSS styles can be included inline. By default, an external styles file is created and referenced in the component.ts file.
  --inline-template (-t)
    Include template inline in the component.ts file. By default, an external template file is created and referenced in the component.ts file.
  --interactive 
    Enable interactive input prompts.
  --module (-m)
    The declaring NgModule.
  --prefix (-p)
    The prefix to apply to the generated component selector.
  --project 
    The name of the project.
  --selector 
    The HTML selector to use for this component.
  --skip-import 
    Do not import this component into the owning NgModule.
  --skip-selector 
    Specifies if the component should have a selector or not.
  --skip-tests 
    Do not create "spec.ts" test files for the new component.
  --style 
    The file extension or preprocessor to use for style files, or 'none' to skip generating the style file.
  --type 
    Adds a developer-defined type to the filename, in the format "name.type.ts".
  --view-encapsulation (-v)
    The view encapsulation strategy to use in the new component.



To see help for a schematic run:
  ng generate <schematic> --help
```

#### ng build

Allows to build the application:
```
$ ng build --help

Compiles an Angular app into an output directory named dist/ at the given output path. Must be executed from within a workspace directory.
usage: ng build <project> [options]

arguments:
  project
    The name of the project to build. Can be an application or a library.

options:
  --allowed-common-js-dependencies 
    A list of CommonJS packages that are allowed to be used without a build time warning.
  --aot 
    Build using Ahead of Time compilation.
  --base-href 
    Base url for the application being built.
  --build-optimizer 
    Enables '@angular-devkit/build-optimizer' optimizations when using the 'aot' option.
  --common-chunk 
    Generate a seperate bundle containing code used across multiple bundles.
  --configuration (-c)
    One or more named builder configurations as a comma-separated list as specified in the "configurations" section of angular.json.
    The builder uses the named configurations to run the given target.
    For more information, see https://angular.io/guide/workspace-config#alternate-build-configurations.
    Setting this explicitly overrides the "--prod" flag.
  --cross-origin 
    Define the crossorigin attribute setting of elements that provide CORS support.
  --delete-output-path 
    Delete the output path before building.
  --deploy-url 
    URL where files will be deployed.
  --extract-licenses 
    Extract all licenses in a separate file.
  --help 
    Shows a help message for this command in the console.
  --i18n-duplicate-translation 
    How to handle duplicate translations for i18n.
  --i18n-missing-translation 
    How to handle missing translations for i18n.
  --index 
    Configures the generation of the application's HTML index.
  --inline-style-language 
    The stylesheet language to use for the application's inline component styles.
  --localize 
    Translate the bundles in one or more locales.
  --main 
    The full path for the main entry point to the app, relative to the current workspace.
  --named-chunks 
    Use file name for lazy loaded chunks.
  --ngsw-config-path 
    Path to ngsw-config.json.
  --optimization 
    Enables optimization of the build output. Including minification of scripts and styles, tree-shaking, dead-code elimination, inlining of critical CSS and fonts inlining. For more information, see https://angular.io/guide/workspace-config#optimization-configuration.
  --output-hashing 
    Define the output filename cache-busting hashing mode.
  --output-path 
    The full path for the new output directory, relative to the current workspace.
    
    By default, writes output to a folder named dist/ in the current project.
  --poll 
    Enable and define the file watching poll time period in milliseconds.
  --polyfills 
    The full path for the polyfills file, relative to the current workspace.
  --preserve-symlinks 
    Do not use the real path when resolving modules. If unset then will default to `true` if NodeJS option --preserve-symlinks is set.
  --prod 
    Shorthand for "--configuration=production".
    Set the build configuration to the production target.
    By default, the production target is set up in the workspace configuration such that all builds make use of bundling, limited tree-shaking, and also limited dead code elimination.
  --progress 
    Log progress to the console while building.
  --resources-output-path 
    The path where style resources will be placed, relative to outputPath.
  --service-worker 
    Generates a service worker config for production builds.
  --show-circular-dependencies 
    Show circular dependency warnings on builds.
  --source-map 
    Output source maps for scripts and styles. For more information, see https://angular.io/guide/workspace-config#source-map-configuration.
  --stats-json 
    Generates a 'stats.json' file which can be analyzed using tools such as 'webpack-bundle-analyzer'.
  --subresource-integrity 
    Enables the use of subresource integrity validation.
  --ts-config 
    The full path for the TypeScript configuration file, relative to the current workspace.
  --vendor-chunk 
    Generate a seperate bundle containing only vendor libraries. This option should only used for development.
  --verbose 
    Adds more details to output logging.
  --watch 
    Run build when files change.
  --web-worker-ts-config 
    TypeScript configuration for Web Worker modules.
```

## angular.json

`angular.json` allows to define defaults used in all the CLI commands.

Configuration properties:
-`projectType`: can be
    - **application**: a normal angular application
    - **library**: an angular library
- `root`: base project folder
- `sourceRoot`: base code project folder 
- `prefix`: component selector default prefix
- `architect`: define how to build the project
- `build` and `serve`: groups the configuration below for the specific command
- `assets`: files or folders copied in the output
- `styles`: styles that must be included
- `scripts`: scripts that must be included
- `configurations`: allows to specify different environments

## Schematics

Schematics are blueprints used for generate, add and update commands.

It is the possible to build custom schematics and use them to generate components
and so on.

## ng add

Allows to add packages to the application:
```
$ ng add --help

arguments:
  collection
    The package to be added.

options:
  --defaults 
    Disable interactive input prompts for options with a default.
  --help 
    Shows a help message for this command in the console.
  --interactive 
    Enable interactive input prompts.
  --registry 
    The NPM registry to use.
  --skip-confirmation 
    Skip asking a confirmation prompt before installing and executing the package. Ensure package name is correct prior to using this option.
  --verbose 
    Display additional details about internal operations during execution.

```
during the process some questions can be prompt up and the process
not justw add new dependencies to the project, but can also change some files.

Example with material:
```
$ ng add @angular/material

ℹ Using package manager: npm
✔ Found compatible package version: @angular/material@13.3.9.
✔ Package information loaded.

The package @angular/material@13.3.9 will be installed and executed.
Would you like to proceed? Yes
✔ Package successfully installed.
? Choose a prebuilt theme name, or "custom" for a custom theme: Deep Purple/Amber  [ Preview: https://material.angular.io?theme=deeppurple-amber ]
? Set up global Angular Material typography styles? No
? Set up browser animations for Angular Material? Yes
UPDATE package.json (1136 bytes)
✔ Packages installed successfully.
UPDATE src/app/app.module.ts (423 bytes)
UPDATE angular.json (3219 bytes)
UPDATE src/index.html (552 bytes)
UPDATE src/styles.css (181 bytes)
```

## ng generate

Using the just installed material package, it is possible to install
schematics defined there:
```bash
ng generate @angular/material:nav main-nav
```

## ng update

Allows to check and, in case, update the angular dependencies:
```
$ ng update --help

Updates your application and its dependencies. See https://update.angular.io/
usage: ng update [options]

options:
  --all 
    Whether to update all packages in package.json.
  --allow-dirty 
    Whether to allow updating when the repository contains modified or untracked files.
  --create-commits (-C)
    Create source control commits for updates and migrations.
  --force 
    Ignore peer dependency version mismatches. Passes the `--force` flag to the package manager when installing packages.
  --from 
    Version from which to migrate from. Only available with a single package being updated, and only on migration only.
  --help 
    Shows a help message for this command in the console.
  --migrate-only 
    Only perform a migration, do not update the installed version.
  --next 
    Use the prerelease version, including beta and RCs.
  --packages 
    The names of package(s) to update.
  --to 
    Version up to which to apply migrations. Only available with a single package being updated, and only on migrations only. Requires from to be specified. Default to the installed version detected.
  --verbose 
    Display additional details about internal operations during execution.
```

In this case the project is still using angular@13:
```
s$ ng update

Using package manager: 'npm'
Collecting installed dependencies...
Found 25 dependencies.
    We analyzed your package.json, there are some packages to update:
    
      Name                               Version                  Command to update
     --------------------------------------------------------------------------------
      @angular/cdk                       13.3.9 -> 14.0.2         ng update @angular/cdk
      @angular/cli                       13.3.8 -> 14.0.2         ng update @angular/cli
      @angular/core                      13.3.11 -> 14.0.2        ng update @angular/core
      @angular/material                  13.3.9 -> 14.0.2         ng update @angular/material
    
    There might be additional packages which don't provide 'ng update' capabilities that are outdated.
    You can update the additional packages by running the update command of your package manager.
```

## ng deploy

Allows to build and directly deploy the application to some supported hosts:
```
$ ng deploy --help

Invokes the deploy builder for a specified project or for the default project in the workspace.
usage: ng deploy <project> [options]

arguments:
  project
    The name of the project to deploy.

options:
  --configuration (-c)
    One or more named builder configurations as a comma-separated list as specified in the "configurations" section of angular.json.
    The builder uses the named configurations to run the given target.
    For more information, see https://angular.io/guide/workspace-config#alternate-build-configurations.
  --help 
    Shows a help message for this command in the console.
```
in case it is also possible to define a custom deploy configuration.

## Differential Loading

On deployed code, Angular is able to analyze the user browser and ship him
an application version that has the compatibility with the used browser.
This means that for modern browsers that need less code, because some functionalities
are supported directly, less code is needed, while old browsers may need an
app version with more code inside.
This is in the `polyfills` and `runtime` files,
the configuration file is `polyfills.ts`.

## Multiple Projects

It is possible to use the `ng generate` command to add new applications and 
libraries to the current project.

### Applications

It is possible to add a new application by running:
```bash
ng generate application backend
```
the `backend` project is then added under the `projects` folder,
with the same structure as the main one.

The new application can be run using:
```bash
ng serve --project=backend
```
the default project to be run can be configured in the `angular.json` file
under **defaultProject** property.

In order to improbe the files structure, it is possible to run the `new` command
with the `--create-application=false`.
This will not create the `src` folder and therefore it is possible to manually
add, and have, all the desired projects inside only one folder using the
previous command.

### Libraries

It is possible to add a new library by running:
```bash
ng generate library my-button
```
a library still uses all the angular potentialities, but cannot be run as
standalone application. The idea is to have some code
that can be shared across multiple angular application.

In the `public-api.ts` are defined all the stuff exported by the library.

In the `lib/` folder is present all the code of the library.

