import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { axiosClient } from "@/lib/axios-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export const CommentSection = ({ taskId, workspaceId }) => {
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch comments
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      const response = await axiosClient.get(`/comment/task/${taskId}`);
      return response.data.data;
    },
  });

  // Create comment
  const createMutation = useMutation({
    mutationFn: async (content) => {
      const response = await axiosClient.post(
        `/comment/task/${taskId}/create`,
        { content }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      setCommentText("");
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  // Update comment
  const updateMutation = useMutation({
    mutationFn: async ({ commentId, content }) => {
      const response = await axiosClient.put(
        `/comment/${commentId}/update`,
        { content }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      setEditingId(null);
      setEditText("");
      toast({
        title: "Success",
        description: "Comment updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update comment",
        variant: "destructive",
      });
    },
  });

  // Delete comment
  const deleteMutation = useMutation({
    mutationFn: async (commentId) => {
      await axiosClient.delete(`/comment/${commentId}/delete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete comment",
        variant: "destructive",
      });
    },
  });

  const handleAddComment = () => {
    if (commentText.trim()) {
      createMutation.mutate(commentText);
    }
  };

  const handleUpdateComment = () => {
    if (editText.trim() && editingId) {
      updateMutation.mutate({ commentId: editingId, content: editText });
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Comment */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Comments</h3>
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={handleAddComment}
            disabled={createMutation.isPending || !commentText.trim()}
            className="gap-2"
          >
            <Plus size={16} />
            Add Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading comments...</div>
        ) : !commentsData || commentsData.length === 0 ? (
          <div className="text-center text-gray-500">No comments yet</div>
        ) : (
          commentsData.map((comment) => (
            <div
              key={comment._id}
              className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
            >
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.userId?.profilePicture}
                      alt={comment.userId?.name}
                    />
                    <AvatarFallback>
                      {comment.userId?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">
                      {comment.userId?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(comment.createdAt), "MMM d, yyyy HH:mm")}
                      {comment.edited && " (edited)"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(comment._id);
                      setEditText(comment.content);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(comment._id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Comment Content */}
              {editingId === comment._id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleUpdateComment}
                      disabled={updateMutation.isPending}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
