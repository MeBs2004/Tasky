import { getProjectsInWorkspaceQueryFn } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useGetProjectsInWorkspaceQuery = ({
  workspaceId,
  pageSize,
  pageNumber,
  skip = false,
}) => {
  const query = useQuery({
    queryKey: ["allProjects", workspaceId, pageNumber, pageSize],
    queryFn: () =>
      getProjectsInWorkspaceQueryFn({
        workspaceId,
        pageSize,
        pageNumber,
      }),
    staleTime: Infinity,
    placeholderData: skip ? undefined : keepPreviousData,
    enabled: !skip,
  });
  return query;
};

export default useGetProjectsInWorkspaceQuery;
