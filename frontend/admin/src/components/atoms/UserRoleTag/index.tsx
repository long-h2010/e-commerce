import { UserRole } from '@/types';
import { Tag } from 'antd';

const ROLE_MAP: Record<UserRole, { color: string; label: string }> = {
  'super admin': { color: 'purple', label: 'Super Admin' },
  admin: { color: 'blue', label: 'Admin' },
  customer: { color: 'default', label: 'Customer' },
};

export const UserRoleTag = ({ role }: { role: UserRole }) => {
  return <Tag color={ROLE_MAP[role].color}>{ROLE_MAP[role].label}</Tag>;
};
