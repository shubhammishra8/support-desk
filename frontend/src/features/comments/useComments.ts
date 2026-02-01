import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/utils/api';
import type { CreateCommentInput } from '@/types';



export const COMMENT_KEYS = {
  list: (ticketId: string, page: number) => ['comments', ticketId, page] as const,
  all:  (ticketId: string)              => ['comments', ticketId]        as const,
};



export function useComments(ticketId: string, page: number, limit: number = 15) {
  return useQuery({
    queryKey:         COMMENT_KEYS.list(ticketId, page),
    queryFn:          () => api.listComments(ticketId, page, limit),
    enabled:          !!ticketId,
    placeholderData:  (previousData) => previousData,
  });
}



export function useCreateComment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCommentInput) => api.createComment(ticketId, input),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.all(ticketId) });
    },
  });
}
