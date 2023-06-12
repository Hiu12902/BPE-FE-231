export enum UserRole {
  OWNER = 0,
  CAN_EDIT = 1,
  CAN_SHARE = 2,
  CAN_VIEW = 3,
}

export const UserRoleText: Record<UserRole, string> = {
  0: 'Owner',
  1: 'Can Edit',
  2: 'Can Share',
  3: 'Can View',
};
