// https://adventofcode.com/2023/day/3
const events = require('events');
const fs = require('fs');
const readline = require('readline');

const file = process.argv[2] || './input.txt'

// Checks if at least one of the neighbours of a number is a symbol
// Example (stars are possible neighbours):
// ....*****....
// ....*123*....
// ....*****....
function hasNeighbour(input, line, column, numberLength) {
    for (let i = Math.max(0, line-1); i <= Math.min(input.length - 1, line+1); i++) {
        const row = input[i]
        for (let columnCandidateStr in row) {
            let columnCandidate = Number(columnCandidateStr)
            if ((columnCandidate >= column -1) && (columnCandidate <= Number(column) + numberLength)) {
                const value = input[i][columnCandidate]
                if (typeof value === 'string') return true
            }
        }
    }
    return false
}

// For every number, check if it has a symbol as a neighbour, and then sum the numbers that do
function partOne(input) {
    let total = 0
    for (let line = 0 ; line < input.length ; line++) {
        for (let column in input[line]) {
            const value = input[line][column]
            
            if (typeof value === 'number') {
                const numberLength = String(value).length
                
                const neighbours = hasNeighbour(input, line, column, numberLength)
                if (neighbours) total += value
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
    const result = partOne(lines)

    console.log(result)
}

run()