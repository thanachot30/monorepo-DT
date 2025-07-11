export function sharedModel(): string {
  return 'shared-model';
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

export interface apiById {
  data: {
    id: string;
    strategy: string;
    title: string | null;
  }[];
  user: {
    username: string;
    email: string;
  };
}
