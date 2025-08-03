import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type Task, type InsertTask, type UpdateTask, type XpEntry, type InsertXpEntry } from "@shared/schema";

export function useTasks() {
  const tasksQuery = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  const cautionTasksQuery = useQuery<Task[]>({
    queryKey: ['/api/tasks/caution'],
  });

  const xpEntriesQuery = useQuery<XpEntry[]>({
    queryKey: ['/api/xp-entries'],
  });

  const createTaskMutation = useMutation({
    mutationFn: async (task: InsertTask) => {
      const response = await apiRequest('POST', '/api/tasks', task);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/caution'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateTask & { id: string }) => {
      const response = await apiRequest('PATCH', `/api/tasks/${id}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/caution'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/tasks/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/caution'] });
    },
  });

  const createXpEntryMutation = useMutation({
    mutationFn: async (entry: InsertXpEntry) => {
      const response = await apiRequest('POST', '/api/xp-entries', entry);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/xp-entries'] });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    cautionTasks: cautionTasksQuery.data || [],
    xpEntries: xpEntriesQuery.data || [],
    isLoading: tasksQuery.isLoading,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    createXpEntry: createXpEntryMutation.mutateAsync,
    refetch: tasksQuery.refetch,
  };
}
