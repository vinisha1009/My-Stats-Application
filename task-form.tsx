import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTasks } from "@/hooks/use-tasks";
import { insertTaskSchema, type InsertTask } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { REALMS, DIFFICULTY_OPTIONS } from "@/lib/constants";
import { PlusIcon } from "@heroicons/react/24/outline";

interface TaskFormProps {
  onSuccess?: () => void;
}

export default function TaskForm({ onSuccess }: TaskFormProps) {
  const { createTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      name: "",
      type: "skills",
      realm: "scholar",
      deadline: null,
      notifyDays: 7,
      totalLevels: 1,
      completedLevels: 0,
      difficulty: "medium",
      status: "not_started",
      archived: false,
    },
  });

  const onSubmit = async (data: InsertTask) => {
    setIsSubmitting(true);
    try {
      await createTask(data);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 mb-8">
      <Card className="bg-[#1A1A2E] border-purple-500/50 shadow-glow-purple">
        <CardHeader>
          <CardTitle className="text-3xl font-orbitron font-bold text-center text-purple-400">
            Create New Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Task Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter task name"
                        className="bg-[#0F0F23] border-cyan-500/30 focus:border-cyan-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#0F0F23] border-cyan-500/30 focus:border-cyan-500">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="abilities">Abilities</SelectItem>
                        <SelectItem value="skills">Skills</SelectItem>
                        <SelectItem value="physical">Physical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="realm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Realm</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#0F0F23] border-cyan-500/30 focus:border-cyan-500">
                          <SelectValue placeholder="Select realm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(REALMS).map(([key, realm]) => (
                          <SelectItem key={key} value={key}>
                            {realm.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Deadline</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                        className="bg-[#0F0F23] border-cyan-500/30 focus:border-cyan-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notifyDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Notify When (Days Left)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="7"
                        className="bg-[#0F0F23] border-cyan-500/30 focus:border-cyan-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalLevels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Number of Parts/Levels</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        placeholder="10"
                        min="1"
                        className="bg-[#0F0F23] border-cyan-500/30 focus:border-cyan-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-sm font-semibold">Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#0F0F23] border-cyan-500/30 focus:border-cyan-500">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DIFFICULTY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label} ({option.xp} XP)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 text-center mt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-cyan-500 hover:to-purple-500 px-12 py-4 text-lg font-semibold shadow-glow-purple transform hover:scale-105 transition-all duration-300"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  {isSubmitting ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
