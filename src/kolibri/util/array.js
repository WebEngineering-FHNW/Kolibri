// todo: jsdoc

export {
    // there is nothing to export since we only augment the prototypes
}

const arrayEq = arrayA => arrayB =>
    arrayA.length === arrayB.length && arrayA.every( (it, idx) => it === arrayB[idx])

Array.prototype.eq = function(array) { return arrayEq(this)(array);}


const removeAt = array => index => array.splice(index, 1);

Array.prototype.removeAt = function(index){ return removeAt(this)(index); };

const removeItem = array => item => {
    const i = array.indexOf(item);
    if (i >= 0) {
        return removeAt(array)(i);
    }
    return [];
};

Array.prototype.removeItem = function(item){ return removeItem(this)(item); };

const timesFunction = function (callback) {
    const number = Number(this.valueOf());
    if (isNaN(number)) {
        throw new TypeError("Object '" + this + "' is not a valid number");
    }
    return Array.from({length: number}, (it, idx) => callback ? callback(idx) : idx);
};

String.prototype.times = timesFunction;
Number.prototype.times = timesFunction;

const sum = function (callback = Number) {
    return this.reduce( (acc, cur, idx) => acc + callback(cur, idx), 0);
}

Array.prototype.sum = sum;
