const outputPath = './list.txt'

const fs = require('fs')

let finalList = []

// Parse adjectives
const adjectives = fs.readFileSync('./Wordlist-Adjectives-All.txt')
  .toString()
  .split('\n')
  .filter(adj => adj.length >= 4 && adj.length <= 15)
  .map(adj => adj.toUpperCase())
finalList.push(...adjectives)

// Parse nouns
const nouns = fs.readFileSync('./Wordlist-Nouns-All.txt')
  .toString()
  .split('\n')
  .filter(noun => noun.length >= 5 && noun.length <= 13)
  .map(noun => noun.toUpperCase())
finalList.push(...nouns)

// Parse verbs
const verbs = fs.readFileSync('./Wordlist-Verbs-All.txt')
  .toString()
  .split('\n')
  .map(verb => verb.toUpperCase())
  .filter(verb => verb.indexOf('ING') === verb.length - 3 && verb.length > 3 && verb.length <= 15)
finalList.push(...verbs)

// Polish finalList and save to disk
// Most of the time is probably spent in this filter
// could be optimized with Set instead of Array
// not gonna bother (for now)
finalList = finalList.filter((word, idx) => finalList.indexOf(word) === idx)
finalList = shuffle(finalList)

fs.writeFileSync(outputPath, finalList.join('\n'))

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}