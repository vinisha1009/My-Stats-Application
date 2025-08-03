import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Redirect } from "wouter";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLogin = async (data: LoginData) => {
    await loginMutation.mutateAsync(data);
  };

  const onRegister = async (data: InsertUser) => {
    await registerMutation.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#0F0F23] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="text-center lg:text-left space-y-6">
          <h1 className="text-6xl lg:text-8xl font-orbitron font-black gradient-text animate-pulse-glow">
            ASCENSION
          </h1>
          <h2 className="text-4xl lg:text-6xl font-orbitron font-black gradient-text">
            PROTOCOL
          </h2>
          <p className="text-xl lg:text-2xl text-gray-300 font-inter">
            Elite Performance Enhancement System
          </p>
          <div className="space-y-4 text-gray-400">
            <p className="text-lg">Transform yourself into an elite hunter</p>
            <p>• Gamified skill development</p>
            <p>• Real-time progress tracking</p>
            <p>• Multiple realm specializations</p>
            <p>• Never lose your progress</p>
          </div>
        </div>

        {/* Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-[#1A1A2E] border-cyan-500/50 shadow-glow-blue">
            <CardHeader>
              <CardTitle className="text-3xl font-orbitron font-bold text-center text-cyan-400">
                Enter the Protocol
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 bg-[#0F0F23]">
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register"
                    className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4 mt-6">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-cyan-400">Hunter Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Enter your hunter name"
                                className="bg-[#0F0F23] border-cyan-500/30 focus:border-cyan-500 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-cyan-400">Access Code</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="password"
                                placeholder="Enter your access code"
                                className="bg-[#0F0F23] border-cyan-500/30 focus:border-cyan-500 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 font-semibold py-3"
                      >
                        {loginMutation.isPending ? "Accessing..." : "Enter Protocol"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4 mt-6">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-cyan-400">Choose Hunter Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Create your hunter identity"
                                className="bg-[#0F0F23] border-cyan-500/30 focus:border-cyan-500 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-cyan-400">Create Access Code</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="password"
                                placeholder="Secure your protocol access"
                                className="bg-[#0F0F23] border-cyan-500/30 focus:border-cyan-500 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-cyan-500 hover:to-purple-500 font-semibold py-3"
                      >
                        {registerMutation.isPending ? "Initializing..." : "Join Protocol"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}