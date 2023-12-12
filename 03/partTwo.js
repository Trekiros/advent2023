// https://adventofcode.com/2023/day/3#part2
const events = require('events');
const fs = require('fs');
const readline = require('readline');

const file = process.argv[2] || './input.txt'

// Returns the list of number neighbours of a star
// Example:
// 123...456
// ...*...2.
// ....456..
// Should return 123 (despite the fact its column is 3 lower than the star's) and 456
function getNeighbours(input, line, column) {
    const neighbours = []
    for (let i = Math.max(0, line-1); i <= Math.min(input.length - 1, line+1); i++) {
        const row = input[i]
        for (let columnCandidateStr in row) {
            let columnCandidate = Number(columnCandidateStr)
            const value = input[i][columnCandidate]
            if (typeof value === 'number') {
                const numberLength = String(value).length
                if ((columnCandidate >= column - numberLength) && (columnCandidate <= Number(column) + 1)) {
                    neighbours.push(value)
                }
            }
        }
    }
    return neighbours
}

// For every star, find if it has exactly two number neighbours. If it has, multiply the neighbours and return the sum of the products
function partTwo(input) {
    let total = 0
    for (let line = 0 ; line < input.length ; line++) {
        for (let column in input[line]) {
            const value = input[line][column]
            
            if (value === '*') {                
                const neighbours = getNeighbours(input, line, column)
                if (neighbours.length === 2) total += neighbours[0] * neighbours[1]
            }
        }
    }
    return total
}

// Transforms the string into an object that is easier to manipulate
// type Line = {[column: number]: number|char}
function parseLine(line) {
    const result = {}
    Array.from(line.matchAll(/(\d+|[^\.])/g)) // Matches all numbers and symbols other than a dot
        .forEach(match => {
            const column = match.index
            
            const valueStr = match[0]
            const valueNum = Number(valueStr)
            const value = Number.isNaN(valueNum) ? valueStr : valueNum

            return { column, value }
        })
    
    return result
}

// Read file line by line without loading it in memory, in case it's too big.
async function run() {
    const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity })
    
    // Parse whole file
    const lines = []
    rl.on('line', (line) => lines.push(parseLine(line)))
    await events.once(rl, 'close');
    
    // Calculate result
    const result = partTwo(lines)

    console.log(result)
}

run()