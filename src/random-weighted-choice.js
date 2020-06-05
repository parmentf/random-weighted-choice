const randomWeightedChoice = (
  table,
  temperature = 50, // in [0,100], 50 is neutral
  randomFunction = Math.random,
  influence = 2 // seems fine, hard to tune
) => {
  const T = (temperature - 50) / 50;
  const nb = table.length;
  if (!nb) {
    return null;
  }

  const total = table.reduce(
    (previousTotal, element) => previousTotal + element.weight,
    0
  );

  const avg = total / nb;

  // Compute amplified urgencies (depending on temperature)
  const ur = {};
  const urgencySum = table.reduce((previousSum, element) => {
    const { id, weight } = element;
    let urgency = weight + T * influence * (avg - weight);
    if (urgency < 0) urgency = 0;
    ur[id] = (ur[id] || 0) + urgency;
    return previousSum + urgency;
  }, 0);

  let currentUrgency = 0;
  const cumulatedUrgencies = {};
  Object.keys(ur).forEach((id) => {
    currentUrgency += ur[id];
    cumulatedUrgencies[id] = currentUrgency;
  });

  if (urgencySum <= 0) return null; // No weight given
  // Choose
  const choice = randomFunction() * urgencySum;
  const ids = Object.keys(cumulatedUrgencies);
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const urgency = cumulatedUrgencies[id];
    if (choice <= urgency) {
      return id;
    }
  }
};

module.exports = randomWeightedChoice;
