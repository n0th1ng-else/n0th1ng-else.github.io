import { RoutePath } from '../routes';
import { labels } from '../labels';
import { MaterialIcon } from './icons';

export class TabModel {
	public readonly label: string;

	constructor(public readonly id: RoutePath, public readonly icon?: MaterialIcon) {
		this.label = labels.tabs[this.id];
	}
}

export const tabs: TabModel[] = [
	new TabModel(RoutePath.News, MaterialIcon.Time),
	new TabModel(RoutePath.Contacts, MaterialIcon.EmailSign),
	new TabModel(RoutePath.Projects, MaterialIcon.Engineering),
	new TabModel(RoutePath.Articles, MaterialIcon.List),
	new TabModel(RoutePath.Packages, MaterialIcon.Build)
];

export const getTabById = (id: RoutePath = RoutePath.News): TabModel => {
	const tab = tabs.find(t => t.id === id);
	if (!tab) {
		throw new Error(`Unknown tab id ${id}`);
	}

	return tab;
};
