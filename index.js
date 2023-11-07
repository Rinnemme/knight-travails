class space {
    constructor(x,y) {
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
        this.moves = []
        this.previous = null
    }
}

const board = (() => {

    const spaces = []

    for (let x = 0; x <= 7; x++) {
        for (let y = 7; y >= 0; y--) {
            const newSpace = new space(x,y)
            spaces.push(newSpace)
        }
    }

    const find = (x,y) => {
        for (let i=0; i < 64; i++) {
            if (spaces[i].x === x && spaces[i].y === y) return spaces[i]
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
                    if (move !== null && !visited.includes(move) && !queue.includes(move)) {
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
        return path
    }

    return {find, shortestPath}
    
})()

const display = (() => {

    const displayBoard = document.getElementById('board')

    let spaceColor = 'rgb(255,255,255)'
    for (let y = 7; y >= 0; y--) {
        for (let x = 0; x <= 7; x++) {
            const newSpace = document.createElement('div')
            newSpace.classList.add('space')
            newSpace.setAttribute('x', x)
            newSpace.setAttribute('y', y)
            newSpace.setAttribute('id', `${x}-${y}`)
            newSpace.setAttribute('default-color', spaceColor)
            newSpace.style.backgroundColor = spaceColor
            newSpace.onclick = function() {setPath(this)}
            displayBoard.appendChild(newSpace)
            spaceColor = spaceColor === 'rgb(255,255,255)' ? 'rgb(30,30,30)' : 'rgb(255,255,255)'
            if (x === 7) spaceColor = spaceColor === 'rgb(255,255,255)' ? 'rgb(30,30,30)' : 'rgb(255,255,255)'
        }
    }

    let knightStart = null
    let knightEnd = null
    
    const setKnightStart = (element) => {
        knightStart = board.find(+element.getAttribute('x'), +element.getAttribute('y'))
        element.style.background = `url('img/start.png')`
        element.style.backgroundSize = 'cover'
    } 
    
    const setKnightEnd = (element) => {
        knightEnd = board.find(+element.getAttribute('x'), +element.getAttribute('y'))
        element.style.background = `url('img/end-${board.shortestPath(knightStart, knightEnd).length-1}.png')`
        element.style.backgroundSize = 'cover'
    }

    const displaySpace = (x,y) => {
        return document.getElementById(`${x}-${y}`)
    }
    
    const highlightPath = () => {
        pathArray = board.shortestPath(knightStart, knightEnd)
        pathArray.pop()
        pathArray.shift()
        let step = 1
        pathArray.forEach(space => {
            const pathSpace = displaySpace(space.x, space.y)
            pathSpace.style.background = `url('img/${step}.png')`
            pathSpace.style.backgroundSize = 'cover'
            step++
        })
    }

    const resetBoardVisuals = () => {
        document.querySelectorAll('.space').forEach(space => {
            space.style.background = space.getAttribute('default-color')
        })
    }

    const resetStartAndEnd = () => {
        knightStart = null
        knightEnd = null
    }

    const setPath = (element) => {
        if (knightStart === null) {
            setKnightStart(element)
        } else if (knightStart !== null && knightEnd === null) {
            setKnightEnd(element)
            highlightPath()
        } else if (knightStart !== null && knightEnd !== null) {
            resetStartAndEnd()
            resetBoardVisuals()
            setKnightStart(element)
        }
    }

})()