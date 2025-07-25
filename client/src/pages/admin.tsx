import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trash2, Edit, BarChart3, Users, FileText, TrendingUp, Eye, Mail, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PostModal from "@/components/post-modal";
import NotificationBox from "@/components/notification-box";
import type { Post, ContactSubmission } from "@shared/schema";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    enabled: isAuthenticated,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated,
  });

  const { data: contactSubmissions } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contact-submissions"],
    enabled: isAuthenticated,
  });

  const { data: unreadCount } = useQuery<{ count: number }>({
    queryKey: ["/api/admin/contact-submissions/unread-count"],
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiRequest("POST", "/api/admin/login", { password });
      return response.json();
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel!",
      });
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
    },
  });



  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/posts/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Post deleted",
        description: "The blog post has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: () => {
      toast({
        title: "Error deleting post",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/admin/contact-submissions/${id}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-submissions/unread-count"] });
      toast({
        title: "Marked as read",
        description: "Contact submission has been marked as read.",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/contact-submissions/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-submissions/unread-count"] });
      toast({
        title: "Contact submission deleted",
        description: "The contact submission has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error deleting submission",
        description: "Failed to delete contact submission. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(password);
  };



  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Admin Panel</CardTitle>
            <p className="text-slate-600">This panel is only accessible via direct URL.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Admin Header with Notifications */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your blog posts and contact submissions</p>
        </div>
        <NotificationBox isAuthenticated={isAuthenticated} />
      </div>
      {/* Dashboard Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="text-blue-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-slate-600">Total Posts</p>
                  <p className="text-2xl font-bold">{stats.totalPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="text-green-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-slate-600">Published</p>
                  <p className="text-2xl font-bold">{stats.publishedPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="text-purple-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-slate-600">This Month</p>
                  <p className="text-2xl font-bold">{stats.thisMonthPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="text-orange-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-slate-600">Total Views</p>
                  <p className="text-2xl font-bold">{stats.totalViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="text-red-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-slate-600">New Messages</p>
                  <p className="text-2xl font-bold">{unreadCount?.count || 0}</p>
                  {(unreadCount?.count || 0) > 0 && (
                    <Badge variant="destructive" className="text-xs mt-1">
                      Needs attention
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Posts & Tag Distribution */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top 5 Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-slate-500 mr-3">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-sm">{post.title}</p>
                        <p className="text-xs text-slate-500">{post.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Eye size={14} className="mr-1" />
                      {post.viewCount || 0}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tag Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stats.tagDistribution).map(([tag, count]) => (
                  <div key={tag} className="flex items-center justify-between">
                    <Badge variant="outline">{tag}</Badge>
                    <span className="text-sm text-slate-600">{count} posts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Post Action */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Post Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <PostModal 
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Submissions */}
      <Card id="contact-submissions">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            Contact Submissions
            {(unreadCount?.count || 0) > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount?.count} new
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contactSubmissions?.map((submission) => (
              <div 
                key={submission.id} 
                className={`p-4 border rounded-md ${
                  !submission.isRead ? 'bg-blue-50 border-blue-200' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-slate-800">{submission.subject}</h3>
                      {!submission.isRead && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      From: <strong>{submission.name}</strong> ({submission.email})
                    </p>
                    <p className="text-sm text-slate-700 mb-2">{submission.message}</p>
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock size={12} className="mr-1" />
                      {new Date(submission.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!submission.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsReadMutation.mutate(submission.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteContactMutation.mutate(submission.id)}
                      disabled={deleteContactMutation.isPending}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {(!contactSubmissions || contactSubmissions.length === 0) && (
              <p className="text-center text-slate-500 py-8">No contact submissions yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Existing Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Existing Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {posts?.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-md">
                  <div>
                    <p className="font-medium text-slate-800">{post.title}</p>
                    <p className="text-slate-500 text-sm">{post.slug}.md</p>
                  </div>
                  <div className="space-x-2">
                    <PostModal 
                      post={post} 
                      trigger={
                        <Button variant="outline" size="sm">
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                      }
                      onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePostMutation.mutate(post.id)}
                      disabled={deletePostMutation.isPending}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
