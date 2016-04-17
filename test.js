/* eslint-env mocha */
/* eslint "require-jsdoc": 0 */

var assert = require('assert');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var codec = require('./');
var encode = codec.encode;
var decode = codec.decode;

/* eslint-disable quote-props */
describe('encode', function() {
  function _it(title, input, output) {
    it(title, function() {
      var result = encode(input);
      assert.deepEqual(output, result);
      assert.equal(JSON.stringify(output), JSON.stringify(result));
    });
  }

  _it('#1', {
    w: 123,
    $and: [
      {
        a: {
          d: 2
        }
      },
      {
        v: {
          b: {
            n: 6
          }
        },
        a: {
          s: {
            d: {
              f: {
                g: {
                  h: 7
                }
              }
            }
          }
        }
      }
    ],
    t: {
      r: {
        e: 15
      }
    },
    a: {
      b: 10,
      c: {
        g: 1,
        f: 2,
        b: 13,
        r: {
          c: {
            c: {
              a: {
                b: {
                  r: '56fbb3412b19d5de107831a1'
                }
              }
            }
          }
        }
      }
    },
    b: {
      d: [
        {
          a: 12
        },
        {
          f: {
            g: 5
          }
        }
      ],
      c: [
        {
          a: 22,
          f: {
            g: 3
          },
          h: {
            $eq: 98
          },
          o: {
            $in: [1, 2, 3, 4, 5]
          }
        }
      ]
    }
  }, {
    w: 123,
    $and: [
      {
        'a.d': 2
      },
      {
        'v.b.n': 6,
        'a.s.d.f.g.h': 7
      }
    ],
    't.r.e': 15,
    'a.b': 10,
    'a.c.g': 1,
    'a.c.f': 2,
    'a.c.b': 13,
    'a.c.r.c.c.a.b.r': '56fbb3412b19d5de107831a1',
    'b.d': [
      {
        a: 12
      },
      {
        'f.g': 5
      }
    ],
    'b.c': [
      {
        a: 22,
        'f.g': 3,
        h: {
          $eq: 98
        },
        o: {
          $in: [1, 2, 3, 4, 5]
        }
      }
    ]
  });

  _it(
    '#2',
    {$and: [{a: {$eq: 6}}, {a: {$in: [1, 2, 3]}}]},
    {$and: [{a: {$eq: 6}}, {a: {$in: [1, 2, 3]}}]}
  );

  _it(
    '#3',
    {$and: [{tags: {$in: ['Baylee']}}]},
    {$and: [{tags: {$in: ['Baylee']}}]}
  );

  _it(
    '#4',
    {$and: [{platformSupport: {$in: ['windows']}}]},
    {$and: [{platformSupport: {$in: ['windows']}}]}
  );

  _it(
    '#5',
    {subdoc: {doc: {$and: [{name: 'name1'}, {name: 'name2'}, {name: 'name3'}]}}},
    {'subdoc.doc': {$and: [{name: 'name1'}, {name: 'name2'}, {name: 'name3'}]}}
  );

  _it(
    '#6',
    {$and: [{$text: {$search: 'Possimus'}}]},
    {$and: [{$text: {$search: 'Possimus'}}]}
  );

  _it(
    '#7',
    {$and: [{tags: {$in: ['Jeanie']}}]},
    {$and: [{tags: {$in: ['Jeanie']}}]}
  );

  _it(
    '#8',
    {$and: [{'options.opt2': {$regex: 'val.*', $options: 'i'}}]},
    {$and: [{'options.opt2': {$regex: 'val.*', $options: 'i'}}]}
  );

  _it(
    '#9',
    {$and: [{path: {$text: {$search: 'Non'}}}]},
    {$and: [{path: {$text: {$search: 'Non'}}}]}
  );

  _it(
    '#10',
    {
      _id: ObjectId('5099803df3f4948bd2f98391'),
      name: {first: 'Alan', last: 'Turing'},
      birth: new Date('Jun 23, 1912'),
      death: new Date('Jun 07, 1954'),
      contribs: ['Turing machine', 'Turing test', 'Turingery'],
      views: 1250000
    },
    {
      _id: ObjectId('5099803df3f4948bd2f98391'),
      'name.first': 'Alan',
      'name.last': 'Turing',
      birth: new Date('Jun 23, 1912'),
      death: new Date('Jun 07, 1954'),
      contribs: ['Turing machine', 'Turing test', 'Turingery'],
      views: 1250000
    }
  );

  _it(
    '#11',
    {$and: [{path: {sub: {sub: 'Iusto', sub2: 'Val'}}}]},
    {$and: [{'path.sub.sub': 'Iusto', 'path.sub.sub2': 'Val'}]}
  );
});

describe('decode', function() {
  var obj = new ObjectId();

  function _it(title, input, output) {
    it(title, function() {
      var result = decode(input);
      assert.deepEqual(output, result);
      assert.equal(JSON.stringify(output), JSON.stringify(result));
    });
  }

  _it(
    '#1',
    {
      w: 123,
      't.r.e': 15,
      a: {
        b: 10
      },
      'a.c': {
        g: 1,
        f: 2
      },
      'a.c.b': 13,
      'a.c.r': {
        'c.c': {
          'a.b': {
            r: obj
          }
        }
      },
      'b.d': [
        {
          a: 12
        },
        {
          'f.g': 5
        }
      ],
      'b.c': [
        {
          a: 22,
          'f.g': 3
        }
      ]
    },
    {
      w: 123,
      t: {
        r: {
          e: 15
        }
      },
      a: {
        b: 10,
        c: {
          g: 1,
          f: 2,
          b: 13,
          r: {
            c: {
              c: {
                a: {
                  b: {
                    r: obj
                  }
                }
              }
            }
          }
        }
      },
      b: {
        d: [
          {
            a: 12
          },
          {
            f: {
              g: 5
            }
          }
        ],
        c: [
          {
            a: 22,
            f: {
              g: 3
            }
          }
        ]
      }
    }
  );

  _it(
    '#2',
    {$and: [{tags: {$in: ['Nettie']}}]},
    {$and: [{tags: {$in: ['Nettie']}}]}
  );

  _it(
    '#3',
    {$and: [{platformSupport: {$in: ['windows']}}]},
    {$and: [{platformSupport: {$in: ['windows']}}]}
  );

  _it(
    '#4',
    {subdoc: {doc: {$and: [{name: 'name1'}, {name: 'name2'}, {name: 'name3'}]}}},
    {subdoc: {doc: {$and: [{name: 'name1'}, {name: 'name2'}, {name: 'name3'}]}}}
  );

  _it(
    '#5',
    {$and: [{tags: {$in: ['Jeanie']}}]},
    {$and: [{tags: {$in: ['Jeanie']}}]}
  );

  _it(
    '#6',
    {$and: [{'path.$text': {$search: 'Iusto'}}, {'path.$text': {$search: 'Iusto'}}]},
    {$and: [{path: {$text: {$search: 'Iusto'}}}, {path: {$text: {$search: 'Iusto'}}}]}
  );

  _it(
    '#7',
    {$and: [{'path.sub': {sub: 'Iusto'}, 'path.sub.sub2': 'Val'}]},
    {$and: [{path: {sub: {sub: 'Iusto', sub2: 'Val'}}}]}
  );
});
