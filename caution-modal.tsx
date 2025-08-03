import { useTasks } from "@/hooks/use-tasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface CautionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CautionModal({ isOpen, onClose }: CautionModalProps) {
  const { cautionTasks } = useTasks();

  const getDaysLeft = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A2E] border-red-500 max-w-4xl shadow-glow-blue">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-orbitron font-bold text-red-400 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-6 w-6" />
              Caution: Approaching Deadlines
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="overflow-x-auto">
          {cautionTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-lg">No approaching deadlines!</p>
              <p className="text-sm mt-2">All your tasks are on track.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-red-500/30">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Realm</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Days Left</th>
                </tr>
              </thead>
              <tbody>
                {cautionTasks.map((task) => {
                  const daysLeft = getDaysLeft(task.deadline!);
                  return (
                    <tr key={task.id} className="border-b border-gray-700">
                      <td className="py-3 px-4">{task.name}</td>
                      <td className="py-3 px-4">
                        {new Date(task.deadline!).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 capitalize">{task.type}</td>
                      <td className="py-3 px-4 capitalize">{task.realm.replace('-', ' ')}</td>
                      <td className="py-3 px-4">
                        {task.completedLevels}/{task.totalLevels}
                      </td>
                      <td className={`py-3 px-4 font-semibold ${
                        daysLeft <= 0 ? 'text-red-500' : 
                        daysLeft <= 3 ? 'text-red-400' : 'text-orange-400'
                      }`}>
                        {daysLeft <= 0 ? 'Overdue' : `${daysLeft} days`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
