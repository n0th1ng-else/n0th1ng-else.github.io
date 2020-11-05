import { RoutePath } from '../routes';
import { labels } from '../labels';

export class TabModel {
	public readonly label: string;

	constructor(public readonly id: RoutePath) {
		this.label = labels.tabs[this.id];
	}
}

export const tabs: TabModel[] = [
	new TabModel(RoutePath.Chronic),
	new TabModel(RoutePath.Contact),
	new TabModel(RoutePath.Info),
	new TabModel(RoutePath.Publication),
	new TabModel(RoutePath.Package)
];
