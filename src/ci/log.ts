export class Logger {
	private readonly prefix: string;

	constructor(prefix: string) {
		this.prefix = prefix;
	}

	writeOutput(...messages: unknown[]) {
		// eslint-disable-next-line no-console
		console.log(`[${this.prefix}]`, ...messages);
	}

	writeWarning(...messages: unknown[]) {
		// eslint-disable-next-line no-console
		console.log(`[${this.prefix}]`, ...messages);
	}

	writeError(...messages: unknown[]) {
		// eslint-disable-next-line no-console
		console.error(`[${this.prefix}]`, ...messages);
	}
}
