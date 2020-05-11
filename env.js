const resources = require('./resources.json');

const distInRoot = Boolean(process.env.DIST_ROOT);

const mode = process.env.NODE_ENV || 'development';

const github = process.env.GH_AUTHOR_LOGIN;

const linkedIn = process.env.GH_AUTHOR_LINKED_IN;

const telergam = process.env.GH_AUTHOR_TELEGRAM;

const medium = process.env.GH_AUTHOR_MEDIUM;

const env = {
	distInRoot,
	accounts: {
		github,
		linkedIn,
		medium,
		telergam
	},
	mode
};

module.exports = {
	procEnv: env,
	resources
};
