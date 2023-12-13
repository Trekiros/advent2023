// https://adventofcode.com/2023/day/4
const events = require('events');
const fs = require('fs');
const readline = require('readline');

const file = process.argv[2] || './input.txt'

function partOne(input) {
    let result = 0

    for (let line of input) {
        const { cardId, winning, bet } = line

        // Count matching numbers, for each number double the score
        let cardResult = 0
        bet.forEach(betValue => {
            if (!winning[betValue]) return;

            if (!cardResult) cardResult = 1
            else cardResult *= 2
        })
        console.log(cardId, ': ', cardResult)
        result += cardResult
    }
    
    return result
}

// Transforms the string into an object that is easier to manipulate
// type Card = { cardId: number, winning: {[num: number]: true}, bet: number[] }
function parseLine(line) {
    const [card, numbers] = line.split(': ')
    
    const [_, id] = card.split(/\s+/g)
    const cardId = Number(id)

    const [winningStr, betStr] = numbers.split(' | ')
    const bet = betStr.split(/\s+/g).map(Number)

    const winning = {}
    winningStr.split(/\s+/g).forEach(win => { winning[win] = true })

    return { cardId, winning, bet }
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