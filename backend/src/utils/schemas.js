const { z } = require('zod');



const StatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']);
const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

const CreateTicketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(80, 'Title must be at most 80 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be at most 2000 characters'),
  priority: PriorityEnum.default('MEDIUM'),
});

const UpdateTicketSchema = z.object({
  title: z.string().min(5).max(80).optional(),
  description: z.string().min(20).max(2000).optional(),
  status: StatusEnum.optional(),
  priority: PriorityEnum.optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

const TicketQuerySchema = z.object({
  q: z.string().optional(),
  status: StatusEnum.optional(),
  priority: PriorityEnum.optional(),
  sort: z.enum(['newest', 'oldest']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});



const CreateCommentSchema = z.object({
  authorName: z.string().min(1, 'Author name is required').max(100, 'Author name too long'),
  message: z.string().min(1, 'Message cannot be empty').max(500, 'Message must be at most 500 characters'),
});

const CommentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(15),
});

module.exports = {
  CreateTicketSchema,
  UpdateTicketSchema,
  TicketQuerySchema,
  CreateCommentSchema,
  CommentQuerySchema,
  StatusEnum,
  PriorityEnum,
};
