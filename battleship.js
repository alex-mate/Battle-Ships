const ship = () => {
    return {
        length: 0,
        hits: 0,
        isSunk: () => {
            return this.hits === this.length;
        }
    };
};