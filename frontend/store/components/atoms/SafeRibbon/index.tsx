import { Badge } from 'antd';
import { ReactNode } from 'react';

export const SafeRibbon = ({label, children}: {label?: string, children: ReactNode}) => {
  if (!label) return children;
  return <Badge.Ribbon text={label}>{children}</Badge.Ribbon>;
}
