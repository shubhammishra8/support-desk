import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTicket, useUpdateTicket, useDeleteTicket } from '@/features/tickets/useTickets';
import { useComments, useCreateComment } from '@/features/comments/useComments';
import { Spinner, ErrorDisplay, StatusBadge, PriorityBadge, Pagination } from '@/components/SharedComponents';
import { formatDate, formatRelativeTime } from '@/utils/helpers';
import type { TicketStatus, TicketPriority } from '@/types';

const STATUSES:  TicketStatus[]  = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
const PRIORITIES: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  
  const { data: ticket, isLoading: ticketLoading, isError: ticketError, error: ticketErr } = useTicket(id!);
  const updateTicket = useUpdateTicket(id!);
  const deleteTicket = useDeleteTicket();

  
  const [commentPage, setCommentPage] = useState(1);
  const { data: comments, isLoading: commentsLoading } = useComments(id!, commentPage);
  const createComment = useCreateComment(id!);

  
  const [authorName, setAuthorName] = useState('');
  const [message,    setMessage]    = useState('');
  const [formError,  setFormError]  = useState('');

  

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTicket.mutate({ status: e.target.value as TicketStatus });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTicket.mutate({ priority: e.target.value as TicketPriority });
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this ticket and all its comments? This cannot be undone.')) return;
    await deleteTicket.mutateAsync(id!);
    navigate('/tickets');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    if (!authorName.trim()) { setFormError('Author name is required.'); return; }
    if (!message.trim())    { setFormError('Message is required.'); return; }
    if (message.length > 500) { setFormError('Message must be 500 characters or fewer.'); return; }

    setFormError('');

    try {
      await createComment.mutateAsync({ authorName: authorName.trim(), message: message.trim() });
      setAuthorName('');
      setMessage('');
      setCommentPage(1); 
    } catch {
      setFormError('Failed to post comment. Please try again.');
    }
  };

  

  if (ticketLoading) return <div className="page"><Spinner size="lg" label="Loading ticket…" /></div>;
  if (ticketError)   return <div className="page"><ErrorDisplay error={ticketErr} /></div>;
  if (!ticket)       return <div className="page"><ErrorDisplay error={new Error('Ticket not found')} /></div>;

  

  return (
    <div className="page ticket-detail-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/tickets" className="breadcrumb-link">Tickets</Link>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <span className="breadcrumb-current" aria-current="page">{ticket.title}</span>
      </nav>

      <div className="detail-layout">
        <div className="detail-main">
          <h1 className="detail-title">{ticket.title}</h1>

          <div className="detail-meta">
            <span className="detail-meta-item">Created <time dateTime={ticket.createdAt}>{formatDate(ticket.createdAt)}</time></span>
            <span className="detail-meta-sep" aria-hidden="true">·</span>
            <span className="detail-meta-item">Updated <time dateTime={ticket.updatedAt}>{formatDate(ticket.updatedAt)}</time></span>
          </div>

          <p className="detail-description">{ticket.description}</p>

          {updateTicket.isPending && (
            <div className="detail-saving" role="status" aria-live="polite">
              <Spinner size="sm" label="Saving changes…" />
              <span>Saving…</span>
            </div>
          )}
          {updateTicket.isError && (
            <div className="detail-error" role="alert">
              Update failed. Please try again.
            </div>
          )}

          <section className="comments-section" aria-labelledby="comments-heading">
            <h2 id="comments-heading" className="comments-heading">
              Comments
              {comments && <span className="comments-count">{comments.pagination.total}</span>}
            </h2>

            <form className="comment-form" onSubmit={handleCommentSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="comment-author" className="form-label">Your Name</label>
                <input
                  id="comment-author"
                  type="text"
                  className="input"
                  placeholder="e.g. Jane Smith"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  maxLength={100}
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="comment-message" className="form-label">
                  Message
                  <span className="form-label-count">{message.length}/500</span>
                </label>
                <textarea
                  id="comment-message"
                  className="input textarea"
                  placeholder="Add a comment…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={500}
                />
              </div>

              {formError && <p className="form-error" role="alert">{formError}</p>}

              <button
                className="btn btn-primary"
                type="submit"
                disabled={createComment.isPending}
              >
                {createComment.isPending ? 'Posting…' : 'Post Comment'}
              </button>
            </form>

            {commentsLoading && <Spinner size="md" label="Loading comments…" />}

            {!commentsLoading && comments && (
              <>
                {comments.data.length === 0 ? (
                  <p className="comments-empty">No comments yet. Be the first to add one.</p>
                ) : (
                  <ul className="comment-list" aria-label="Comments">
                    {comments.data.map((comment) => (
                      <li key={comment.id} className="comment-item">
                        <div className="comment-header">
                          <span className="comment-author">{comment.authorName}</span>
                          <time className="comment-time" dateTime={comment.createdAt} title={formatDate(comment.createdAt)}>
                            {formatRelativeTime(comment.createdAt)}
                          </time>
                        </div>
                        <p className="comment-message">{comment.message}</p>
                      </li>
                    ))}
                  </ul>
                )}

                <Pagination
                  page={comments.pagination.page}
                  totalPages={comments.pagination.totalPages}
                  hasNext={comments.pagination.hasNext}
                  hasPrev={comments.pagination.hasPrev}
                  onPageChange={setCommentPage}
                />
              </>
            )}
          </section>
        </div>

        <aside className="detail-sidebar" aria-label="Ticket details">
          <div className="sidebar-section">
            <h3 className="sidebar-label">Status</h3>
            <label htmlFor="sidebar-status" className="sr-only">Change ticket status</label>
            <select
              id="sidebar-status"
              className="input select-input sidebar-select"
              value={ticket.status}
              onChange={handleStatusChange}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase()}</option>
              ))}
            </select>
            <StatusBadge status={ticket.status} />
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-label">Priority</h3>
            <label htmlFor="sidebar-priority" className="sr-only">Change ticket priority</label>
            <select
              id="sidebar-priority"
              className="input select-input sidebar-select"
              value={ticket.priority}
              onChange={handlePriorityChange}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
              ))}
            </select>
            <PriorityBadge priority={ticket.priority} />
          </div>

          <div className="sidebar-section">
            <button
              className="btn btn-danger btn-full"
              type="button"
              onClick={handleDelete}
              disabled={deleteTicket.isPending}
            >
              {deleteTicket.isPending ? 'Deleting…' : 'Delete Ticket'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
