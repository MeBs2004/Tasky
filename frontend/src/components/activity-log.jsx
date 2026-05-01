import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { History, ChevronDown } from "lucide-react";
import { axiosClient } from "@/lib/axios-client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ActivityLog = ({ workspaceId, resourceType, resourceId }) => {
  const [expanded, setExpanded] = useState(false);
  const [filterAction, setFilterAction] = useState("");

  // Fetch audit logs
  const { data: logsData, isLoading } = useQuery({
    queryKey: ["auditLogs", resourceType, resourceId],
    queryFn: async () => {
      const response = await axiosClient.get(
        `/auditlog/${resourceType}/${resourceId}?limit=20`
      );
      return response.data;
    },
  });

  const logs = logsData?.data || [];

  const getActionColor = (action) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800";
      case "UPDATE":
        return "bg-blue-100 text-blue-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getChangeDisplay = (changes) => {
    if (!changes) return null;
    if (changes.oldValue === undefined)
      return `Added: ${JSON.stringify(changes.newValue)}`;
    if (changes.newValue === undefined)
      return `Removed: ${JSON.stringify(changes.oldValue)}`;
    return `Changed from "${changes.oldValue}" to "${changes.newValue}"`;
  };

  const filteredLogs = filterAction
    ? logs.filter((log) => log.action === filterAction)
    : logs;

  return (
    <div className="border rounded-lg p-4 bg-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 font-semibold text-lg w-full hover:bg-gray-50 p-2 rounded"
      >
        <History size={20} />
        <span>Activity History</span>
        <ChevronDown
          size={20}
          className={`ml-auto transform transition ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 border-t pt-4">
          {/* Filter */}
          <div>
            <label className="text-sm font-semibold mb-2 block">
              Filter by Action:
            </label>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Logs */}
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-gray-500 text-sm">Loading activity...</p>
            ) : filteredLogs.length === 0 ? (
              <p className="text-gray-500 text-sm">No activity yet</p>
            ) : (
              filteredLogs.map((log, index) => (
                <div
                  key={log._id || index}
                  className="border-l-4 border-gray-200 pl-4 pb-3"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getActionColor(log.action)}`}
                    >
                      {log.action}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {log.userId?.name || "System"}
                      </p>
                      {log.changes && (
                        <p className="text-sm text-gray-600">
                          {getChangeDisplay(log.changes)}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {format(
                          new Date(log.createdAt),
                          "MMM d, yyyy HH:mm:ss"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
