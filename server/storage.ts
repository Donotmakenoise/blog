import {
  type Post,
  type InsertPost,
  type ContactSubmission,
} from "@shared/schema";
import fs from "fs/promises";
import path from "path";
import { connectToDatabase } from "./db";
import { ObjectId } from "mongodb";

export interface IStorage {
  getAllPosts(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;
  incrementViewCount(slug: string): Promise<void>;
  getPostsByTag(tag: string): Promise<Post[]>;
  searchPosts(query: string): Promise<Post[]>;
  getPostStats(): Promise<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    thisMonthPosts: number;
    totalViews: number;
    topPosts: Post[];
    tagDistribution: { [key: string]: number };
  }>;

  createContactSubmission(
    data: Omit<ContactSubmission, "_id" | "id" | "createdAt" | "isRead">,
  ): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  markContactSubmissionAsRead(
    id: string,
  ): Promise<ContactSubmission | undefined>;
  deleteContactSubmission(id: string): Promise<boolean>;
  getUnreadContactSubmissionsCount(): Promise<number>;
}

export class MongoStorage implements IStorage {
  private postsDir: string;

  constructor() {
    this.postsDir = path.join(process.cwd(), "posts");
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      await connectToDatabase();
      await this.loadPostsFromFiles();
    } catch (error) {
      console.error("Error initializing storage:", error);
    }
  }

  private async loadPostsFromFiles() {
    try {
      const files = await fs.readdir(this.postsDir);
      const markdownFiles = files.filter((file) => file.endsWith(".md"));
      const db = await connectToDatabase();
      const postsCollection = db.collection("posts");

      for (const file of markdownFiles) {
        const filePath = path.join(this.postsDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const slug = file.replace(".md", "");

        // Check if post already exists in database
        const existingPost = await postsCollection.findOne({ slug });

        if (!existingPost) {
          const parsed = this.parseMarkdownFile(content);
          const post = {
            title: parsed.title,
            slug: slug,
            content: parsed.markdown,
            excerpt: parsed.excerpt,
            readTime: parsed.readTime,
            category: parsed.category,
            tags: parsed.tags,
            status: parsed.status,
            viewCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await postsCollection.insertOne(post);
        }
      }
    } catch (error) {
      console.error("Error loading posts from files:", error);
    }
  }

  private parseMarkdownFile(content: string): {
    title: string;
    excerpt: string;
    readTime: string;
    category: string;
    tags: string[];
    status: string;
    markdown: string;
  } {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return {
        title: "Untitled",
        excerpt: "No excerpt available",
        readTime: "5 min read",
        category: "General",
        tags: [],
        status: "published",
        markdown: content,
      };
    }

    const frontmatter = match[1];
    const markdown = match[2];

    const parseValue = (key: string, defaultValue: any) => {
      const regex = new RegExp(`^${key}:\\s*(.*)$`, "m");
      const match = frontmatter.match(regex);
      return match ? match[1].trim() : defaultValue;
    };

    const tagsStr = parseValue("tags", "");
    const tags = tagsStr
      ? tagsStr.split(",").map((tag: string) => tag.trim())
      : [];

    return {
      title: parseValue("title", "Untitled"),
      excerpt: parseValue("excerpt", "No excerpt available"),
      readTime: parseValue("readTime", "5 min read"),
      category: parseValue("category", "General"),
      tags: tags,
      status: parseValue("status", "published"),
      markdown: markdown,
    };
  }

  private async savePostToFile(post: Post) {
    try {
      const frontmatter = `---
title: ${post.title}
excerpt: ${post.excerpt || ""}
readTime: ${post.readTime || ""}
category: ${post.category || ""}
tags: ${post.tags?.join(", ") || ""}
status: ${post.status}
---

${post.content}`;

      const filePath = path.join(this.postsDir, `${post.slug}.md`);
      await fs.writeFile(filePath, frontmatter, "utf-8");
    } catch (error) {
      console.error("Error saving post to file:", error);
      throw new Error("Failed to save post file");
    }
  }

  private async deletePostFile(slug: string) {
    const filePath = path.join(this.postsDir, `${slug}.md`);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Error deleting post file:", error);
    }
  }

  private convertPostForResponse(post: any): Post {
    return {
      ...post,
      id: post._id.toString(),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async getAllPosts(): Promise<Post[]> {
    const db = await connectToDatabase();
    const posts = await db.collection("posts")
      .find({ status: "published" })
      .sort({ createdAt: -1 })
      .toArray();

    return posts.map(this.convertPostForResponse);
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const db = await connectToDatabase();
    const post = await db.collection("posts").findOne({ slug });
    return post ? this.convertPostForResponse(post) : undefined;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const db = await connectToDatabase();
    const postData = {
      ...insertPost,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("posts").insertOne(postData);
    const post = { ...postData, _id: result.insertedId };
    await this.savePostToFile(this.convertPostForResponse(post));
    return this.convertPostForResponse(post);
  }

  async updatePost(
    id: string,
    updateData: Partial<InsertPost>,
  ): Promise<Post | undefined> {
    const db = await connectToDatabase();
    const result = await db.collection("posts").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: "after" }
    );

    if (result) {
      const post = this.convertPostForResponse(result);
      await this.savePostToFile(post);
      return post;
    }
    return undefined;
  }

  async deletePost(id: string): Promise<boolean> {
    const db = await connectToDatabase();
    const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });

    if (post) {
      await this.deletePostFile(post.slug);
      const result = await db.collection("posts").deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    }
    return false;
  }

  async incrementViewCount(slug: string): Promise<void> {
    const db = await connectToDatabase();
    await db.collection("posts").updateOne(
      { slug },
      { $inc: { viewCount: 1 } }
    );
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    const db = await connectToDatabase();
    const posts = await db.collection("posts")
      .find({ 
        status: "published",
        tags: tag 
      })
      .sort({ createdAt: -1 })
      .toArray();

    return posts.map(this.convertPostForResponse);
  }

  async searchPosts(query: string): Promise<Post[]> {
    const db = await connectToDatabase();
    const posts = await db.collection("posts")
      .find({
        status: "published",
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
          { excerpt: { $regex: query, $options: "i" } }
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();

    return posts.map(this.convertPostForResponse);
  }

  async getPostStats(): Promise<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    thisMonthPosts: number;
    totalViews: number;
    topPosts: Post[];
    tagDistribution: { [key: string]: number };
  }> {
    const db = await connectToDatabase();
    const allPosts = await db.collection("posts").find({}).toArray();

    const publishedPosts = allPosts.filter((p) => p.status === "published");
    const draftPosts = allPosts.filter((p) => p.status === "draft");

    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);
    const thisMonthPosts = allPosts.filter(
      (p) => p.createdAt && p.createdAt >= thisMonth,
    );

    const totalViews = allPosts.reduce(
      (sum, post) => sum + (post.viewCount || 0),
      0,
    );

    const topPosts = publishedPosts
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5)
      .map(this.convertPostForResponse);

    const tagDistribution: { [key: string]: number } = {};
    allPosts.forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag: string) => {
          tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
        });
      }
    });

    return {
      totalPosts: allPosts.length,
      publishedPosts: publishedPosts.length,
      draftPosts: draftPosts.length,
      thisMonthPosts: thisMonthPosts.length,
      totalViews,
      topPosts,
      tagDistribution,
    };
  }

  async createContactSubmission(
    data: Omit<ContactSubmission, "_id" | "id" | "createdAt" | "isRead">,
  ): Promise<ContactSubmission> {
    const db = await connectToDatabase();
    const submissionData = {
      ...data,
      createdAt: new Date(),
      isRead: false,
    };

    const result = await db.collection("contactSubmissions").insertOne(submissionData);
    return {
      ...submissionData,
      id: result.insertedId.toString(),
    };
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    const db = await connectToDatabase();
    const submissions = await db.collection("contactSubmissions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return submissions.map(sub => ({
      ...sub,
      id: sub._id.toString(),
    }));
  }

  async markContactSubmissionAsRead(
    id: string,
  ): Promise<ContactSubmission | undefined> {
    const db = await connectToDatabase();
    const result = await db.collection("contactSubmissions").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isRead: true } },
      { returnDocument: "after" }
    );

    return result ? { ...result, id: result._id.toString() } : undefined;
  }

  async deleteContactSubmission(id: string): Promise<boolean> {
    const db = await connectToDatabase();
    const result = await db.collection("contactSubmissions").deleteOne({ 
      _id: new ObjectId(id) 
    });
    return result.deletedCount > 0;
  }

  async getUnreadContactSubmissionsCount(): Promise<number> {
    const db = await connectToDatabase();
    return await db.collection("contactSubmissions").countDocuments({ 
      isRead: false 
    });
  }
}

export const storage = new MongoStorage();