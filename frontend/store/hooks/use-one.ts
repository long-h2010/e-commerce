'use client';

import { resourcesService } from '@/services';
import { Params } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useOne = ({
  resource,
  id,
  meta,
  enabled,
}: {
  resource: string;
  id: string;
  params?: Params;
  meta?: any;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [resource, id],
    queryFn: () => resourcesService.getOne({ resource, id, meta }),
    enabled,
    retry: false,
  });
};
