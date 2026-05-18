'use client';

import { resourcesService } from '@/services';
import { useMutation } from '@tanstack/react-query';

export const useUpdate = ({
  resource,
  meta,
}: {
  resource: string;
  meta?: any;
}) => {
  return useMutation({
    mutationFn: ({ id, variables }: { id: string; variables: any }) =>
      resourcesService.update({ resource, id, variables, meta }),

    onSuccess: () => {},
  });
};
