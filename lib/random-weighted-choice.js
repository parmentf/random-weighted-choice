/*jshint node:true, laxcomma:true */
"use strict";

var debug = require('debug')('rwc');

var RandomWeightedChoice = function (table, temperature, influence) {
  influence = influence || 2; // Seems fine, difficult to tune
  if (typeof(temperature)=="undefined") temperature =  50; // in [0,100], 50 is neutral
  debug('temperature', temperature);
  var T = (temperature - 50) / 50;

  var nb = table.length;
  if(!nb) return null; // No item given.

  var total = 0;
  table.forEach(function(element, index) {
    total += element.weight;
  });

  var avg = total / nb;
  debug('total', total);
  debug('nb', nb);
  debug('avg', avg);

  // Compute amplified urgencies (depending on temperature)
  var ur = {};
  var urgencySum = 0;
  table.forEach(function(element, index) {
    var urgency = element.weight + T * influence * (avg - element.weight);
    if (urgency < 0) urgency = 0;
    urgencySum += urgency;
    ur[element.id] = (ur[element.id] || 0 ) + urgency;
  });

  var cumulatedUrgencies = {};
  var currentUrgency = 0;
  Object.keys(ur).forEach(function(id, index) {
    currentUrgency += ur[id];
    cumulatedUrgencies[id] = currentUrgency;
  });

  if(urgencySum < 1) urgencySum = 1;

  // Choose
  var choice = Math.random() * urgencySum;

  debug('ur', ur);
  debug('cumulatedUrgencies', cumulatedUrgencies);
  debug('urgencySum', urgencySum);
  debug('choice', choice);

  var ids = Object.keys(cumulatedUrgencies);
  for(var i=0; i<ids.length; i++) {
    var id = ids[i];
    var urgency = cumulatedUrgencies[id];
    if(choice <= urgency) {
      debug('return', id);
      return id;
    }    
  }
};

module.exports = RandomWeightedChoice;