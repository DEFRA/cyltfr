/**
 * This program reads `data.csv` and writes an
 * object map of custodian codes to country to
 * `../../server/models/custodian-codes.json`
 */

const fs = require('fs')
const path = require('path')
const file = fs.readFileSync(path.join(__dirname, 'data.csv'), 'utf-8')
const map = {}

file
  .split('\n')
  .filter(s => !!s)
  .map(s => s.split(','))
  .forEach(s => { map[s[0]] = s[3] })

fs.writeFileSync(path.join(__dirname, '../../server/models/custodian-codes.json'), JSON.stringify(map, null, 2), 'utf-8')
