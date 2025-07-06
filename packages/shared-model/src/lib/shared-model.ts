export function sharedModel(): string {
  return 'shared-model';
}

export interface User {
  id: string;
  username: string;
  email: string;
  affiliate: string;
  createdAt: Date; // or Date if you want to parse it
  createdBy: string | null;
  isDelete: boolean;
}
