export class Logger {
	/**
	 *
	 * @param prefix {string}
	 */
	constructor(prefix) {
		this.prefix = prefix;
	}

	/**
	 *
	 * @param messages {unknown[]}
	 */
	writeOutput(...messages) {
		// eslint-disable-next-line no-console
		console.log(`[${this.prefix}]`, ...messages);
	}

	/**
	 *
	 * @param messages {unknown[]}
	 */
	writeWarning(...messages) {
		// eslint-disable-next-line no-console
		console.log(`[${this.prefix}]`, ...messages);
	}

	/**
	 *
	 * @param messages {unknown[]}
	 */
	writeError(...messages) {
		// eslint-disable-next-line no-console
		console.error(`[${this.prefix}]`, ...messages);
	}
}
