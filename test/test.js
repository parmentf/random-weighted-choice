/*jshint node:true, laxcomma:true */
/*global describe:true, it:true */
"use strict";

var debug = require("debug")("rwc:test");
var assert = require("assert");

var rwc = require("../src/random-weighted-choice");

var randomCounter = 0;
var randomValues = [0, 0.19, 0.5, 0.7, 0.9];
var randomMock = function (values, reset) {
  if (typeof values == "undefined") values = randomValues;
  if (typeof reset == "undefined") reset = false;
  if (reset) randomCounter = 0;
  return values[randomCounter++];
};

var table = [
  { weight: 1, id: "item1" }, // Element 1
  { weight: 1, id: "item2" }, // Element 2
  { weight: 4, id: "item3" }, // Element with a 4 times likelihood
  { weight: 2, id: "item4" }, // Element 4
  { weight: 2, id: "item5" },
];

describe("Temperature 50", function () {
  it('should return "item1"', function () {
    assert.equal("item1", rwc(table, undefined, randomMock));
  });
  it('should return "item2"', function () {
    assert.equal("item2", rwc(table, undefined, randomMock));
  });
  it('should return "item3"', function () {
    assert.equal("item3", rwc(table, undefined, randomMock));
  });
  it('should return "item4"', function () {
    assert.equal("item4", rwc(table, undefined, randomMock));
  });
  it('should return "item5"', function () {
    assert.equal("item5", rwc(table, undefined, randomMock));
  });
});

describe("Empty table", function () {
  it("should return null", function () {
    assert.equal(null, rwc([]));
  });
});

describe("One element", function () {
  it("should return the element", function () {
    assert.equal("a", rwc([{ weight: 1, id: "a" }]));
  });
});

describe("No weight", function () {
  it("should return null", function () {
    assert.equal(null, rwc([{ weight: 0, id: "a" }]));
  });
});

describe("No influence given", function () {
  it('should return "item1"', function () {
    randomCounter = 0;
    assert.equal("item1", rwc(table, undefined, randomMock, undefined));
  });
});

describe("Negative urgency", function () {
  it("should be nullified", function () {
    assert.equal("item1", rwc(table, 1000, randomMock));
  });
});

describe("Floating point urgency", function () {
  it("should return the only choice possible", function () {
    assert.equal(
      "item1",
      rwc([{ weight: 0.07692307692307693, id: "item1" }], 60)
    );
  });
});

module.exports.random = randomMock;
