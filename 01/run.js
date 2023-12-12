// https://adventofcode.com/2023/day/1
const events = require('events');
const fs = require('fs');
const readline = require('readline');

const file = process.argv[2] || './input.txt'

const numbers = [ 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ]

// Find the first & last number in a string
function partOne(line) {
    let first = -1
    let last = 0
    
    for (let i = 0 ; i < line.length ; i++) {
        const n = Number(line.charAt(i))
        if (!Number.isNaN(n)) {
            if (first === -1) { first = n }
            last = n
        }
    }

    return first * 10 + last
}

// Same, but numbers can be spelled out
function partTwo(line) {
    // Index of the first/last number found
    let minIndex;
    let maxIndex;

    // Value of the first/last number found
    let minValue;
    let maxValue;

    // Iterate on every number, instead of on the characters in the string
    for (let i = 1 ; i < numbers.length; i++) {
        // 1. Find the first & last instance of this number within the string (taking into account that the number can be spelled out)
        let firstNum  = line.indexOf(i)
        let firstChar = line.indexOf(numbers[i])
        
        let lastNum   = line.lastIndexOf(i)
        let lastChar  = line.lastIndexOf(numbers[i])

        const first = (firstNum === -1) ? firstChar
            : (firstChar === -1) ? firstNum
            : Math.min(firstNum, firstChar)

        const last = Math.max(lastNum, lastChar)
        
        // 2. No number found => test the next possible number
        if (first === -1) {
            continue;
        }

        // 3. If this number's first/last instance comes before/after the current first/last number found, update the indices
        if ((minIndex === undefined) || (first < minIndex)) {
            minIndex = first
            minValue = i
        }
        if ((maxIndex === undefined) || (last > maxIndex)) {
            maxIndex = last
            maxValue = i
        }
    }

    return minValue * 10 + maxValue
}

// Read file line by line without loading it in memory, in case it's too big.
async function run() {
    const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity })
    
    let result = 0
    rl.on('line', (line) => {
        const value = partTwo(line)
        console.log(value)
        result += value
    })

    await events.once(rl, 'close');

    console.log(result)
}

run()