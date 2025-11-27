// lib/blog/types.ts

export type BlogCategory = 'allenamento' | 'alimentazione' | 'motivazione' | 'altro';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_markdown: string;
  category: BlogCategory;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  image_url: string | null;
  image_alt: string | null;
}

export interface BlogTopic {
  id: string;
  topic: string;
  category: BlogCategory;
  target_persona: string | null;
  priority: number;
  status: 'pending' | 'used' | 'skipped';
  used_post_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratedBlogPostPayload {
  title: string;
  slug: string;
  excerpt: string;
  content_markdown: string;
  seo_title: string;
  seo_description: string;
  category: BlogCategory;
  image_prompt: string;
  image_alt: string;
  image_style: 'photo' | 'illustration';
}
