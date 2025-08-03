import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTasks } from "@/hooks/use-tasks";
import { useUserProgress } from "@/hooks/use-user-progress";
import { insertXpEntrySchema, type InsertXpEntry } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { REALMS, DIFFICULTY_OPTIONS } from "@/lib/constants";
import { BoltIcon } from "@heroicons/react/24/outline";

export default function XpForm() {
  const { createXpEntry } = useTasks();
  const { refetch: refetchProgress } = useUserProgress();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InsertXpEntry>({
    resolver: zodResolver(insertXpEntrySchema),
    defaultValues: {
      name: "",
      type: "skills",
      realm: "scholar",
      difficulty: "medium",
      xpAmount: 0,
    },
  });

  const onSubmit = async (data: InsertXpEntry) => {
    setIsSubmitting(true);
    try {
      await createXpEntry(data);
      form.reset();
      refetchProgress();
    } catch (error) {
      console.error("Failed to create XP entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 mb-8">
      <Card className="bg-[#1A1A2E] border-yellow-500/50 shadow-glow-gold">
        <CardHeader>
          <CardTitle className="text-3xl font-orbitron font-bold text-center text-yellow-400">
            Add Instant XP
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
                    <FormLabel className="text-sm font-semibold">Achievement Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="What did you accomplish?"
                        className="bg-[#0F0F23] border-yellow-500/30 focus:border-yellow-500"
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
                        <SelectTrigger className="bg-[#0F0F23] border-yellow-500/30 focus:border-yellow-500">
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
                        <SelectTrigger className="bg-[#0F0F23] border-yellow-500/30 focus:border-yellow-500">
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
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">XP Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#0F0F23] border-yellow-500/30 focus:border-yellow-500">
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
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 px-12 py-4 text-lg font-semibold shadow-glow-gold transform hover:scale-105 transition-all duration-300 text-black"
                >
                  <BoltIcon className="h-5 w-5 mr-2" />
                  {isSubmitting ? "Adding..." : "Add XP"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
