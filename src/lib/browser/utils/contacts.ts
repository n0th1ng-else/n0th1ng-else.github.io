import type { ProfileAccounts } from '$lib/common/@types/common';
import {
	getGithubLink,
	getHabrLink,
	getMediumLink,
	getTwitterLink,
	getDevtoLink,
	getLinkedInLink
} from './links';
import twitterLogo from '../../../assets/images/twitter-logo.svg';
import githubLogo from '../../../assets/images/github-logo.png';
import mediumLogo from '../../../assets/images/medium-logo.png';
import habrLogo from '../../../assets/images/habr-logo.svg';
import devtoLogo from '../../../assets/images/devto-logo.svg';
import linkedinLogo from '../../../assets/images/linkedin-logo.png';

enum ContactType {
	Location,
	Email,
	Url
}

enum MaterialIcon {
	Email = 'email',
	Location = 'location_on',
	Time = 'access_time',
	EmailSign = 'alternate_email',
	Engineering = 'engineering',
	Build = 'build',
	List = 'list'
}

class ContactModel {
	public sub = '';
	public link = '';
	public image = '';
	public icon?: MaterialIcon;
	public readonly type?: ContactType;

	public get subtitle(): string {
		return this.sub;
	}

	constructor(
		public readonly title: string,
		type?: ContactType
	) {
		this.type = type ?? ContactType.Url;
	}
}

export const getTwitterContact = (accounts: ProfileAccounts): ContactModel => {
	const contact = new ContactModel('Twitter');
	contact.link = getTwitterLink(accounts.twitter);
	contact.image = twitterLogo;
	return contact;
};

const getMediumContact = (accounts: ProfileAccounts): ContactModel => {
	const contact = new ContactModel('Medium');
	contact.link = getMediumLink(accounts.medium);
	contact.image = mediumLogo;
	return contact;
};

export const getGitHubContact = (accounts: ProfileAccounts): ContactModel => {
	const contact = new ContactModel('GitHub');
	contact.link = getGithubLink(accounts.github);
	contact.image = githubLogo;
	return contact;
};

const getHabrContact = (accounts: ProfileAccounts): ContactModel => {
	const contact = new ContactModel('Habr');
	contact.link = getHabrLink(accounts.habr);
	contact.image = habrLogo;
	return contact;
};

const getDevtoContact = (accounts: ProfileAccounts): ContactModel => {
	const contact = new ContactModel('Dev.to');
	contact.link = getDevtoLink(accounts.devto);
	contact.image = devtoLogo;
	return contact;
};

const getLinkedInContact = (accounts: ProfileAccounts): ContactModel => {
	const contact = new ContactModel('LinkedIn');
	contact.link = getLinkedInLink(accounts.linkedIn);
	contact.image = linkedinLogo;
	return contact;
};

export const getSocialNetworks = (accounts: ProfileAccounts): ContactModel[] => [
	getHabrContact(accounts),
	getMediumContact(accounts),
	getDevtoContact(accounts),
	getGitHubContact(accounts),
	getTwitterContact(accounts),
	getLinkedInContact(accounts)
];
