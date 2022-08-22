const AppKey = 'nothing-else-storage';

export enum StorageAppKey {
	Theme = 'theme-setting'
}

export const restoreData = <Data = string>(key: StorageAppKey): Data | null => {
	const data = window.localStorage.getItem([AppKey, key].join('/'));
	return data ? JSON.parse(data) : data;
};

export const persistData = <Data = string>(key: StorageAppKey, value: Data): void =>
	window.localStorage.setItem([AppKey, key].join('/'), JSON.stringify(value));
