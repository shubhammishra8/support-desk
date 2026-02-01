import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTicket } from '@/features/tickets/useTickets';
import { Spinner } from '@/components/SharedComponents';
import type { TicketPriority } from '@/types';



const CreateTicketSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(80, 'Title must be at most 80 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be at most 2000 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
});

type FormValues = z.infer<typeof CreateTicketSchema>;

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const createTicket = useCreateTicket();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(CreateTicketSchema),
    defaultValues: { title: '', description: '', priority: 'MEDIUM' },
  });

  const description = watch('description');

  const onSubmit = async (data: FormValues) => {
    try {
      const ticket = await createTicket.mutateAsync({
        title:       data.title,
        description: data.description,
        priority:    data.priority as TicketPriority,
      });
      navigate(`/tickets/${ticket.id}`);
    } catch (err) {
      
      console.error('Create ticket failed:', err);
    }
  };

  return (
    <div className="page create-ticket-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/tickets" className="breadcrumb-link">Tickets</Link>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <span className="breadcrumb-current" aria-current="page">New Ticket</span>
      </nav>

      <div className="create-ticket-layout">
        <div className="create-ticket-content">
          <h1 className="page-title">Create a New Ticket</h1>
          <p className="page-subtitle">Describe your issue and we'll get it tracked.</p>

          <form className="ticket-form" onSubmit={handleSubmit(onSubmit)} noValidate>

            <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
              <label htmlFor="ticket-title" className="form-label">
                Title <span className="form-label-required" aria-hidden="true">*</span>
              </label>
              <input
                id="ticket-title"
                type="text"
                className="input"
                placeholder="Brief summary of the issue"
                {...register('title')}
                aria-describedby={errors.title ? 'title-error' : undefined}
                aria-required="true"
              />
              {errors.title && (
                <p id="title-error" className="form-error" role="alert">{errors.title.message}</p>
              )}
              <p className="form-hint">5–80 characters</p>
            </div>

            <div className={`form-group ${errors.description ? 'has-error' : ''}`}>
              <label htmlFor="ticket-description" className="form-label">
                Description <span className="form-label-required" aria-hidden="true">*</span>
                <span className="form-label-count">{description?.length || 0}/2000</span>
              </label>
              <textarea
                id="ticket-description"
                className="input textarea"
                placeholder="Provide details: steps to reproduce, expected vs actual behavior, environment info…"
                rows={5}
                {...register('description')}
                aria-describedby={errors.description ? 'description-error' : undefined}
                aria-required="true"
              />
              {errors.description && (
                <p id="description-error" className="form-error" role="alert">{errors.description.message}</p>
              )}
              <p className="form-hint">20–2000 characters. Be specific — it helps us resolve faster.</p>
            </div>
            <div className={`form-group ${errors.priority ? 'has-error' : ''}`}>
              <label htmlFor="ticket-priority" className="form-label">Priority</label>
              <select
                id="ticket-priority"
                className="input select-input"
                {...register('priority')}
                aria-describedby={errors.priority ? 'priority-error' : undefined}
              >
                <option value="LOW">Low — Minor inconvenience</option>
                <option value="MEDIUM">Medium — Impacts workflow</option>
                <option value="HIGH">High — Blocks critical work</option>
              </select>
              {errors.priority && (
                <p id="priority-error" className="form-error" role="alert">{errors.priority.message}</p>
              )}
            </div>

            {createTicket.isError && (
              <div className="form-submit-error" role="alert">
                <p>Failed to create ticket. Please try again.</p>
              </div>
            )}

            <div className="form-actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting || createTicket.isPending}
              >
                {isSubmitting || createTicket.isPending ? (
                  <><Spinner size="sm" label="Creating…" /> Creating…</>
                ) : (
                  'Create Ticket'
                )}
              </button>

              <Link to="/tickets" className="btn btn-ghost">Cancel</Link>
            </div>
          </form>
        </div>

        {/* Side info panel */}
        <aside className="create-ticket-info" aria-label="Tips">
          <div className="info-card">
            <h3 className="info-card-title">Tips for a great ticket</h3>
            <ul className="info-card-list">
              <li>Start with a clear, specific title</li>
              <li>Include steps to reproduce the issue</li>
              <li>Note your browser and OS if relevant</li>
              <li>Attach screenshots if possible (via description)</li>
              <li>Set priority honestly — it helps triaging</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
