export class Logger {
	constructor(prefix) {
		this.prefix = prefix;
	}

	writeOutput(message) {
		// eslint-disable-next-line no-console
		console.log(`[${this.prefix}]`, message);
	}

	writeWarning(message) {
		// eslint-disable-next-line no-console
		console.log(`[${this.prefix}]`, message);
	}

	writeError(message) {
		// eslint-disable-next-line no-console
		console.error(`[${this.prefix}]`, message);
	}
}
