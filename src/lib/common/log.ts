export class Logger {
	constructor(private readonly context: string) {}

	public warn(msg: string, data?: unknown): void {
		const ctx = this.getContext();
		// eslint-disable-next-line no-console
		console.warn(ctx, msg, data || '');
	}

	public error(msg: string, err: unknown): void {
		const ctx = this.getContext();
		// eslint-disable-next-line no-console
		console.error(ctx, msg, err);
	}

	private getContext(): string {
		return `[${this.context}]`;
	}
}
