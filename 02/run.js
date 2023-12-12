// https://adventofcode.com/2023/day/2
const events = require('events');
const fs = require('fs');
const readline = require('readline');

const file = process.argv[2] || './input.txt'

const max = {
    red: 12,
    green: 13,
    blue: 14
}

// type Pull = { [color: string]: number }
function partOneCheck(pulls) {
    for (let pull of pulls) {
        for (let color in pull) {
            if (max[color] < pull[color]) return false
        }
    }

    return true
}

function partTwoPowerCalc(pulls) {
    // 1. Calculate the minimum possible number of balls for each color
    const minimums = {}

    for (let pull of pulls) {
        for (let color in pull) {
            const count = pull[color]

            minimums[color] = Math.max(count, minimums[color] || 0)
        }
    }

    // Calculate the power of the bag
    let power = 1
    for (let color in minimums) {
        power *= minimums[color]
    }
    return power
}

// Transforms the string into an object that is easier to manipulate
function parseLine(line) {
    const [game, gameResults] = line.split(': ')
    const [_, gameIdStr] = game.split(' ')
    const gameId = Number(gameIdStr)

    const pullsStr = gameResults.split('; ')
        .map(pull => pull.split(', '))

    const pulls = []
    pullsStr.forEach(pullStr => {
        const pull = {}

        pullStr.forEach(str => {
            const [countStr, color] = str.split(' ')
            const count = Number(countStr)
            pull[color] = (pull[color] || 0) + count
        })

        pulls.push(pull)
    })

    return {gameId, pulls}
}

// Read file line by line without loading it in memory, in case it's too big.
async function run() {
    const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity })
    
    let result = 0
    rl.on('line', (line) => {
        const {gameId, pulls} = parseLine(line)

        // Part One
        //if (partOneCheck(pulls)) result += gameId

        // Part Two
        result += partTwoPowerCalc(pulls)
    })

    await events.once(rl, 'close');

    console.log(result)
}

run()