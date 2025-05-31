import { registerSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useMutation, useReactiveVar } from "@apollo/client";
import { REGISTER_MUTATION } from "@/graphql/mutations/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { isAuthenticatedVar } from "@/apollo/apollo-vars";
import { useEffect } from "react";

const RegisterPage = () => {
  const naviagte = useNavigate();
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);

  useEffect(() => {
    if (isAuthenticated) naviagte("/");
  }, [isAuthenticated]);

  const [register, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted() {
      toast.success("Registartion successful.");
      return naviagte("/login");
    },
  });

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const userInput = {
      email: values.email,
      name: values.name,
      password: values.password,
    };

    try {
      await register({
        variables: { userInput },
      });
    } catch (error: any) {
      // form.reset()
      toast.error(error.message.split(":")[1]);
    }
  }

  return (
    <section className="layout w-1/4 mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Register new account</CardTitle>
          <CardDescription>
            Create your new account & enojoy our services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Bagan" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@baganhotel.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is primary email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default RegisterPage;
