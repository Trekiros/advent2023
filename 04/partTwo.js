// https://adventofcode.com/2023/day/4
const events = require('events');
const fs = require('fs');
const readline = require('readline');

const file = process.argv[2] || './input.txt'

function partTwo(input) {
    for (let i = 0; i < input.length ; i++) {
        const { cardId, winning, bet, copies } = input[i]

        // For each matching number, draw a copy of a card in the sequence
        const matches = bet.filter(b => !!winning[b]).length
        for (let j = 0 ; j < matches ; j++) {
            input[i + j + 1].copies += copies
        }
    }
    
    return input.map(line => line.copies).reduce((a,b) => a+b, 0)
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

    return { cardId, winning, bet, copies: 1 }
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