import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/utils/api';
import type { TicketFilters, CreateTicketInput, UpdateTicketInput } from '@/types';



export const TICKET_KEYS = {
  all:    ['tickets'] as const,
  list:   (filters: TicketFilters) => ['tickets', 'list', filters] as const,
  detail: (id: string)            => ['tickets', 'detail', id]     as const,
};



export function useTickets(filters: TicketFilters) {
  return useQuery({
    queryKey:   TICKET_KEYS.list(filters),
    queryFn:    () => api.listTickets(filters),
    placeholderData: (previousData) => previousData,
  });
}



export function useTicket(id: string) {
  return useQuery({
    queryKey: TICKET_KEYS.detail(id),
    queryFn:  () => api.getTicket(id),
    enabled:  !!id,
  });
}



export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketInput) => api.createTicket(input),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.all });
    },
  });
}



export function useUpdateTicket(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTicketInput) => api.updateTicket(ticketId, input),
    
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: TICKET_KEYS.detail(ticketId) });
      const previous = queryClient.getQueryData(TICKET_KEYS.detail(ticketId));

      queryClient.setQueryData(TICKET_KEYS.detail(ticketId), (old: any) => ({
        ...old,
        ...input,
        updatedAt: new Date().toISOString(),
      }));

      return { previous };
    },
    
    onError: (_err, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TICKET_KEYS.detail(ticketId), context.previous);
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.all });
    },
  });
}



export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_KEYS.all });
    },
  });
}
