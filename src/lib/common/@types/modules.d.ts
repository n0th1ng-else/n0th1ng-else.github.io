declare module '*.svg' {
	const content: string;
	export default content;
}

declare module '*.png' {
	const content: string;
	export default content;
}

declare module 'cross-spawn' {
	export const sync: (
		cmd: string,
		args: string[],
		opts: {
			stdio: string;
			env?: Record<string, string>;
		}
	) => {
		output: string[];
	};
}
