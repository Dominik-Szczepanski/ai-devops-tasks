function findPairsOptimized(arr, targetSum) {
  const pairs = [];
  const seenCounts = new Map();

  for (const num of arr) {
    const complement = targetSum - num;
    const complementCount = seenCounts.get(complement) || 0;

    for (let i = 0; i < complementCount; i++) {
      pairs.push([complement, num]);
    }

    seenCounts.set(num, (seenCounts.get(num) || 0) + 1);
  }

  return pairs;
}

module.exports = { findPairsOptimized };
