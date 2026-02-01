/**
 * Seed Script
 * -----------
 * Populates the SQLite database with 12 sample tickets and comments.
 * Run: npm run seed
 *
 * Safe to run multiple times — clears existing data first.
 */

const { getDb } = require('./utils/database');
const { v4: uuidv4 } = require('uuid');

const db = getDb();


db.prepare('DELETE FROM comments').run();
db.prepare('DELETE FROM tickets').run();


const now = new Date();
const hoursAgo = (h) => new Date(now.getTime() - h * 3600000).toISOString();

const tickets = [
  { title: 'Login page crashes on Safari mobile',        description: 'When navigating to the login page on Safari mobile (iOS 17), the page renders blank after 2 seconds. This does not happen on Chrome or Firefox. Browser console shows a CORS error.',                                                        status: 'OPEN',        priority: 'HIGH',   createdAt: hoursAgo(48) },
  { title: 'Password reset email not arriving',          description: 'Users are reporting that password reset emails are not being delivered. Checked spam folders. The issue started appearing around 2024-01-15. Affects all email providers tested so far.',                                                       status: 'IN_PROGRESS', priority: 'HIGH',   createdAt: hoursAgo(36) },
  { title: 'Dashboard charts show stale data',           description: 'The main dashboard analytics charts appear to be showing data from 24 hours ago instead of real-time. The API endpoints return fresh data but the charts do not update until a full page refresh.',                                          status: 'OPEN',        priority: 'MEDIUM', createdAt: hoursAgo(24) },
  { title: 'Typo in Terms of Service page',              description: 'On the Terms of Service page, paragraph 3 reads "users shall not be liabel" instead of "liable". Minor but should be corrected for legal accuracy. Section 7 also has a missing period at the end of the final sentence.',                   status: 'OPEN',        priority: 'LOW',    createdAt: hoursAgo(20) },
  { title: 'Export to CSV truncates long fields',        description: 'When exporting ticket data to CSV, any description field longer than 255 characters gets truncated without warning. This causes data loss in downstream reports. The issue is likely in the CSV serialization utility function.',             status: 'IN_PROGRESS', priority: 'MEDIUM', createdAt: hoursAgo(18) },
  { title: 'Search filter does not reset on navigation', description: 'After applying a search filter on the tickets list and then navigating to a ticket detail page, returning to the list page does not preserve or correctly reset the filter state. The URL params are lost.',                                   status: 'OPEN',        priority: 'MEDIUM', createdAt: hoursAgo(15) },
  { title: 'Notification bell shows incorrect count',    description: 'The notification bell in the top nav bar shows a count of unread notifications that does not match the actual number when the dropdown is opened. The count appears to include already-read notifications from previous sessions.',             status: 'RESOLVED',    priority: 'LOW',    createdAt: hoursAgo(72) },
  { title: 'API rate limiting returns 503 instead of 429', description: 'When the API rate limit is exceeded, the server returns HTTP 503 Service Unavailable instead of the correct 429 Too Many Requests. This causes client retry logic to behave incorrectly since it does not recognise 503 as a rate limit signal.', status: 'RESOLVED',    priority: 'HIGH',   createdAt: hoursAgo(60) },
  { title: 'Dark mode toggle flickers on page load',     description: 'On initial page load, the interface briefly renders in light mode before switching to dark mode if that is the user preference. This causes a visible flash of unstyled content (FOUC). The theme should be applied before the first paint.',    status: 'IN_PROGRESS', priority: 'LOW',    createdAt: hoursAgo(10) },
  { title: 'Bulk delete fails silently on large sets',   description: 'Attempting to bulk-delete more than 50 tickets at once results in the operation appearing to succeed but no tickets are actually removed. No error is logged. Smaller batches (under 50) work correctly. Likely a transaction timeout issue.',    status: 'OPEN',        priority: 'HIGH',   createdAt: hoursAgo(8)  },
  { title: 'PDF report generation is extremely slow',    description: 'Generating a PDF report for tickets spanning more than 30 days takes over 45 seconds and frequently times out. The underlying data query completes in under 100ms so the bottleneck is in the PDF rendering pipeline, likely the font loading step.',  status: 'OPEN',        priority: 'MEDIUM', createdAt: hoursAgo(5)  },
  { title: 'Mobile keyboard obscures form submit button', description: 'On Android devices, when the on-screen keyboard appears while filling out a form, it covers the submit button entirely. The page does not scroll to keep the button visible. This affects all forms in the application consistently.',              status: 'OPEN',        priority: 'MEDIUM', createdAt: hoursAgo(2)  },
];

const insertTicket = db.prepare(`
  INSERT INTO tickets (id, title, description, status, priority, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const ticketIds = [];
const insertTickets = db.transaction(() => {
  for (const t of tickets) {
    const id = uuidv4();
    ticketIds.push(id);
    insertTicket.run(id, t.title, t.description, t.status, t.priority, t.createdAt, t.createdAt);
  }
});
insertTickets();



const commentSets = [
  
  [
    { author: 'Sarah Chen',   message: 'Confirmed on my end. Reproduces on Safari 17.2 but not 17.1. Might be worth checking the WebKit changelog.',                           hoursBack: 47 },
    { author: 'Mike Torres',  message: 'Found it. The issue is a missing CORS header on the /auth/session endpoint. Deploying a fix now.',                                      hoursBack: 40 },
    { author: 'Sarah Chen',   message: 'Fix confirmed working. Closing this out once the hotfix is in production.',                                                              hoursBack: 35 },
  ],
  
  [
    { author: 'Priya Nair',   message: 'Checked the email service logs. Emails are being queued but never dispatched. The SMTP credentials were rotated on the 14th and never updated in the config.',  hoursBack: 34 },
    { author: 'James Liu',    message: 'Updated the SMTP config in staging. Waiting for confirmation from the email provider before pushing to prod.',                          hoursBack: 30 },
  ],
  
  [
    { author: 'Alex Mora',    message: 'The chart component is using a cached WebSocket snapshot. Need to verify the reconnection logic after the recent refactor.',             hoursBack: 22 },
    { author: 'Lisa Park',    message: 'Added a force-refresh on the chart when the tab regains focus. Will PR this tonight.',                                                    hoursBack: 18 },
  ],
  
  [
    { author: 'Dana Wright',  message: 'Flagged for the content team. Should be a quick fix once they review.',                                                                  hoursBack: 19 },
  ],
  
  [
    { author: 'Omar Hassan',  message: 'The 255-char limit is hardcoded in the CSV builder. Looks like it was left over from an earlier version that used a different format.',   hoursBack: 17 },
    { author: 'Omar Hassan',  message: 'PR up. Removed the limit and added a unit test for fields up to 2000 chars.',                                                            hoursBack: 12 },
  ],
  
  [
    { author: 'Nina Costa',   message: 'This is a React Router state issue. The filter params need to be synced to the URL so they survive navigation.',                         hoursBack: 14 },
  ],
];

const insertComment = db.prepare(`
  INSERT INTO comments (id, ticket_id, author_name, message, created_at)
  VALUES (?, ?, ?, ?, ?)
`);

const insertComments = db.transaction(() => {
  for (let i = 0; i < commentSets.length; i++) {
    for (const c of commentSets[i]) {
      insertComment.run(uuidv4(), ticketIds[i], c.author, c.message, hoursAgo(c.hoursBack));
    }
  }
});
insertComments();

console.log(`✓ Seeded ${tickets.length} tickets and ${commentSets.flat().length} comments`);
