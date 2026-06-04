import { Badge } from 'antd';

export const UserStatusBadge = ({ isActive }: { isActive: boolean }) => {
  return (
    <Badge
      status={isActive ? 'success' : 'error'}
      text={isActive ? 'Active' : 'Banned'}
      style={{ color: isActive ? 'green' : 'red' }}
    />
  );
};
