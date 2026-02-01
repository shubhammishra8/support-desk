

export type TicketStatus   = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Ticket {
  id:          string;
  title:       string;
  description: string;
  status:      TicketStatus;
  priority:    TicketPriority;
  createdAt:   string;
  updatedAt:   string;
}

export interface Comment {
  id:         string;
  ticketId:   string;
  authorName: string;
  message:    string;
  createdAt:  string;
}



export interface PaginationMeta {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
  hasNext:    boolean;
  hasPrev:    boolean;
}

export interface PaginatedResponse<T> {
  data:       T[];
  pagination: PaginationMeta;
}

export interface ApiError {
  error: {
    code:    string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}



export interface CreateTicketInput {
  title:       string;
  description: string;
  priority:    TicketPriority;
}

export interface UpdateTicketInput {
  title?:       string;
  description?: string;
  status?:      TicketStatus;
  priority?:    TicketPriority;
}

export interface CreateCommentInput {
  authorName: string;
  message:    string;
}



export interface TicketFilters {
  q?:        string;
  status?:   TicketStatus;
  priority?: TicketPriority;
  sort:      'newest' | 'oldest';
  page:      number;
  limit:     number;
}
