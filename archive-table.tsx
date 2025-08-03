import { useTasks } from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ArchiveTable() {
  const { tasks, updateTask, deleteTask } = useTasks();

  const archivedTasks = tasks.filter(task => task.archived);

  const handleRestoreTask = async (taskId: string) => {
    await updateTask(taskId, { archived: false });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 mb-12">
      <Card className="bg-[#1A1A2E] border-gray-500/50">
        <CardHeader>
          <CardTitle className="text-3xl font-orbitron font-bold text-center text-gray-400">
            Archived Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {archivedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-lg">No archived tasks yet.</p>
              <p className="text-sm mt-2">Completed tasks will appear here when archived.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Realm</th>
                    <th className="py-3 px-4">Completed</th>
                    <th className="py-3 px-4">XP Earned</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedTasks.map((task) => (
                    <tr key={task.id} className="border-b border-gray-700 hover:bg-[#0F0F23]/50">
                      <td className="py-3 px-4">{task.name}</td>
                      <td className="py-3 px-4 capitalize">{task.type}</td>
                      <td className="py-3 px-4 capitalize">{task.realm.replace('-', ' ')}</td>
                      <td className="py-3 px-4">
                        {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        {/* Calculate XP based on difficulty and levels */}
                        {/* This would be calculated based on the XP system */}
                        —
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestoreTask(task.id)}
                          className="text-blue-400 hover:text-blue-300 mr-2"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTask(task.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
