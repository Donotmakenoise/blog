import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trash2, Edit, BarChart3, Users, FileText, TrendingUp, Eye, Mail, Clock, CheckCircle, Calendar, Activity, MessageSquare, Star, Filter, Search, Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PostModal from "@/components/post-modal";
import NotificationBox from "@/components/notification-box";
import type { Post, ContactSubmission } from "@shared/schema";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  // Filter and sort posts
  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "views":
        return (b.viewCount || 0) - (a.viewCount || 0);
      case "title":
        return a.title.localeCompare(b.title);
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const publishedPercentage = stats ? (stats.publishedPosts / stats.totalPosts) * 100 : 0;
  const avgViewsPerPost = stats ? Math.round(stats.totalViews / stats.publishedPosts) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Admin Header with Notifications */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your blog posts and contact submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries()}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
          <NotificationBox isAuthenticated={isAuthenticated} />
        </div>
      </div>

      {/* Enhanced Dashboard Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Posts</p>
                  <p className="text-2xl font-bold text-blue-800">{stats.totalPosts}</p>
                  <p className="text-xs text-blue-500 mt-1">
                    {stats.draftPosts} drafts
                  </p>
                </div>
                <FileText className="text-blue-600" size={28} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Published</p>
                  <p className="text-2xl font-bold text-green-800">{stats.publishedPosts}</p>
                  <Progress value={publishedPercentage} className="mt-2 h-1" />
                  <p className="text-xs text-green-500 mt-1">
                    {publishedPercentage.toFixed(0)}% of total
                  </p>
                </div>
                <Users className="text-green-600" size={28} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">This Month</p>
                  <p className="text-2xl font-bold text-purple-800">{stats.thisMonthPosts}</p>
                  <p className="text-xs text-purple-500 mt-1">
                    Recent activity
                  </p>
                </div>
                <Calendar className="text-purple-600" size={28} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Total Views</p>
                  <p className="text-2xl font-bold text-orange-800">{stats.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-orange-500 mt-1">
                    ~{avgViewsPerPost} per post
                  </p>
                </div>
                <Eye className="text-orange-600" size={28} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Messages</p>
                  <p className="text-2xl font-bold text-red-800">{unreadCount?.count || 0}</p>
                  {(unreadCount?.count || 0) > 0 && (
                    <Badge variant="destructive" className="text-xs mt-1">
                      Needs attention
                    </Badge>
                  )}
                </div>
                <Mail className="text-red-600" size={28} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-teal-600 font-medium">Engagement</p>
                  <p className="text-2xl font-bold text-teal-800">
                    {stats.topPosts.length > 0 ? (stats.topPosts[0].viewCount || 0) : 0}
                  </p>
                  <p className="text-xs text-teal-500 mt-1">
                    Top post views
                  </p>
                </div>
                <TrendingUp className="text-teal-600" size={28} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Analytics Section */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="text-yellow-500" size={20} />
                Top Performing Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topPosts.slice(0, 3).map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-slate-100 text-slate-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{post.title.substring(0, 30)}...</p>
                        <p className="text-xs text-slate-500">{post.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Eye size={14} className="mr-1" />
                      {(post.viewCount || 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="text-blue-500" size={20} />
                Content Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Published Rate</span>
                  <span className="font-medium">{publishedPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={publishedPercentage} className="h-2" />
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">Avg. Views/Post</span>
                    <span className="font-medium">{avgViewsPerPost}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Total Engagement</span>
                    <span className="font-medium">{stats.totalViews.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="text-purple-500" size={20} />
                Tag Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(stats.tagDistribution).map(([tag, count]) => (
                  <div key={tag} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                    <Badge variant="outline" className="text-xs">{tag}</Badge>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-1">
                        <div 
                          className="bg-purple-500 h-1 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(stats.tagDistribution))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-600 w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText size={16} />
            Posts Management
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare size={16} />
            Messages
            {(unreadCount?.count || 0) > 0 && (
              <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
                {unreadCount.count}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {/* Create Post Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Create New Post</CardTitle>
              <p className="text-slate-600 text-sm">Add new content to your blog</p>
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

          {/* Posts Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Manage Posts</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                    <SelectItem value="title">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPosts?.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-slate-800">{post.title}</h3>
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                          {post.category && (
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>{post.slug}.md</span>
                          <div className="flex items-center gap-1">
                            <Eye size={12} />
                            {(post.viewCount || 0).toLocaleString()} views
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
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
                  {filteredPosts?.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-slate-500">No posts found matching your criteria.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                Contact Submissions
                {(unreadCount?.count || 0) > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount?.count} new
                  </Badge>
                )}
              </CardTitle>
              <p className="text-slate-600 text-sm">Manage incoming contact form submissions</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contactSubmissions?.map((submission) => (
                  <div 
                    key={submission.id} 
                    className={`p-4 border rounded-lg transition-colors ${
                      !submission.isRead ? 'bg-blue-50 border-blue-200 shadow-sm' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="font-medium text-slate-800">{submission.subject}</h3>
                          {!submission.isRead && (
                            <Badge variant="destructive" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="bg-white p-3 rounded border border-slate-100 mb-3">
                          <p className="text-sm text-slate-600 mb-2">
                            <strong>From:</strong> {submission.name} ({submission.email})
                          </p>
                          <p className="text-sm text-slate-700">{submission.message}</p>
                        </div>
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
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto text-slate-400 mb-4" size={48} />
                    <p className="text-slate-500">No contact submissions yet.</p>
                    <p className="text-slate-400 text-sm mt-1">Messages will appear here when visitors contact you.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Publication Rate</span>
                      <span className="text-lg font-bold">{publishedPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={publishedPercentage} className="mb-2" />
                    <p className="text-xs text-slate-600">
                      {stats?.publishedPosts} published out of {stats?.totalPosts} total posts
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-700">{avgViewsPerPost}</p>
                      <p className="text-xs text-blue-600">Avg Views/Post</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-700">{stats?.thisMonthPosts}</p>
                      <p className="text-xs text-green-600">This Month</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Blog is active</p>
                      <p className="text-xs text-slate-600">
                        {stats?.publishedPosts} posts published
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Total engagement</p>
                      <p className="text-xs text-slate-600">
                        {stats?.totalViews.toLocaleString()} views across all posts
                      </p>
                    </div>
                  </div>

                  {(unreadCount?.count || 0) > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New messages</p>
                        <p className="text-xs text-slate-600">
                          {unreadCount?.count} unread contact submissions
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
