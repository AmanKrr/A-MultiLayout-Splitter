function distributionHelper(newArray, change) {
    let i = 0;
    let hp = newArray.map((val) => [...val]); // Deep copy to avoid modifying the original
    let skip = 0;
    let nonSkip = newArray.length;
    while (change !== 0) {
        if (i === newArray.length) {
            i = 0;
        }
        if (skip >= nonSkip + 1) {
            return [[], false];
        }
        let val = hp[i];
        if (val[0] === val[1]) {
            skip++;
            i++;
            continue;
        }
        skip = 0;
        hp[i][0] -= 1;
        change--;
        i++;
    }
    return [hp, true];
}
export function sizeDistribution(targetArray, index, newValue, thresholds) {
    let new_array = [];
    let c = 0;
    targetArray.forEach((a, idx) => {
        if (a !== 0 && c !== index) {
            new_array.push([a, thresholds[idx]]);
        }
        c++;
    });
    let change = Math.abs(targetArray[index] - newValue);
    let new_value = distributionHelper(new_array.slice(), change);
    if (new_value[1] === false) {
        return new_value;
    }
    new_value = new_value[0];
    c = 0;
    targetArray.forEach((a, idx) => {
        if (a === 0 || c === index) {
            c++;
            return;
        }
        if (new_value.length === 0) {
            return;
        }
        let k = 0;
        while (thresholds[c] !== new_value[k][1] && k < new_value.length) {
            k++;
        }
        targetArray[c] = new_value[k][0];
        new_value.splice(k, 1);
        c++;
    });
    targetArray[index] = newValue;
    return [targetArray, true];
}
