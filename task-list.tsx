import { useTasks } from "@/hooks/use-tasks";
import { useUserProgress } from "@/hooks/use-user-progress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PencilIcon, TrashIcon, ArchiveBoxIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { calculateXpForDifficulty } from "@/lib/xp-calculator";
import { DIFFICULTY_LABELS } from "@/lib/constants";

interface TaskListProps {
  selectedRealm: string;
}

export default function TaskList({ selectedRealm }: TaskListProps) {
  const { tasks, updateTask, deleteTask } = useTasks();
  const { refetch: refetchProgress } = useUserProgress();

  const realmTasks = tasks.filter(task => task.realm === selectedRealm && !task.archived);

  const calculateTotalXp = () => {
    return realmTasks.reduce((total, task) => {
      const xpPerLevel = calculateXpForDifficulty(task.difficulty);
      return total + (task.completedLevels * xpPerLevel);
    }, 0);
  };

  const calculateMaxPossibleXp = () => {
    return realmTasks.reduce((total, task) => {
      const xpPerLevel = calculateXpForDifficulty(task.difficulty);
      return total + (task.totalLevels * xpPerLevel);
    }, 0);
  };

  const handleCompleteLevel = async (taskId: string, currentCompleted: number, totalLevels: number) => {
    if (currentCompleted < totalLevels) {
      await updateTask(taskId, { completedLevels: currentCompleted + 1 });
      refetchProgress();
    }
  };

  const handleArchiveTask = async (taskId: string) => {
    await updateTask(taskId, { archived: true });
  };

  const getDaysLeft = (deadline: string | null) => {
    if (!deadline) return null;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const getDaysLeftColor = (daysLeft: number | null) => {
    if (daysLeft === null) return 'text-gray-400';
    if (daysLeft <= 3) return 'text-red-400';
    if (daysLeft <= 7) return 'text-orange-400';
    return 'text-green-400';
  };

  return (
    <div className="lg:col-span-3">
      <div className="bg-[#1A1A2E] border border-cyan-500/50 rounded-xl p-6 min-h-[600px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-orbitron font-bold capitalize">
            {selectedRealm.replace('-', ' ')} Tasks
          </h3>
          <div className="text-sm text-gray-400">
            {calculateTotalXp().toLocaleString()} / {calculateMaxPossibleXp().toLocaleString()} XP
          </div>
        </div>

        <div className="space-y-4">
          {realmTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No tasks in this realm yet.</p>
              <p className="text-sm mt-2">Create your first task to begin your ascension!</p>
            </div>
          ) : (
            realmTasks.map((task) => {
              const progressPercentage = (task.completedLevels / task.totalLevels) * 100;
              const daysLeft = getDaysLeft(task.deadline);
              const isCompleted = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`task-item border rounded-lg p-4 transition-all duration-300 ${
                    isCompleted 
                      ? 'border-green-500/30 bg-green-900/10' 
                      : 'border-cyan-500/30 hover:border-cyan-500/60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        {task.name}
                        {isCompleted && <CheckCircleIcon className="h-5 w-5 text-green-400" />}
                      </h4>
                      
                      {isCompleted ? (
                        <div className="text-green-400 font-semibold mt-1 capitalize">
                          {task.type} Acquired - Lv: {task.totalLevels}
                        </div>
                      ) : (
                        <div className="flex gap-4 text-sm text-gray-400 mt-1">
                          <span className="capitalize">{task.type}</span>
                          {task.deadline && (
                            <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                          )}
                          {daysLeft !== null && (
                            <span className={getDaysLeftColor(daysLeft)}>
                              {daysLeft <= 0 ? 'Overdue' : `${daysLeft} days left`}
                            </span>
                          )}
                        </div>
                      )}

                      {isCompleted && task.createdAt && task.completedAt && (
                        <div className="text-sm text-gray-400 mt-1">
                          {new Date(task.createdAt).toLocaleDateString()} - {new Date(task.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {!isCompleted && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompleteLevel(task.id, task.completedLevels, task.totalLevels)}
                          disabled={task.completedLevels >= task.totalLevels}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {isCompleted ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleArchiveTask(task.id)}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          <ArchiveBoxIcon className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTask(task.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {!isCompleted && (
                    <>
                      <div className="xp-bar bg-gray-800 rounded-full h-3 mb-2">
                        <div
                          className={`h-full rounded-full ${progressPercentage === 0 ? 'bg-gray-700' : 'xp-fill'}`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>
                          {task.completedLevels > 0 ? `${task.completedLevels}/${task.totalLevels} levels completed` : `—/${task.totalLevels} levels`}
                        </span>
                        <span>Difficulty: {DIFFICULTY_LABELS[task.difficulty as keyof typeof DIFFICULTY_LABELS]}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
