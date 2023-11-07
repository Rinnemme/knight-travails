class space {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.position = `${this.alpha(this.x)}-${this.y+1}`
        this.leftUp = null
        this.upLeft = null
        this.upRight = null
        this.rightUp = null
        this.rightDown = null
        this.downRight = null
        this.downLeft = null
        this.leftDown = null
        this.moves = []
        this.previous = null
    }

    alpha(x) {
        if (x === 0) return 'A'
        if (x === 1) return 'B'
        if (x === 2) return 'C'
        if (x === 3) return 'D'
        if (x === 4) return 'E'
        if (x === 5) return 'F'
        if (x === 6) return 'G'
        if (x === 7) return 'H'
    }
}

const board = (() => {
    const spaces = []

    const find = (x,y) => {
        for (let i=0; i < 64; i++) {
            if (spaces[i].x === x && spaces[i].y === y) return spaces[i]
        }
    }

   const shortestValid = (arrayOfArrays, node) => {
        const filteredArray = arrayOfArrays.filter(array => array.includes(node))
        filteredArray.sort((a,b) => a.length > b.length ? + 1 : -1)
        return filteredArray[0]
   }

    for (let x = 0; x <= 7; x++) {
        for (let y = 7; y >= 0; y--) {
            const newSpace = new space(x,y)
            spaces.push(newSpace)
        }
    }
    for (let i = 0; i < 64; i++) {
        const x = spaces[i].x
        const y = spaces[i].y
        spaces[i].leftUp = ((x - 2) >= 0 && (y + 1) <= 7) ? find(x - 2, y + 1) : null
        spaces[i].upLeft = ((x - 1) >= 0 && (y + 2) <= 7) ? find(x - 1, y + 2) : null
        spaces[i].upRight = ((x + 1) <= 7 && (y + 2) <= 7) ? find(x + 1, y + 2) : null
        spaces[i].rightUp = ((x + 2) <= 7 && (y + 1) <= 7) ? find(x + 2, y + 1) : null
        spaces[i].rightDown = ((x + 2) <= 7 && (y - 1) >= 0) ? find(x + 2, y - 1) : null
        spaces[i].downRight = ((x + 1) <= 7 && (y - 2) >= 0) ? find(x + 1, y - 2) : null
        spaces[i].downLeft = ((x - 1) >= 0 && (y - 2) >= 0) ? find(x - 1, y - 2) : null
        spaces[i].leftDown = ((x - 2) >= 0 && (y - 1) >= 0) ? find(x - 2, y - 1) : null
        spaces[i].moves = [spaces[i].leftUp, spaces[i].upLeft, spaces[i].upRight, spaces[i].rightUp, 
                        spaces[i].rightDown, spaces[i].downRight, spaces[i].downLeft, spaces[i].leftDown]
    }

    const shortestPath = (start, end) => {
        const queue = []
        const visited = []
        queue.push(start)
        while (!visited.includes(end)) {
            if (!visited.includes(queue[0])) {
                visited.push(queue[0])
                queue[0].moves.forEach(move => {
                    if (move !== null && !visited.includes(move)) {
                        if(visited.includes(end)) return
                        move.previous = queue[0]
                        queue.push(move)
                    }
                })
                queue.shift()
            } else queue.shift()
        }
        const path = [end]
        while (!path.includes(start)) {
            path.unshift(path[0].previous)
        }
        let resultString = `You can get there in ${path.length-1} moves! The path to follow is [`
        path.forEach(space => {resultString += `${space.position} -> `})
        resultString = resultString.substring(0,resultString.length-4)
        resultString += ']'
        console.log(resultString)
        return resultString
    }
    return {spaces, find, shortestPath}
})()

const displayBoard = document.getElementById('board')

let knightStart = null
let knightStartElement = null
let knightStartColor = null
let knightEnd = null
let knightEndElement = null
let knightEndColor = null

const setPath = (element) => {
    if (knightStart === null) {
        setKnightStart(element)
    } else if (knightStart !== null && knightEnd === null) {
        setKnightEnd(element)
        board.shortestPath(knightStart, knightEnd)
    } else if (knightStart !== null && knightEnd !== null) {
        resetStartAndEnd()
        setKnightStart(element)
    }
}

const setKnightStart = (element) => {
    knightStart = board.find(+element.getAttribute('x'), +element.getAttribute('y'))
    knightStartElement = element
    knightStartColor = element.style.backgroundColor
    element.style.backgroundColor = 'green'
} 

const setKnightEnd = (element) => {
    knightEnd = board.find(+element.getAttribute('x'), +element.getAttribute('y'))
    knightEndElement = element
    knightEndColor = element.style.backgroundColor
    element.style.backgroundColor = 'red'
}

const resetStartAndEnd = () => {
    knightStartElement.style.backgroundColor = knightStartColor
    knightEndElement.style.backgroundColor = knightEndColor
    knightStart = null
    knightStartElement = null
    knightStartColor = null
    knightEnd = null
    knightEndElement = null
    knightEndColor = null
}

const display = (() => {

    let spaceColor = 'rgb(255,255,255)'
    for (let y = 7; y >= 0; y--) {
        for (let x = 0; x <= 7; x++) {
            const newSpace = document.createElement('div')
            newSpace.classList.add('space')
            newSpace.setAttribute('x', x)
            newSpace.setAttribute('y', y)
            newSpace.onclick = function() {setPath(this)}
            newSpace.style.backgroundColor = spaceColor
            displayBoard.appendChild(newSpace)
            spaceColor = spaceColor === 'rgb(255,255,255)' ? 'rgb(30,30,30)' : 'rgb(255,255,255)'
            if (x === 7) spaceColor = spaceColor === 'rgb(255,255,255)' ? 'rgb(30,30,30)' : 'rgb(255,255,255)'
        }
    }
})()