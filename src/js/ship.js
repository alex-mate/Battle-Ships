class Ship {
    constructor(length, name) {
        if (!Number.isInteger(length) || length < 1 || length > 10) {
            throw new Error("Ship length must be an integer between 1 and 10");
        }
        this.length = length;
        this.name = name;
        this.hits = 0;
    }

    hit() {
        if (!this.isSunk()) this.hits++;
    }

    isSunk() {
        return this.hits >= this.length;
    }   
}


module.exports = Ship;