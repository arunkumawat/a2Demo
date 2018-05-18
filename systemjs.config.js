/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      // other libraries
      'rxjs': 'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
      'ng2-bs3-modal': 'node_modules/ng2-bs3-modal',
      '@ng-bootstrap/ng-bootstrap': 'node_modules/@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js',
      'moment': 'node_modules/moment',
      'ng2-completer': 'node_modules/ng2-completer/ng2-completer.umd.js',
      'angular2-busy': 'node_modules/angular2-busy/build/src',
      'angular2-dynamic-component': 'node_modules/angular2-dynamic-component',
      'ts-metadata-helper': 'node_modules/ts-metadata-helper',
      'core-js': 'node_modules/core-js',
      'ng2-nvd3': 'node_modules/ng2-nvd3/build/lib'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'moment': {
        defaultExtension: 'js'
      },
      'angular2-busy': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      'angular2-dynamic-component': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      'ts-metadata-helper': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      'core-js': {
        main: 'index.js',
        defaultExtension: 'js'
      },
      'ng2-nvd3': {
        main: "ng2-nvd3.component.js",
        defaultExtension: "js"
      }
    }
  });
})(this);
