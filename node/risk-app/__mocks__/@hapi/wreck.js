const wreck = jest.createMockFromModule('@hapi/wreck')

wreck.defaults.mockImplementation(() => wreck)

module.exports = wreck
