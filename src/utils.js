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
        distances.push(Math.sqrt((numbers[i][0] - last[0]) ** 2 + (numbers[i][1] - last[1]) ** 2));
        last = numbers[i];
    }

    return distances;
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

const expCDF = (lambda, x) => 1 - Math.exp(-1 * lambda * x);

function andersonStatistic(sortedData, testCDF) {
    let n = sortedData.length;

    let s = 0;
    for (let idx = 0; idx < n; idx++) {
        let i = idx + 1; // to match standard form
        let y = sortedData[idx];
        // is this lambda-specific?
        s += ((2 * i - 1) / n) * (Math.log(testCDF(y)) + Math.log(1 - testCDF(sortedData[n - i])));
    }

    return Math.sqrt((-1) * s - n);
}

function kolmogorovSmirnov(points, lambda) {
    let supremum = 0;
    points.sort((a, b) => a - b);
    let dist = counts(points);

    let max = points[points.length - 1];

    let totalSoFar = 0.0;
    for (let x = 0; x <= max; x++) {
        totalSoFar += dist[x] || 0;
        let cumulative = totalSoFar / points.length;
        let diff = Math.abs(cumulative - expCDF(lambda, x));
        if (diff > supremum) {
            supremum = diff;
        }
    }

    return supremum;
}

export function ksVerdict(statistic, n) {
    // Positive values indicate different distributions at 5% significance
    const sqrt = Math.sqrt(n);

    return statistic - (1.731 / sqrt);
}

export function howRandom(points) {
    /* The dots are precisely a poisson point process, so the distance between
       them should follow the Exponential distribution.
    */

    let xPoints = points.map(l => l[0]).sort((a, b) => a - b);
    let yPoints = points.map(l => l[1]).sort((a, b) => a - b);
    let pointDistances = distances(points);

    let xIntervalDist = decumulate(xPoints, 0);
    let yIntervalDist = decumulate(yPoints, 0);

    let lambda = points.length / 300;

    let ksX = kolmogorovSmirnov(xIntervalDist, lambda);
    let ksY = kolmogorovSmirnov(yIntervalDist, lambda);

    let ksVerdictX = ksVerdict(ksX, points.length);
    let ksVerdictY = ksVerdict(ksY, points.length);

    let andersonX = andersonStatistic(xPoints, x => expCDF(lambda, x));
    let andersonY = andersonStatistic(yPoints, x => expCDF(lambda, x))

    return {
        ksX,
        ksY,
        ksVerdictX,
        ksVerdictY,
        andersonX,
        andersonY,
        pointDistances
    }
}