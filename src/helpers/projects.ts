import nssLogo from '../assets/images/nss-logo.png';
import setronicaLogo from '../assets/images/setronica-logo.png';

export class ProjectModel {
	public endDate?: Date;
	public description = '';
	public keywords: string[] = [];

	constructor(
		public readonly title,
		public readonly logo: string,
		public readonly startDate: Date
	) {}
}

export const getNSSProject = (): ProjectModel => {
	const project = new ProjectModel('Novel Software Systems', nssLogo, new Date('01-07-2013'));
	project.endDate = new Date('01-08-2016');
	return project;
};

export const getSetronicaProject = (): ProjectModel => {
	const project = new ProjectModel('Setronica', setronicaLogo, new Date('01-10-2016'));
	return project;
};

export const getAudioMessBotProject = (): ProjectModel => {
	const project = new ProjectModel('t.ms/AudioMessBot', setronicaLogo, new Date('01-07-2020'));
	return project;
};
