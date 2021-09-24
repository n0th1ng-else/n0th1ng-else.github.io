import { ContactType } from '../data/contact';
import { getAccounts } from './selectors';
import {
	getGithubLink,
	getHabrLink,
	getMediumLink,
	getTwitterLink,
	getDevtoLink,
	getLinkedInLink
} from './links';
import type { MaterialIcon } from '../data/icons';
import twitterLogo from '../assets/images/twitter-logo.svg';
import githubLogo from '../assets/images/github-logo.png';
import mediumLogo from '../assets/images/medium-logo.png';
import habrLogo from '../assets/images/habr-logo.svg';
import devtoLogo from '../assets/images/devto-logo.svg';
import linkedinLogo from '../assets/images/linkedin-logo.png';

class ContactModel {
	public sub = '';
	public link = '';
	public image = '';
	public icon?: MaterialIcon;

	public get subtitle(): string {
		return this.sub;
	}

	constructor(public readonly title: string, public readonly type = ContactType.Url) {}
}

export const getTwitterContact = (): ContactModel => {
	const accounts = getAccounts();
	const contact = new ContactModel('Twitter');
	contact.link = getTwitterLink(accounts.twitter);
	contact.image = twitterLogo;
	return contact;
};

const getMediumContact = (): ContactModel => {
	const accounts = getAccounts();
	const contact = new ContactModel('Medium');
	contact.link = getMediumLink(accounts.medium);
	contact.image = mediumLogo;
	return contact;
};

export const getGitHubContact = (): ContactModel => {
	const accounts = getAccounts();
	const contact = new ContactModel('GitHub');
	contact.link = getGithubLink(accounts.github);
	contact.image = githubLogo;
	return contact;
};

const getHabrContact = (): ContactModel => {
	const accounts = getAccounts();
	const contact = new ContactModel('Habr');
	contact.link = getHabrLink(accounts.habr);
	contact.image = habrLogo;
	return contact;
};

const getDevtoContact = (): ContactModel => {
	const accounts = getAccounts();
	const contact = new ContactModel('Dev.to');
	contact.link = getDevtoLink(accounts.devto);
	contact.image = devtoLogo;
	return contact;
};

const getLinkedInContact = (): ContactModel => {
	const accounts = getAccounts();
	const contact = new ContactModel('LinkedIn');
	contact.link = getLinkedInLink(accounts.linkedIn);
	contact.image = linkedinLogo;
	return contact;
};

export const getSocialNetworks = (): ContactModel[] => [
	getHabrContact(),
	getMediumContact(),
	getDevtoContact(),
	getGitHubContact(),
	getTwitterContact(),
	getLinkedInContact()
];
