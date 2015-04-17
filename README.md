# EMERGET! STETS!

Stets is a node.js library to do statistical analysis of date based data sets.
This allows you get average etc. over the course of a month, week, year.

## Installation

YE KEN INSTELL STETS WIT NPN

```
npm install --save stets
```

## Usage

In all examples we assume that you loaded and constructed your Stets instance as
following:

```js
var Stets = require('stets')
  , stets = new Stets();
```

The `Stets` constructor can receive one argument which is used to configure the
instance. The follow options are accepted:

- `format` The format in which the supplied dates are stored. The format that we
  accept is the same format as Momentjs uses (as that is parsing our dates).
- `stats` Configuration for the `fast-stats` module that we wrap.

Now that we have fully configured `Stets` instance we can start adding data.

### Stets.push

We implement methods that are somewhat identical to arrays. So for adding data
you need to the `.push` method. The only difference is that we require
2 arguments. The first argument is the date of the stat and the second is the
value that needs to be stored.

```js
stets.push(new Date(), 1);
```

### Stets.unshift

Same above but it adds the stats to the beginning of internal set instead of at
the end of it.

```js
stets.unshift(require('moment')(), 424);
```

In this example we don't supply a `Date` instance but a moment instance, as that
is also supported.

### Stets.pop

Now that we've added data, we also need to be able to remove it. That is where
`stets.pop` comes it. It removes the item from the end of the internal set and
returns it the object that we stored.

The returned object contains `data` and `date` keys. `date` contains the
supplied date instance while `data` stores assigned data.

```js
stets.push(new Date(), 2);
var last = stets.pop();

console.log(last.data); // 2
```

### Stets.shift

Just the like `stets.pop` method, but it returns the first item that we've
added.

```js
stets.push(new Date(), 1);
stets.push(new Date(), 2);

var first = stets.shift();
console.log(first.data); // 1
```

### Stets.length

To see how many data points are currently store you can check the `.length`
property.

```js
console.log(stets.length); // 0
stets.push(new Date(), 1);
console.log(stets.length); // 1
```

### Stets.reset

If you want to start over fresh again, you can completely nuke all the stored
data using the `stets.reset` method.

```js
console.log(stets.length); // 0
stets.push(new Date(), 1);
console.log(stets.length); // 1
stets.reset();
console.log(stets.length); // 0
```

## License

MIT
