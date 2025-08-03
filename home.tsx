import { useState } from "react";
import LiveClock from "@/components/live-clock";
import MegaLevelDisplay from "@/components/mega-level-display";
import RealmSelector from "@/components/realm-selector";
import TaskList from "@/components/task-list";
import TaskForm from "@/components/task-form";
import XpForm from "@/components/xp-form";
import CautionModal from "@/components/caution-modal";
import ArchiveTable from "@/components/archive-table";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon, PlusIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useTasks } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const [selectedRealm, setSelectedRealm] = useState("scholar");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCautionModal, setShowCautionModal] = useState(false);
  const { cautionTasks } = useTasks();
  const { user, logoutMutation } = useAuth();

  const scrollToTaskForm = () => {
    setShowTaskForm(true);
    setTimeout(() => {
      document.getElementById("task-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#0F0F23]">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-cyan-500/30">
        <div className="flex items-center gap-4">
          {/* Caution Button */}
          <div className="relative">
            <Button
              variant="destructive"
              onClick={() => setShowCautionModal(true)}
              className="shadow-glow-blue flex items-center gap-2 font-semibold"
            >
              <ExclamationTriangleIcon className="h-5 w-5" />
              Caution
            </Button>
            {cautionTasks.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                {cautionTasks.length}
              </span>
            )}
          </div>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 font-orbitron">Hunter: {user.username}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          )}
        </div>

        {/* Live Clock */}
        <LiveClock />
      </header>

      {/* Main Title */}
      <div className="text-center py-8">
        <h1 className="text-6xl font-orbitron font-black gradient-text animate-pulse-glow">
          ASCENSION PROTOCOL
        </h1>
        <p className="text-xl text-gray-400 mt-2 font-inter">Elite Performance Enhancement System</p>
      </div>

      {/* Mega Level Display */}
      <MegaLevelDisplay />

      {/* Add Task Button */}
      <div className="text-center mb-8">
        <Button
          onClick={scrollToTaskForm}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-purple-500 hover:to-cyan-500 px-8 py-4 text-lg font-semibold shadow-glow-blue transform hover:scale-105 transition-all duration-300"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Task
        </Button>
      </div>

      {/* Realm Task Manager */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <RealmSelector selectedRealm={selectedRealm} onRealmSelect={setSelectedRealm} />
          <TaskList selectedRealm={selectedRealm} />
        </div>
      </div>

      {/* Task Creation Form */}
      {showTaskForm && (
        <div id="task-form">
          <TaskForm onSuccess={() => setShowTaskForm(false)} />
        </div>
      )}

      {/* XP Entry Form */}
      <XpForm />

      {/* Archive Section */}
      <ArchiveTable />

      {/* Caution Modal */}
      <CautionModal 
        isOpen={showCautionModal} 
        onClose={() => setShowCautionModal(false)} 
      />
    </div>
  );
}
