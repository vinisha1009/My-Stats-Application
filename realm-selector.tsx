import { useTasks } from "@/hooks/use-tasks";
import { REALMS } from "@/lib/constants";

interface RealmSelectorProps {
  selectedRealm: string;
  onRealmSelect: (realm: string) => void;
}

export default function RealmSelector({ selectedRealm, onRealmSelect }: RealmSelectorProps) {
  const { tasks } = useTasks();

  const getRealmProgress = (realmKey: string) => {
    const realmTasks = tasks.filter(task => task.realm === realmKey);
    const completedTasks = realmTasks.filter(task => task.status === 'completed').length;
    return `${completedTasks}/${realmTasks.length} Tasks`;
  };

  return (
    <div className="lg:col-span-1">
      <h3 className="text-2xl font-orbitron font-bold mb-6 text-center">Realms</h3>
      
      <div className="space-y-3">
        {Object.entries(REALMS).map(([key, realm]) => (
          <div
            key={key}
            onClick={() => onRealmSelect(key)}
            className={`realm-card bg-[#1A1A2E] border ${
              selectedRealm === key 
                ? 'ring-2 ring-cyan-400 shadow-glow-blue border-cyan-500/50' 
                : 'border-cyan-500/30 hover:border-cyan-500/60'
            } p-4 rounded-lg cursor-pointer transition-all duration-300`}
          >
            <div className="flex items-center gap-3">
              <i className={`${realm.icon} ${realm.color} text-xl`}></i>
              <div>
                <div className="font-semibold">{realm.name}</div>
                <div className="text-sm text-gray-400">
                  {getRealmProgress(key)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
