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

// const expCDF = (lambda, x) => 1 - Math.exp(-1 * lambda * x);

// Discrete only
const uniformCDF = (a, b, x) => (x - a + 1) / (b - a);
const sampleUniform = (a, b) => (a + Math.random() * (b - a));


function kolmogorovSmirnov(points, cdf) {
    let supremum = 0;
    points.sort((a, b) => a - b);
    let dist = counts(points);

    let max = points[points.length - 1];

    let totalSoFar = 0.0;
    for (let x = 0; x <= max; x++) {
        totalSoFar += dist[x] || 0;
        let cumulative = totalSoFar / points.length;
        let diff = Math.abs(cumulative - cdf(x));
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

export function howRandom(nums) {
    let numDistances = distances(nums);

    // let ksDistances = kolmogorovSmirnov(nums, x => expCDF(0, x)); // TODO: figure out distribution
    let ksAbsolute = kolmogorovSmirnov(nums, x => uniformCDF(0, 9, x));

    // let andersonDistances = andersonStatistic(nums, x => expCDF(0, x)); // TODO: figure out distribution
    // let andersonAbsolute = andersonStatistic(nums, x => uniformCDF(0, 9, x));

    return {
        // ksDistances,
        ksAbsolute,
        // andersonDistances,
        numDistances
    }
}