/* eslint-disable no-unused-vars */

// Calculate the distances between each pair of numbers in the given array
export function distances(numbers) {
    let distances = [];
    let last = numbers[0];

    for (let i = 1; i < numbers.length; i++) {
        distances.push(Math.abs(numbers[i] - last));
        last = numbers[i];
    }

    return distances;
}

// The discrete uniform CDF of `x` on the range [a, b]
const uniformCDF = (a, b, x) => (x - a + 1) / (b - a + 1);

// Sample the discrete uniform distribution on the range [a, b]
const sampleUniform = (a, b) => (a + Math.floor(Math.random() * (b - a + 1)));

// Sample the expected digit distance distribution on the range [a, b]
const sampleDist = (a, b) => Math.abs(sampleUniform(a, b) - sampleUniform(a, b));

// The discrete uniform PDF of `x` on the range [a, b]
const uniformPMF = (a, b, x) => {
    if (x < 0 || x > b) {
        return 0;
    }
    return (1 / (b - a + 1));
};

// The PMF of two discrete uniform random variables on the range [a, b] having a difference of `x` (signed)
const diffPMF = (a, b, x) => {
    let sum = 0;
    for (let n = a; n <= b; n++) {
        sum += uniformPMF(a, b, n) * uniformPMF(a, b, n - x);
    }
    return sum;
}

// The PMF of the digit distance distribution on the range [a, b]; this is essentially the absolute value of `diffPMF` with some bounds checking
export const distPMF = (a, b, x) => {
    if (x < 0 || x > b) {
        return 0;
    }
    if (x === 0) {
        return diffPMF(a, b, 0);
    }
    return diffPMF(a, b, x) + diffPMF(a, b, -1 * x);
}

// The CDF of the digit distance distribution on the range [a, b]
const distCDF = (a, b, x) => {
    let sum = 0;
    for (let n = a; n <= x; n++) {
        sum += distPMF(a, b, n);
    }
    return sum;
};

// Calculate the K-S statistic value that, if used as a threshold for
// determining fit, would only exlude true fits with probability `pVal`.
function ksStatTheshold(pVal, n, sampleFunc, cdf, min, max) {
    const N_TRIALS = 10000;

    // Run many simulations
    let results = [];
    for (let i = 0; i < N_TRIALS; i++) {
        let sample = Array.from({ length: n }, sampleFunc);
        let ksStat = kolmogorovSmirnov(sample, min, max, cdf);
        results.push(ksStat);
    }

    // Find the K-S test value that would only exclude `pVal` of results. 
    results.sort((a, b) => a - b);

    return [results[Math.floor((1 - pVal) * results.length)], results];
}

// Compute the Kolmogorov-Smirnov statistic for the given points on the given
// range with the given theorized CDF. The step size is assumed to be 1.
function kolmogorovSmirnov(points, min, max, cdf) {
    let supremum = 0;
    let sorted = points.filter(x => true).sort((a, b) => a - b);
    let dist = counts(sorted);

    let totalSoFar = 0.0;
    for (let x = min; x <= max; x++) {
        totalSoFar += dist[x] || 0;
        let cumulative = totalSoFar / sorted.length;
        let diff = Math.abs(cumulative - cdf(x));

        if (diff > supremum) {
            supremum = diff;
        }
    }

    return supremum;
}

// Compute the frequency of each particular value in the `nums` array.
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

// The factorial function!
function factorial(n) {
    if (n == 0) {
        return 1;
    }
    let x = n;
    for (let i = 1; i < n; i++) {
        x *= i;
    }
    return x;
}

// The probability of a uniform distribution taking on
// the values in `vals` (order is not considered).
export function probOfUniform(min, max, vals) {
    let n = max - min + 1;
    let nCounts = counts(vals);

    let x = factorial(vals.length);
    for (let i = min; i <= max; i++) {
        x /= factorial(nCounts[i] || 0);
    }

    return x * ((1 / n) ** vals.length);
}

// This is the primary entrypoint to the analysis. This function performs the K-S test
// simulations, then determines how well the given data matches the expected distributions.
// The `pVal` is used in determining the K-S stat theshold; see the writeup for more information.
export function howRandom(nums, pVal) {
    let numDistances = distances(nums);

    let [absThreshold, absKSSims] = ksStatTheshold(pVal, nums.length, () => sampleUniform(0, 9), x => uniformCDF(0, 9, x), 0, 9);
    let [distThreshold, distKSSims] = ksStatTheshold(pVal, numDistances.length, () => sampleDist(0, 9), x => distCDF(0, 9, x), 0, 9);

    let ksAbsolute = kolmogorovSmirnov(nums, 0, 9, x => uniformCDF(0, 9, x));
    let ksDistances = kolmogorovSmirnov(numDistances, 0, 9, x => distCDF(0, 9, x));

    let ksAbsoluteVerdict = ksAbsolute <= absThreshold;
    let ksDistanceVerdict = ksDistances <= distThreshold;

    return {
        absThreshold,
        distThreshold,
        absKSSims,
        distKSSims,
        numDistances,
        ksAbsolute,
        ksDistances,
        ksAbsoluteVerdict,
        ksDistanceVerdict,
        isHuman: !ksAbsoluteVerdict || !ksDistanceVerdict
    }
}

// Style constants for Plotly.
export const plotlyLayout = {
    plot_bgcolor: "#0b0f18",
    paper_bgcolor: "#0b0f18",
    yaxis: { color: "white" },
    xaxis: { color: "white" },
    legend: { font: { color: "white" } },
    title: { font: { color: "white" } }
};

/* eslint-enable no-unused-vars */