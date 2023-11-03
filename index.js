class space {
    constructor(x,y) {
        this.position = [x,y]
        this.x = x
        this.y = y
        this.leftUp = null
        this.upLeft = null
        this.upRight = null
        this.rightUp = null
        this.rightDown = null
        this.downRight = null
        this.downLeft = null
        this.leftDown = null
    }
}

const board = (() => {
    const spaces = []

    const find = (x,y) => {
        for (let i=0; i < 49; i++) {
            if (spaces[i].x === x && spaces[i].y === y) return spaces[i]
        }
    }

    // const lowest = (array) {
    //     const lowestValue = null
    //     array.forEach(number)
    // }

    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 7; y++) {
            const newSpace = new space(x,y)
            spaces.push(newSpace)
        }
    }
    for (let i = 0; i < 49; i++) {
        const x = spaces[i].x
        const y = spaces[i].y
        spaces[i].leftUp = (x - 2 >= 0 && y + 1 <= 7) ? find(x-2,y+1) : null
        spaces[i].upLeft = (x - 1 >= 0 && y + 2 <= 7) ? find(x-1,y+2) : null
        spaces[i].upRight = (x + 1 <= 7 && y + 2 <= 7) ? find(x+1,y+2) : null
        spaces[i].rightUp = (x + 2 <= 7 && y + 1 <= 7) ? find(x+2,y+1) : null
        spaces[i].rightDown = (x + 2 <= 7 && y - 1 >= 0) ? find(x+2,y-1) : null
        spaces[i].downRight = (x + 1 <= 7 && y - 2 >= 0) ? find(x+1,y-2) : null
        spaces[i].downLeft = (x - 1 >= 0 && y - 2 >= 0) ? find(x-1,y-2) : null
        spaces[i].leftDown = (x - 2 >= 0 && y - 1 >= 0) ? find(x-2,y-1) : null
    }

    // const shortestPath = ([a,b], [c,d], start = find(a,b), end = find(c,d)) => {
    //     if (start === end) (return 0)

    // }
    return {spaces}
})()

