
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, X, Mail, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ContactSubmission } from "@shared/schema";

interface NotificationBoxProps {
  isAuthenticated: boolean;
}

export default function NotificationBox({ isAuthenticated }: NotificationBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: unreadCount } = useQuery<{ count: number }>({
    queryKey: ["/api/admin/contact-submissions/unread-count"],
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: contactSubmissions } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contact-submissions"],
    enabled: isAuthenticated && isOpen,
  });

  const unreadSubmissions = contactSubmissions?.filter(submission => !submission.isRead) || [];
  const hasNotifications = (unreadCount?.count || 0) > 0;

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "relative",
          hasNotifications && "border-red-200 bg-red-50 hover:bg-red-100"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={16} className={hasNotifications ? "text-red-600" : "text-slate-600"} />
        {hasNotifications && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount?.count}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <Card className="absolute top-full right-0 mt-2 w-96 max-h-96 overflow-hidden z-50 shadow-lg border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Mail size={18} className="mr-2" />
                  Notifications
                  {hasNotifications && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadCount?.count} new
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X size={14} />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {hasNotifications ? (
                <div className="max-h-64 overflow-y-auto">
                  {unreadSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => {
                        setIsOpen(false);
                        // Scroll to contact submissions section
                        document.getElementById('contact-submissions')?.scrollIntoView({ 
                          behavior: 'smooth' 
                        });
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-800 truncate">
                            {submission.subject}
                          </p>
                          <p className="text-xs text-slate-600 truncate">
                            From: {submission.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {submission.message}
                          </p>
                          <div className="flex items-center text-xs text-slate-400 mt-1">
                            <Clock size={10} className="mr-1" />
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs ml-2 shrink-0">
                          New
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500">
                  <Bell size={24} className="mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No new notifications</p>
                </div>
              )}
              
              {hasNotifications && (
                <div className="p-3 border-t bg-slate-50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false);
                      document.getElementById('contact-submissions')?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }}
                  >
                    View All Contact Submissions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
