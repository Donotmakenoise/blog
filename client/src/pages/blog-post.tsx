import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Clock, Eye, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { renderMarkdown } from "@/lib/markdown";
import type { Post } from "@shared/schema";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["/api/posts", slug],
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="mb-8">
            <div className="h-4 bg-slate-200 rounded w-24 mb-4"></div>
            <div className="h-12 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Post Not Found</h1>
            <p className="text-slate-600 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2" size={16} />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderedContent = renderMarkdown(post.content);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Post Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="mr-2" size={16} />
              Back to Home
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center text-slate-600 mb-6 gap-2">
          <span>
            {new Date(post.createdAt || new Date()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Clock className="mr-1" size={16} />
            <span>{post.readTime}</span>
          </div>
          <span className="mx-2">•</span>
          <span>{post.category}</span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Eye className="mr-1" size={16} />
            <span>{post.viewCount || 0} views</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag size={12} />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Post Content */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div 
            className="prose prose-slate prose-lg max-w-none 
                       prose-headings:text-slate-800 prose-headings:font-semibold prose-headings:tracking-tight
                       prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-0
                       prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2
                       prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                       prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-justify prose-p:mb-4
                       prose-a:text-blue-600 prose-a:font-medium hover:prose-a:text-blue-800 prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-slate-800 prose-strong:font-semibold
                       prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                       prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                       prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                       prose-ul:space-y-2 prose-ol:space-y-2 prose-li:text-slate-700
                       prose-table:border-collapse prose-table:border prose-table:border-slate-300 prose-table:rounded-lg prose-table:overflow-hidden
                       prose-th:bg-slate-100 prose-th:font-semibold prose-th:text-slate-800 prose-th:p-3 prose-th:border prose-th:border-slate-300
                       prose-td:p-3 prose-td:border prose-td:border-slate-300 prose-td:text-slate-700
                       prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto prose-img:my-6
                       prose-hr:border-slate-300 prose-hr:my-8"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
          
          {/* Google AdSense Ad */}
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-xs text-slate-500 mb-2 text-center">Advertisement</p>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
            <ins className="adsbygoogle block w-full"
                 style={{display: 'block'}}
                 data-ad-client="ca-pub-xxxxxxxxxx"
                 data-ad-slot="xxxxxxxxxx"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}></script>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Comments</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <div className="text-slate-400 text-2xl mb-2">💬</div>
            <p className="text-slate-600">Comments feature would be implemented here</p>
            <p className="text-slate-500 text-sm">Consider using a service like Disqus or building a custom solution</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
