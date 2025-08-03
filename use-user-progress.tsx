import { useQuery } from "@tanstack/react-query";
import { type UserProgress } from "@shared/schema";

export function useUserProgress() {
  const progressQuery = useQuery<UserProgress[]>({
    queryKey: ['/api/progress'],
  });

  return {
    userProgress: progressQuery.data || [],
    isLoading: progressQuery.isLoading,
    refetch: progressQuery.refetch,
  };
}
