'use client';

import { resourcesService } from '@/services';
import { useMutation } from '@tanstack/react-query';

export const useCreate = ({ resource }: { resource: string }) => {
  return useMutation({
    mutationFn: (variables: any) =>
      resourcesService.create({ resource, variables }),
  });
};
