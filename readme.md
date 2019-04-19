Schema Form
===========

This project is a fork of the awesome [json-schema-form/angular-schema-form](https://github.com/json-schema-form/angular-schema-form). You will find all the documentation, demo etc.. on their page or on their [dedicated website](http://schemaform.io/). 

Why this fork ?
===============

While trying to add some functionnalities in this library, it appears that the whole thing was kind of far from what it was at the beginning so here it is. 
Plus, As AngularJs is getting old, the projects around it are maintained slowly which is why this fork will try to make it adaptable for the next gen frameworks.
Mind that this project is a work in progress, you may find some issues here and there so feel free to report them or even better to ask for a pull request! 

What's new ?
============

- The management of the form was reworked in order to add a tree/node concept that can be decorated. This way, you will not find the array specific directives in this project. But do not worry, it is always possible to add your own directive to manage a node the way you want.
- The validators are now externals and need to be registered. The old tv4 validators is always the default and delivered in the main bundle.
- The templates management has also changed. A service that handle the fragments has been added to simplify the template process.

Demo / Editor
=============

A fork of the angular-schema-from demo page is available inside the editor folder. To run it please look at the "Build & Scripts" section.
The original running demo is [here](http://schemaform.io/examples/bootstrap-example.html).

Installation
============

For the moment there is no npm module available. The only way to use this library is to download the bundle you want or build your own.

Build & Scripts
===============

First, install npm dependencies:

```bash
npm i
```

To build the bundles :

```bash
npm run build
```

To run the editor :

```bash
npm run editor
```

To build the docs :

```bash
npm run docs
```

To serve the docs :

```bash
npm run serve:docs
```
