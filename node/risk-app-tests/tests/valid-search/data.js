const data = [
  { postcode: 'CW8 4BH', premises: '28', expectedResultCount: 1 },
  { postcode: 'CW8 4BH', premises: '28A', expectedResultCount: 1 },
  { postcode: 'E14 3JL', premises: 'Kelson House', expectedResultCount: 48 },
  { postcode: 'm15 5tn', premises: '298', expectedResultCount: 6 },
  { postcode: 'NE3 1RR', premises: '1', expectedResultCount: 1 },
  { postcode: 'NE3 1RR', premises: '26A', expectedResultCount: 1 },
  { postcode: 'NE3 1RR', premises: '26B', expectedResultCount: 1 },
  { postcode: 'M13 9PL', premises: 'uni', expectedResultCount: 1 },
  { postcode: 'CV4 7AL', premises: 'uni', expectedResultCount: 1 }
]

module.exports = data
