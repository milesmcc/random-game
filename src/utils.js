/* eslint-disable no-unused-vars */

export function decumulate(numbers, start) {
    let intervals = [];
    let last = start;
    for (let number of numbers) {
        intervals.push(number - last);
        last = number;
    }
    return intervals;
}

export function distances(numbers) {
    let distances = [];
    let last = numbers[0];

    for (let i = 1; i < numbers.length; i++) {
        distances.push(Math.abs(numbers[i] - last));
        last = numbers[i];
    }

    return distances;
}

// Discrete only
const uniformCMF = (a, b, x) => (x - a + 1) / (b - a);
const sampleUniform = (a, b) => (a + Math.floor(Math.random() * (b - a)));
const sampleDist = (a, b) => Math.abs(sampleUniform(a, b) - sampleUniform(a, b));


const uniformPMF = (a, b, x) => {
    if (x < 0 || x > b) {
        return 0;
    }
    return (1 / (b - a + 1));
};

const diffPMF = (a, b, x) => {
    let sum = 0;
    for(let n = a; n <= b; n++) {
        sum += uniformPMF(a, b, n) * uniformPMF(a, b, n - x);
    }
    return sum;
}

const distPMF = (a, b, x) => {
    if (x < 0 || x > b) {
        return 0;
    }
    if(x === 0) {
        return diffPMF(a, b, 0);
    }
    return diffPMF(a, b, x) + diffPMF(a, b, -1 * x);
}

const distCMF = (a, b, x) => {
    let sum = 0;
    for(let n = a; n <= x; n++) {
        sum += distPMF(a, b, n);
    }
    return sum;
};

/* Function: ksStatTheshold
 * ------------------------
 * Calculate the K-S statistic value that, if used as a threshold for
 * determining fit, would only exlude true fits with probability `pVal`.
 */
function ksStatTheshold(pVal, n, sampleFunc, cmf) {
    const N_TRIALS = 10000;

    // Run many simulations
    let results = [];
    for(let i = 0; i < N_TRIALS; i++) {
        let sample = Array.from({length: n}, sampleFunc);
        let ksStat = kolmogorovSmirnov(sample, cmf);
        results.push(ksStat);
    }

    // Find the K-S test value that would only exclude `pVal` of results. 
    results.sort((a, b) => a - b);
    return results[Math.floor((1 - pVal) * results.length)];
}

function kolmogorovSmirnov(points, cmf) {
    let supremum = 0;
    points.sort((a, b) => a - b);
    let dist = counts(points);

    let max = points[points.length - 1];

    let totalSoFar = 0.0;
    for (let x = 0; x <= max; x++) {
        totalSoFar += dist[x] || 0;
        let cumulative = totalSoFar / points.length;
        let diff = Math.abs(cumulative - cmf(x));
        if (diff > supremum) {
            supremum = diff;
        }
    }

    return supremum;
}

function counts(nums) {
    let out = {};
    for (let num of nums) {
        if (num in out) {
            out[num] += 1;
        } else {
            out[num] = 1;
        }
    }
    return out;
}

function factorial(n) {
    if (n == 0) {
        return 1;
    }
    let x = n;
    for(let i = 1; i < n; i++) {
        x *= i;
    }
    return x;
}

export function probOfUniform(min, max, vals) {
    let n = max - min + 1;
    let nCounts = counts(vals);

    let x = factorial(vals.length);
    for(let i = min; i <= max; i++) {
        console.log(`dividing ${x} by ${nCounts[i] || 0}`)
        x /= factorial(nCounts[i] || 0);
    }

    return x * ((1 / n) ** vals.length);
}

export function howRandom(nums, pVal) {
    let absThreshold = ksStatTheshold(pVal, nums.length, () => sampleUniform(0, 9), x => uniformCMF(0, 9, x));
    let distThreshold = ksStatTheshold(pVal, nums.length, () => sampleDist(0, 9), x => distCMF(0, 9, x));

    let numDistances = distances(nums);

    let ksAbsolute = kolmogorovSmirnov(nums, x => uniformCMF(0, 9, x));
    let ksDistances = kolmogorovSmirnov(numDistances, x => distCMF(0, 9, x));

    return {
        absThreshold,
        distThreshold,
        numDistances,
        ksAbsolute,
        ksDistances,
        ksAbsoluteVerdict: ksAbsolute <= absThreshold,
        ksDistanceVerdict: ksDistances <= distThreshold
    }
}

/* eslint-enable no-unused-vars */