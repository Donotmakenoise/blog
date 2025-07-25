
import { z } from "zod";
import { ObjectId } from "mongodb";

// MongoDB Post interface
export interface Post {
  _id?: ObjectId;
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  readTime?: string | null;
  category?: string | null;
  tags?: string[] | null;
  status?: string;
  viewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// MongoDB Contact Submission interface
export interface ContactSubmission {
  _id?: ObjectId;
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Date;
  isRead?: boolean;
}

export const insertPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  readTime: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.string().optional(),
});

export const updatePostSchema = insertPostSchema.extend({
  id: z.string(),
});

export const contactSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
