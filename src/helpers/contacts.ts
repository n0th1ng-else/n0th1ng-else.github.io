import { ContactType } from '../data/contact';
import { getAccounts } from './global';
import {
	getEmail,
	getGithubLink,
	getHabrLink,
	getMediumLink,
	getTwitterLink,
	getDevtoLink,
	getLinkedInLink
} from './links';
import { MaterialIcon } from '../data/icons';
import twitterLogo from '../assets/images/twitter-logo.svg';
import githubLogo from '../assets/images/github-logo.png';
import mediumLogo from '../assets/images/medium-logo.png';
import habrLogo from '../assets/images/habr-logo.svg';
import devtoLogo from '../assets/images/devto-logo.svg';
import linkedinLogo from '../assets/images/linkedin-logo.png';

export class ContactModel {
	public sub = '';
	public link = '';
	public image = '';
	public icon?: MaterialIcon;

	public get subtitle(): string {
		return this.sub;
	}

	constructor(public readonly title: string, public readonly type = ContactType.Url) {}
}

export const getEmailContact = (): ContactModel => {
	const contact = new ContactModel('Email', ContactType.Email);
	contact.link = getEmail();
	contact.icon = MaterialIcon.Email;
	return contact;
};

export const getLocationContact = (): ContactModel => {
	const contact = new ContactModel('Amsterdam, NL', ContactType.Location);
	contact.sub = '(CEST)';
	contact.icon = MaterialIcon.Location;
	return contact;
};

export const getTwitterContact = (): ContactModel => {
	const accounts = getAccounts();
	const contact = new ContactModel('Twitter');
	contact.link = getTwitterLink(accounts.twitter);
	contact.image = twitterLogo;
	return contact;
};

export const getMediumContact = (): ContactModel => {
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

export const getHabrContact = (): ContactModel => {
	const accounts = getAccounts();
	const contact = new ContactModel('Habr');
	contact.link = getHabrLink(accounts.habr);
	contact.image = habrLogo;
	return contact;
};

export const getDevtoContact = (): ContactModel => {
	const accounts = getAccounts();
	const contact = new ContactModel('Dev.to');
	contact.link = getDevtoLink(accounts.devto);
	contact.image = devtoLogo;
	return contact;
};

export const getLinkedInContact = (): ContactModel => {
	const accounts = getAccounts();
	const contact = new ContactModel('LinkedIn');
	contact.link = getLinkedInLink(accounts.linkedIn);
	contact.image = linkedinLogo;
	return contact;
};
