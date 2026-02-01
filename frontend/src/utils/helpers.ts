import type { TicketStatus, TicketPriority } from '@/types';



export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  });
}

export function formatRelativeTime(isoString: string): string {
  const now   = Date.now();
  const then  = new Date(isoString).getTime();
  const diff  = now - then;
  const secs  = Math.floor(diff / 1000);
  const mins  = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);

  if (secs  < 60)  return 'just now';
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 30)  return `${days}d ago`;
  return formatDate(isoString);
}



export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN:        'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED:    'Resolved',
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW:    'Low',
  MEDIUM: 'Medium',
  HIGH:   'High',
};



export const STATUS_CLASSES: Record<TicketStatus, string> = {
  OPEN:        'status-open',
  IN_PROGRESS: 'status-in-progress',
  RESOLVED:    'status-resolved',
};

export const PRIORITY_CLASSES: Record<TicketPriority, string> = {
  LOW:    'priority-low',
  MEDIUM: 'priority-medium',
  HIGH:   'priority-high',
};
