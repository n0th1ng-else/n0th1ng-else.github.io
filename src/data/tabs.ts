import { RoutePath } from '../routes';
import { labels } from '../labels';

export class TabModel {
	public readonly label: string;

	constructor(public readonly id: RoutePath) {
		this.label = labels.tabs[this.id];
	}
}

export const tabs: TabModel[] = [
	new TabModel(RoutePath.News),
	new TabModel(RoutePath.Contacts),
	new TabModel(RoutePath.Projects),
	new TabModel(RoutePath.Articles),
	new TabModel(RoutePath.Packages)
];

export const getTabById = (id: RoutePath = RoutePath.News): TabModel => {
	const tab = tabs.find(t => t.id === id);
	if (!tab) {
		throw new Error(`Unknown tab id ${id}`);
	}

	return tab;
};
