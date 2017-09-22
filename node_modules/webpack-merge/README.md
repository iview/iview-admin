[![build status](https://secure.travis-ci.org/survivejs/webpack-merge.svg)](http://travis-ci.org/survivejs/webpack-merge) [![bitHound Score](https://www.bithound.io/github/survivejs/webpack-merge/badges/score.svg)](https://www.bithound.io/github/survivejs/webpack-merge) [![codecov](https://codecov.io/gh/survivejs/webpack-merge/branch/master/graph/badge.svg)](https://codecov.io/gh/survivejs/webpack-merge)

# webpack-merge - Merge designed for Webpack

**webpack-merge** provides a `merge` function that concatenates arrays and merges objects creating a new object. If functions are encountered, it will execute them, run the results through the algorithm, and then wrap the returned values within a function again.

This behavior is particularly useful in configuring webpack although it has uses beyond it. Whenever you need to merge configuration objects, **webpack-merge** can come in handy.

There's also a webpack specific merge variant known as `merge.smart` that's able to take webpack specifics into account (i.e., it can flatten loader definitions).

## Standard Merging

### **`merge(...configuration | [...configuration])`**

`merge` is the core, and the most important idea, of the API. Often this is all you need unless you want further customization.

```javascript
// Default API
var output = merge(object1, object2, object3, ...);

// You can pass an array of objects directly.
// This works with all available functions.
var output = merge([object1, object2, object3]);
```

### **`merge({ customizeArray, customizeObject })(...configuration | [...configuration])`**

`merge` behavior can be customized per field through a curried customization API.

```javascript
// Customizing array/object behavior
var output = merge(
  {
    customizeArray(a, b, key) {
      if (key === 'extensions') {
        return _.uniq([...a, ...b]);
      }

      // Fall back to default merging
      return undefined;
    },
    customizeObject(a, b, key) {
      if (key === 'module') {
        // Custom merging
        return _.merge({}, a, b);
      }

      // Fall back to default merging
      return undefined;
    }
  }
)(object1, object2, object3, ...);
```

### **`merge.unique(<field>, <fields>, field => field)`**

```javascript
const output = merge({
  customizeArray: merge.unique(
    'plugins',
    ['HotModuleReplacementPlugin'],
    plugin => plugin.constructor && plugin.constructor.name
  )
})({
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}, {
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});

// Output contains only single HotModuleReplacementPlugin now.
```

## Merging with Strategies

### **`merge.strategy({ <field>: '<prepend|append|replace>''})(...configuration | [...configuration])`**

Given you may want to configure merging behavior per field, there's a strategy variant:

```javascript
// Merging with a specific merge strategy
var output = merge.strategy(
  {
    entry: 'prepend', // or 'replace', defaults to 'append'
    'module.loaders': 'prepend'
  }
)(object1, object2, object3, ...);
```

### **`merge.smartStrategy({ <key>: '<prepend|append|replace>''})(...configuration | [...configuration])`**

The same idea works with smart merging too (described below in greater detail).

```javascript
var output = merge.smartStrategy(
  {
    entry: 'prepend', // or 'replace'
    'module.loaders': 'prepend'
  }
)(object1, object2, object3, ...);
```

## Smart Merging

### **`merge.smart(...configuration | [...configuration])`**

*webpack-merge* tries to be smart about merging loaders when `merge.smart` is used. Loaders with matching tests will be merged into a single loader value.

Note that the logic picks up webpack 2 `rules` kind of syntax as well. The examples below have been written in webpack 1 syntax.

**package.json**

```json5
{
  "scripts": {
    "start": "webpack-dev-server",
    "build": "webpack"
  },
  // ...
}
```

**webpack.config.js**

```javascript
var path = require('path');
var merge = require('webpack-merge');

var TARGET = process.env.npm_lifecycle_event;

var common = {
  entry: path.join(__dirname, 'app'),
  ...
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
    ],
  },
};

if(TARGET === 'start') {
  module.exports = merge(common, {
    module: {
      // loaders will get concatenated!
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel?stage=1',
          include: path.join(ROOT_PATH, 'app'),
        },
      ],
    },
    ...
  });
}

if(TARGET === 'build') {
  module.exports = merge(common, {
    ...
  });
}

...
```

**Loader string values `loader: 'babel'` override each other.**

```javascript
merge.smart({
  loaders: [{
    test: /\.js$/,
    loader: 'babel'
  }]
}, {
  loaders: [{
    test: /\.js$/,
    loader: 'coffee'
  }]
});
// will become
{
  loaders: [{
    test: /\.js$/,
    loader: 'coffee'
  }]
}
```

**Loader array values `loaders: ['babel']` will be merged, without duplication.**

```javascript
merge.smart({
  loaders: [{
    test: /\.js$/,
    loaders: ['babel']
  }]
}, {
  loaders: [{
    test: /\.js$/,
    loaders: ['coffee']
  }]
});
// will become
{
  loaders: [{
    test: /\.js$/,
    // appended because Webpack evaluated these from right to left
    // this way you can specialize behavior and build the loader chain
    loaders: ['babel', 'coffee']
  }]
}
```

**Loader query strings `loaders: ['babel?plugins[]=object-assign']` will be overridden**

```javascript
merge.smart({
  loaders: [{
    test: /\.js$/,
    loaders: ['babel?plugins[]=object-assign']
  }]
}, {
  loaders: [{
    test: /\.js$/,
    loaders: ['babel', 'coffee']
  }]
});
// will become
{
  loaders: [{
    test: /\.js$/,
    loaders: ['babel', 'coffee']
  }]
}
```

**Loader arrays in source values will have loader strings merged into them.**

```javascript
merge.smart({
  loaders: [{
    test: /\.js$/,
    loader: 'babel'
  }]
}, {
  loaders: [{
    test: /\.js$/,
    loaders: ['coffee']
  }]
});
// will become
{
  loaders: [{
    test: /\.js$/,
    // appended because Webpack evaluated these from right to left!
    loaders: ['babel', 'coffee']
  }]
}
```

**Loader strings in source values will always override.**

```javascript
merge.smart({
  loaders: [{
    test: /\.js$/,
    loaders: ['babel']
  }]
}, {
  loaders: [{
    test: /\.js$/,
    loader: 'coffee'
  }]
});
// will become
{
  loaders: [{
    test: /\.js$/,
    loader: 'coffee'
  }]
}
```

> Check out [SurviveJS - Webpack and React](http://survivejs.com/) to dig deeper into the topic.

## Development

1. `npm i`
2. `npm run watch`

Before contributing, please open an issue where to discuss.

## License

*webpack-merge* is available under MIT. See LICENSE for more details.
