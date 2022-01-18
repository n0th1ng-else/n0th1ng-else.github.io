export class Logger {
	constructor(prefix) {
		this.prefix = prefix;
	}

	writeOutput(...messages) {
		// eslint-disable-next-line no-console
		console.log(`[${this.prefix}]`, ...messages);
	}

	writeWarning(...messages) {
		// eslint-disable-next-line no-console
		console.log(`[${this.prefix}]`, ...messages);
	}

	writeError(...messages) {
		// eslint-disable-next-line no-console
		console.error(`[${this.prefix}]`, ...messages);
	}
}
