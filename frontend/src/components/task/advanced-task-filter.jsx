import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, X } from "lucide-react";
import { axiosClient } from "@/lib/axios-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const AdvancedTaskFilter = ({
  workspaceId,
  onFilter,
  savedFilters = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    assignee: "",
    project: "",
    dueDate: "",
  });
  const [savedFilterName, setSavedFilterName] = useState("");

  // Fetch members for assignee filter
  const { data: membersData } = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await axiosClient.get(
        `/member/workspace/${workspaceId}`
      );
      return response.data.data;
    },
  });

  // Fetch projects for project filter
  const { data: projectsData } = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await axiosClient.get(
        `/project/workspace/${workspaceId}/all`
      );
      return response.data.data;
    },
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "",
      priority: "",
      assignee: "",
      project: "",
      dueDate: "",
    });
    onFilter({});
  };

  const activeFilterCount = Object.values(filters).filter((v) => v).length;

  const statusOptions = [
    { value: "BACKLOG", label: "Backlog" },
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "IN_REVIEW", label: "In Review" },
    { value: "DONE", label: "Done" },
  ];

  const priorityOptions = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
  ];

  return (
    <div className="border rounded-lg p-4 bg-white">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 font-semibold w-full hover:bg-gray-50 p-2 rounded"
      >
        <Filter size={18} />
        <span>Advanced Filters</span>
        {activeFilterCount > 0 && (
          <Badge className="ml-auto" variant="secondary">
            {activeFilterCount}
          </Badge>
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 border-t pt-4">
          {/* Search */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Search</label>
            <Input
              placeholder="Search tasks by title..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              icon={<Search size={16} />}
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Status</label>
            <Select value={filters.status} onValueChange={(v) => handleFilterChange("status", v)}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Priority</label>
            <Select value={filters.priority} onValueChange={(v) => handleFilterChange("priority", v)}>
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All priorities</SelectItem>
                {priorityOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignee */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Assigned To</label>
            <Select value={filters.assignee} onValueChange={(v) => handleFilterChange("assignee", v)}>
              <SelectTrigger>
                <SelectValue placeholder="All members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All members</SelectItem>
                {membersData?.map((member) => (
                  <SelectItem key={member._id} value={member._id}>
                    {member.userId?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Project</label>
            <Select value={filters.project} onValueChange={(v) => handleFilterChange("project", v)}>
              <SelectTrigger>
                <SelectValue placeholder="All projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All projects</SelectItem>
                {projectsData?.map((project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Due Date</label>
            <Input
              type="date"
              value={filters.dueDate}
              onChange={(e) => handleFilterChange("dueDate", e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="flex-1 gap-2"
            >
              <X size={16} />
              Clear
            </Button>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="bg-blue-50 p-3 rounded space-y-2">
              <p className="text-sm font-semibold">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(
                  ([key, value]) =>
                    value && (
                      <Badge
                        key={key}
                        variant="secondary"
                        className="gap-1 cursor-pointer hover:bg-gray-300"
                        onClick={() => handleFilterChange(key, "")}
                      >
                        {key}: {value}
                        <X size={12} />
                      </Badge>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
