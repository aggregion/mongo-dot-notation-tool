# Mongo dot-notation tool [![Build Status](https://travis-ci.org/aggregion/mongo-dot-notation-tool.svg?branch=develop)](https://travis-ci.org/aggregion/mongo-dot-notation-tool)
Convert dot-notation to simple JS object and back.

_Install_
```bash
npm install mongo-dot-notation-tool --save
```

_Use_
```javascript
var dotNotationTool = require('mongo-dot-notation-tool');
```

## Methods
### encode
Convert JS object to mongo dot-notation object
#### Use
```javascript
dotNotationTool.encode({name: {last: 'Foo', first: 'Bar'}});
// returns: {'name.last': 'Foo', 'name.first': 'Bar'}

dotNotationTool.encode({$and: [{name: {last: 'Foo'}}, {position: 'CTO'}]});
// returns: {$and: [{'name.last': 'Foo'}, {position: 'CTO'}]}

dotNotationTool.encode({
  $and: [
    {
      $or: [
        {
          name: {
            last: 'Foo'
          }
        },
        {
          name: {
            last: 'Bar'
          }
        }
      ],
      position: 'CTO'
    ]
  }
});
/*
returns: {
  $and: [
    {
      $or: [
        {
          'name.last': 'Foo'
        },
        {
          'name.last': 'Bar'
        }
      ],
      position: 'CTO'
    ]
  }
}
*/
```

### decode
Convert mongo dot-notation object to JS object
#### Use
```javascript
dotNotationTool.decode({'name.last': 'Foo', 'name.first': 'Bar'});
// returns: {name: {last: 'Foo', first: 'Bar'}}

dotNotationTool.decode({$and: [{'name.last': 'Foo'}, {position: 'CTO'}]});
// returns: {$and: [{name: {last: 'Foo'}}, {position: 'CTO'}]}

dotNotationTool.decode({
  $and: [
    {
      $or: [
        {
          'name.last': 'Foo'
        },
        {
          'name.last': 'Bar'
        }
      ],
      position: 'CTO'
    ]
  }
});
/*
returns: {
  $and: [
    {
      $or: [
        {
          name: {
            last: 'Foo'
          }
        },
        {
          name: {
            last: 'Bar'
          }
        }
      ],
      position: 'CTO'
    ]
  }
}
*/
```

### Run tests
```bash
npm test
# or
npm i
./node_modules/.bin/mocha ./test.js
# or
npm i -g mocha
mocha ./test.js
```
