'use client';

import { resourcesService } from '@/services';
import { useMutation } from '@tanstack/react-query';

export const useDelete = ({
  resource,
  meta,
}: {
  resource: string;
  meta?: any;
}) => {
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      resourcesService.deleteOne({ resource, id, meta }),
  });
};
