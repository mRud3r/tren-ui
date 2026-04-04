import "@testing-library/jest-dom"

const originalError = console.error
beforeAll(() => {
	console.error = (...args: Parameters<typeof console.error>) => {
		if (typeof args[0] === 'string' && (
			args[0].includes('is using incorrect casing') ||
			args[0].includes('is unrecognized in this browser')
		)) return
		originalError(...args)
	}
})
afterAll(() => {
	console.error = originalError
})