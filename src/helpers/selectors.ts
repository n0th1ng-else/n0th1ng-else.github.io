import type { LinkInfo, MetaInfo, ProfileAccounts } from '../../common';

export const getProfile = (): MetaInfo => runtime.profile;

export const getPackages = (): LinkInfo[] => runtime.packages;

export const getArticles = (): LinkInfo[] => runtime.publications;

export const getAccounts = (): ProfileAccounts => runtime.env.accounts;

export const getVersion = (): string => runtime.env.version ?? '';

export const getVersionBuild = (): string => runtime.env.versionBuild ?? '';

export const isProduction = (): boolean => runtime.env.mode === 'production';
