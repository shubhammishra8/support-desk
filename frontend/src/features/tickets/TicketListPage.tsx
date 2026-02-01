import { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTickets } from '@/features/tickets/useTickets';
import { Spinner, ErrorDisplay, EmptyState, Pagination, StatusBadge, PriorityBadge } from '@/components/SharedComponents';
import { formatDate } from '@/utils/helpers';
import type { TicketStatus, TicketPriority } from '@/types';

const STATUSES:  (TicketStatus  | '')[] = ['', 'OPEN', 'IN_PROGRESS', 'RESOLVED'];
const PRIORITIES: (TicketPriority | '')[] = ['', 'LOW', 'MEDIUM', 'HIGH'];

export default function TicketListPage() {
  const navigate = useNavigate();

  
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status,   setStatus]   = useState<TicketStatus  | ''>('');
  const [priority, setPriority] = useState<TicketPriority | ''>('');
  const [sort,     setSort]     = useState<'newest' | 'oldest'>('newest');
  const [page,     setPage]     = useState(1);

  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    setPage(1); 

    
    if ((handleSearchChange as any)._timer) clearTimeout((handleSearchChange as any)._timer);
    (handleSearchChange as any)._timer = setTimeout(() => setDebouncedSearch(val), 300);
  }, []);

  
  const handleFilterChange = useCallback(<T,>(setter: (v: T) => void, value: T) => {
    setter(value);
    setPage(1);
  }, []);

  
  const filters = useMemo(() => ({
    q:        debouncedSearch || undefined,
    status:   status   || undefined,
    priority: priority || undefined,
    sort,
    page,
    limit:    20,
  }), [debouncedSearch, status, priority, sort, page]);

  const { data, isLoading, isError, error, refetch } = useTickets(filters);

  
  const hasActiveFilters = debouncedSearch || status || priority;

  return (
    <div className="page ticket-list-page">
      <div className="page-header">
        <h1 className="page-title">Support Tickets</h1>
        <button className="btn btn-primary" onClick={() => navigate('/tickets/new')} type="button">
          + New Ticket
        </button>
      </div>

      <div className="controls-bar">
        <div className="controls-search">
          <label htmlFor="ticket-search" className="sr-only">Search tickets</label>
          <input
            id="ticket-search"
            type="text"
            className="input search-input"
            placeholder="Search by title or description…"
            value={searchInput}
            onChange={handleSearchChange}
            aria-label="Search tickets by title or description"
          />
        </div>

        <div className="controls-filters">
          <label htmlFor="filter-status" className="sr-only">Filter by status</label>
          <select
            id="filter-status"
            className="input select-input"
            value={status}
            onChange={(e) => handleFilterChange(setStatus, e.target.value as TicketStatus | '')}
          >
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase()}</option>
            ))}
          </select>

          <label htmlFor="filter-priority" className="sr-only">Filter by priority</label>
          <select
            id="filter-priority"
            className="input select-input"
            value={priority}
            onChange={(e) => handleFilterChange(setPriority, e.target.value as TicketPriority | '')}
          >
            <option value="">All Priorities</option>
            {PRIORITIES.filter(Boolean).map((p) => (
              <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
            ))}
          </select>

          <label htmlFor="sort-select" className="sr-only">Sort tickets</label>
          <select
            id="sort-select"
            className="input select-input"
            value={sort}
            onChange={(e) => handleFilterChange(setSort, e.target.value as 'newest' | 'oldest')}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {hasActiveFilters && (
            <button
              className="btn btn-ghost clear-filters"
              type="button"
              onClick={() => {
                setSearchInput('');
                setDebouncedSearch('');
                setStatus('');
                setPriority('');
                setPage(1);
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="ticket-list-content">
        {isLoading && <Spinner size="lg" label="Loading tickets…" />}

        {isError && <ErrorDisplay error={error} onRetry={() => refetch()} />}

        {!isLoading && !isError && data && (
          <>
            <div className="results-count" aria-live="polite">
              <span>{data.pagination.total} ticket{data.pagination.total !== 1 ? 's' : ''} found</span>
            </div>

            {data.data.length === 0 ? (
              <EmptyState
                title={hasActiveFilters ? 'No matching tickets' : 'No tickets yet'}
                message={hasActiveFilters
                  ? 'Try adjusting your search or filters.'
                  : 'Create your first support ticket to get started.'}
                action={!hasActiveFilters ? (
                  <button className="btn btn-primary" onClick={() => navigate('/tickets/new')} type="button">
                    Create a Ticket
                  </button>
                ) : undefined}
              />
            ) : (
              <div className="ticket-grid" role="list">
                {data.data.map((ticket) => (
                  <Link
                    key={ticket.id}
                    to={`/tickets/${ticket.id}`}
                    className="ticket-card"
                    role="listitem"
                    aria-label={`${ticket.title}, status ${ticket.status}, priority ${ticket.priority}`}
                  >
                    <div className="ticket-card-header">
                      <h3 className="ticket-card-title">{ticket.title}</h3>
                      <div className="ticket-card-badges">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                    </div>
                    <p className="ticket-card-date">Created {formatDate(ticket.createdAt)}</p>
                  </Link>
                ))}
              </div>
            )}

            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              hasNext={data.pagination.hasNext}
              hasPrev={data.pagination.hasPrev}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
