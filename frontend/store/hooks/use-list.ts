'use client';

import { resourcesService } from '@/services';
import { Params } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useList = ({
  resource,
  params,
  meta,
}: {
  resource: string;
  params?: Params;
  meta?: any;
}) => {
  return useQuery({
    queryKey: [resource, params],
    queryFn: () => resourcesService.getList({ resource, ...params, meta }),
  });
};
