import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

const useTaskTableFilter = () => {
  return useQueryStates({
    status: parseAsStringEnum(Object.values(TaskStatusEnum)),
    priority: parseAsStringEnum(Object.values(TaskPriorityEnum)),
    keyword: parseAsString,
    projectId: parseAsString,
    assigneeId: parseAsString,
  });
};

export default useTaskTableFilter;
