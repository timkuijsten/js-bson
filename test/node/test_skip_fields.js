'use strict';

var crypto = require('crypto');

var bson = require('../../lib/bson/index.js');
var BSON = new bson.BSONPure.BSON();

var deserializeOrig = require('../../lib/bson/parser/deserializer');
var deserializeSkip = require('../../lib/bson/parser/deserializerSkipFields');

var items, nritems;

function nitemSmall() {
  return {
    h: { id: crypto.randomBytes(2) },
    b: { 6: new Buffer(2) }
  };
}

var headIds = {};

// return 256 DAGs 
function nitemMedium() {
  var buf = crypto.randomBytes(6);

  var id = buf[0].toString(16);
  var v  = buf.toString('base64');

  var pa  = headIds[id] || [];

  headIds[id] = [v];

  var bSize = 100;
  var body = {
    0: new Buffer(bSize),
    '1': new Buffer(bSize),
    2: new Buffer(bSize),
    '3': new Buffer(bSize),
    '4': new Buffer(bSize),
    5: new Buffer(bSize),
    6: new Buffer(bSize),
    7: new Buffer(bSize),
    '8': new Buffer(bSize),
    '9': new Buffer(bSize)
  };
  return { h: { id: id, v: v, pa: pa }, b: body };
}

function nitemLarge() {
  var bSize = 10000;
  return {
    h: { id: crypto.randomBytes(2) },
    b: {
      0: new Buffer(bSize),
      '1': new Buffer(bSize),
      2: new Buffer(bSize),
      '3': new Buffer(bSize),
      '4': new Buffer(bSize),
      5: new Buffer(bSize),
      6: new Buffer(bSize),
      7: new Buffer(bSize),
      '8': new Buffer(bSize),
      '9': new Buffer(bSize)
    }
  };
}

function emptySkipFields() {
  console.log('serialize and deserialize items, with empty skipFields');
  console.time(' ');
  for (var i = 0; i < nritems; i++) {
    deserializeSkip(BSON.serialize(items[i]));
  }
  console.timeEnd(' ');
}

function origWithoutSkipFields() {
  console.log('serialize and deserialize items, without skipFields');
  console.time(' ');
  for (var i = 0; i < nritems; i++) {
    deserializeOrig(BSON.serialize(items[i]));
  }
  console.timeEnd(' ');
}

function skipFieldB() {
  console.log('serialize and deserialize items, skip field "b"');
  console.time(' ');
  for (var i = 0; i < nritems; i++) {
    deserializeSkip(BSON.serialize(items[i]), { skipFields: { b: true } });
  }
  console.timeEnd(' ');
}

function skipFieldA() {
  console.log('serialize and deserialize items, skip non-existing field "a"');
  console.time(' ');
  for (var i = 0; i < nritems; i++) {
    deserializeSkip(BSON.serialize(items[i]), { skipFields: { a: true } });
  }
  console.timeEnd(' ');
}

function skipField6() {
  console.log('serialize and deserialize items, skip field "6"');
  console.time(' ');
  for (var i = 0; i < nritems; i++) {
    deserializeSkip(BSON.serialize(items[i]), { skipFields: { 6: true } });
  }
  console.timeEnd(' ');
}

////////////////

var j;
nritems = 20000;

items = [];

console.log('\n ################\ncreating ' + nritems + ' small items...');
console.time(' ');
for (j = 0; j < nritems; j++) {
  items.push(nitemSmall());
}
console.timeEnd(' ');

for (j = 0; j < 3; j++) {
  console.log();
  origWithoutSkipFields();
  emptySkipFields();
  skipFieldB();
  skipFieldA();
  skipField6();
}


items = [];

console.log('\n ################\ncreating ' + nritems + ' medium items...');
console.time(' ');
for (j = 0; j < nritems; j++) {
  items.push(nitemMedium());
}
console.timeEnd(' ');

for (j = 0; j < 3; j++) {
  console.log();
  origWithoutSkipFields();
  emptySkipFields();
  skipFieldB();
  skipFieldA();
  skipField6();
}


items = [];

console.log('\n ################\ncreating ' + nritems + ' large items...');
console.time(' ');
for (j = 0; j < nritems; j++) {
  items.push(nitemLarge());
}
console.timeEnd(' ');

for (j = 0; j < 3; j++) {
  console.log();
  origWithoutSkipFields();
  emptySkipFields();
  skipFieldB();
  skipFieldA();
  skipField6();
}
