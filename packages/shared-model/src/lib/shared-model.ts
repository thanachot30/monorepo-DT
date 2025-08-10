// import { JsonValue } from '@prisma/client/runtime/library';

export function sharedModel(): string {
  return 'shared-model';
}

export interface accountConfig {
  userId: string;
  apiKey: string;
  secretKey: string;
  passphrase: string;
  strategy: string;
}

export interface checkConfig {
  apiKey: string;
  secretKey: string;
  passphrase: string;
}

export interface NewSub {
  userId: string;
  title: string;
  apiKey: string;
  secretKey: string;
  passphrase: string;
  strategy: strategyTypeProp;
  relationToMain?: string;
}
export interface editSub {
  id: string;
  title: string;
  apiKey: string;
  secretKey: string;
  passphrase: string;
}
export interface saveApiVariableProp {
  userId: string;
  title: string;
  apiKey: string;
  secretKey: string;
  passphrase: string;
  strategy: string;
  relationToMain?: string;
}

export interface deleteProp {
  id: string;
  isMain?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface createUser {
  username: string;
  email: string;
  affiliate: string;
}

export interface apiList {
  id: string;
  title: string;
  userId: string;
}

export interface StrategyItemDetail {
  id: string; // UUID
  strategy: string; // allowed values
  title: string; // name of the strategy
}

export interface apiById {
  data: StrategyItemDetail[];
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface ApiVariableDto {
  id: string;
  userId: string;
  strategy: string;
  title: string | null;
  dataMarking: maskData;
}

export interface maskData {
  apiKey_mask: string;
  passphrase_mask: string;
  secretKey_mask: string;
}

export interface StrategyItem {
  name: string;
  strategy: strategyTypeProp;
}

export interface StrategyUser {
  name: string;
  email: string;
}

export interface Strategy {
  id: number;
  strategyName: string;
  user: StrategyUser;
  items: StrategyItem[];
}

export enum strategyTypeProp {
  main = 'main',
  sub = 'sub',
}

export enum modeProp {
  newmain = strategyTypeProp.main,
  newsub = strategyTypeProp.sub,
  view = 'view',
  edit = 'edit',
}

export interface DeleteItemProp {
  id: string;
  title: string;
  strategy: strategyTypeProp;
}
