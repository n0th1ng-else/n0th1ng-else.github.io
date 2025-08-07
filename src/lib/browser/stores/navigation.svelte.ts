let backButtonStore = $state(false);

export const showBackButton = (): void => {
	backButtonStore = true;
};

export const hideBackButton = (): void => {
	backButtonStore = false;
};

export const getBackButtonState = (): boolean => {
	return backButtonStore;
};
