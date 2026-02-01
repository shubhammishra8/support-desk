import type {
  Ticket,
  Comment,
  PaginatedResponse,
  CreateTicketInput,
  UpdateTicketInput,
  CreateCommentInput,
  TicketFilters,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const BASE_URL = API_BASE_URL;

class ApiError extends Error {
  status: number;
  code:   string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code   = code;
    this.name   = 'ApiError';
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);

  if (response.status === 204) return undefined as unknown as T;

  const json = await response.json();

  if (!response.ok) {
    const err = json?.error;
    throw new ApiError(
      response.status,
      err?.code    ?? 'UNKNOWN',
      err?.message ?? 'An unexpected error occurred'
    );
  }

  return json as T;
}

export function listTickets(filters: TicketFilters): Promise<PaginatedResponse<Ticket>> {
  const params = new URLSearchParams();
  if (filters.q)        params.set('q',        filters.q);
  if (filters.status)   params.set('status',   filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  params.set('sort',  filters.sort);
  params.set('page',  String(filters.page));
  params.set('limit', String(filters.limit));

  return request<PaginatedResponse<Ticket>>('GET', `/tickets?${params}`);
}

export function getTicket(id: string): Promise<Ticket> {
  return request<Ticket>('GET', `/tickets/${id}`);
}

export function createTicket(input: CreateTicketInput): Promise<Ticket> {
  return request<Ticket>('POST', '/tickets', input);
}

export function updateTicket(id: string, input: UpdateTicketInput): Promise<Ticket> {
  return request<Ticket>('PATCH', `/tickets/${id}`, input);
}

export function deleteTicket(id: string): Promise<void> {
  return request<void>('DELETE', `/tickets/${id}`);
}

export function listComments(ticketId: string, page: number, limit: number): Promise<PaginatedResponse<Comment>> {
  return request<PaginatedResponse<Comment>>('GET', `/tickets/${ticketId}/comments?page=${page}&limit=${limit}`);
}

export function createComment(ticketId: string, input: CreateCommentInput): Promise<Comment> {
  return request<Comment>('POST', `/tickets/${ticketId}/comments`, input);
}

export { ApiError };
