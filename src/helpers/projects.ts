import nssLogo from '../assets/images/nss-logo.png';
import setronicaLogo from '../assets/images/setronica-logo.png';

export class ProjectModel {
	constructor(public readonly title, public readonly logo: string) {}
}

export const getNSSProject = (): ProjectModel => {
	const project = new ProjectModel('Novel Software Systems', nssLogo);
	return project;
};

export const getSetronicaProject = (): ProjectModel => {
	const project = new ProjectModel('Setronica', setronicaLogo);
	return project;
};
