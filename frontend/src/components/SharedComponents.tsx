import type { TicketStatus, TicketPriority } from '@/types';
import { STATUS_LABELS, STATUS_CLASSES, PRIORITY_LABELS, PRIORITY_CLASSES } from '@/utils/helpers';



export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`badge ${STATUS_CLASSES[status]}`} aria-label={`Status: ${STATUS_LABELS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}



export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={`badge ${PRIORITY_CLASSES[priority]}`} aria-label={`Priority: ${PRIORITY_LABELS[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}



export function Spinner({ size = 'md', label = 'Loading...' }: { size?: 'sm' | 'md' | 'lg'; label?: string }) {
  const sizeClass = { sm: 'spinner-sm', md: 'spinner-md', lg: 'spinner-lg' }[size];
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className={`spinner ${sizeClass}`} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}



export function EmptyState({ title, message, action }: {
  title:    string;
  message:  string;
  action?:  React.ReactNode;
}) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-icon" aria-hidden="true">⬜</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}



export function ErrorDisplay({ error, onRetry }: {
  error: unknown;
  onRetry?: () => void;
}) {
  const message = error instanceof Error ? error.message : 'Something went wrong';

  return (
    <div className="error-display" role="alert">
      <div className="error-icon" aria-hidden="true">⚠</div>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry} type="button">
          Retry
        </button>
      )}
    </div>
  );
}



export function Pagination({ page, totalPages, hasNext, hasPrev, onPageChange }: {
  page:           number;
  totalPages:     number;
  hasNext:        boolean;
  hasPrev:        boolean;
  onPageChange:   (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  
  const pages: (number | '...')[] = [];
  const range = 2; 

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - range && i <= page + range)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav className="pagination" aria-label="Ticket pagination">
      <button
        className="pagination-btn"
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      <div className="pagination-pages">
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="pagination-ellipsis" aria-hidden="true">…</span>
          ) : (
            <button
              key={p}
              className={`pagination-page ${p === page ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className="pagination-btn"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}
