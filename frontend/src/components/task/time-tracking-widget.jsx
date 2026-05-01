import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Play, Pause, Plus, Trash2, Clock } from "lucide-react";
import { axiosClient } from "@/lib/axios-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export const TimeTrackingWidget = ({ taskId, projectId, workspaceId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch time logs
  const { data: timeLogsData, isLoading } = useQuery({
    queryKey: ["timeLogs", taskId],
    queryFn: async () => {
      const response = await axiosClient.get(`/timelog/tasks/${taskId}`);
      return response.data;
    },
  });

  // Add time log
  const addMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosClient.post(
        `/timelog/projects/${projectId}/tasks/${taskId}/create`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeLogs", taskId] });
      setDuration("");
      setDescription("");
      setTimerSeconds(0);
      toast({
        title: "Success",
        description: "Time logged successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to log time",
        variant: "destructive",
      });
    },
  });

  // Delete time log
  const deleteMutation = useMutation({
    mutationFn: async (timeLogId) => {
      await axiosClient.delete(`/timelog/${timeLogId}/delete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeLogs", taskId] });
      toast({
        title: "Success",
        description: "Time log deleted",
      });
    },
  });

  // Timer logic
  React.useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleAddTime = () => {
    if (!duration && timerSeconds === 0) {
      toast({
        title: "Error",
        description: "Please enter time duration or use timer",
        variant: "destructive",
      });
      return;
    }

    const minutes = timerSeconds > 0 ? Math.floor(timerSeconds / 60) : parseInt(duration);

    if (minutes <= 0) {
      toast({
        title: "Error",
        description: "Duration must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    addMutation.mutate({
      duration: minutes,
      description,
    });
  };

  const timeLogs = timeLogsData?.data || [];
  const summary = timeLogsData?.summary || {};

  return (
    <div className="border rounded-lg p-4 bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 font-semibold text-lg w-full hover:bg-gray-50 p-2 rounded"
      >
        <Clock size={20} />
        <span>Time Tracking</span>
        <span className="ml-auto text-sm font-normal text-gray-600">
          {summary.totalHours} hrs
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 border-t pt-4">
          {/* Timer */}
          <div className="space-y-2 bg-gray-50 p-3 rounded">
            <p className="text-2xl font-mono font-bold text-center">
              {formatTime(timerSeconds)}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                onClick={() => setTimerRunning(!timerRunning)}
                variant={timerRunning ? "destructive" : "default"}
              >
                {timerRunning ? (
                  <>
                    <Pause size={16} className="mr-1" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play size={16} className="mr-1" />
                    Start
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setTimerSeconds(0);
                  setTimerRunning(false);
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Manual Duration */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Or enter minutes:</label>
            <Input
              type="number"
              placeholder="Minutes"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Description:</label>
            <Textarea
              placeholder="What did you work on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Add Button */}
          <Button
            onClick={handleAddTime}
            disabled={addMutation.isPending}
            className="w-full gap-2"
          >
            <Plus size={16} />
            Log Time
          </Button>

          {/* Time Logs List */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-semibold text-sm">Recent Logs</h4>
            {isLoading ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : timeLogs.length === 0 ? (
              <p className="text-gray-500 text-sm">No time logs yet</p>
            ) : (
              timeLogs.slice(0, 5).map((log) => (
                <div
                  key={log._id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                >
                  <div>
                    <p className="font-semibold">
                      {log.duration} min • {format(new Date(log.date), "MMM d")}
                    </p>
                    {log.description && (
                      <p className="text-gray-600 text-xs">{log.description}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(log._id)}
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
