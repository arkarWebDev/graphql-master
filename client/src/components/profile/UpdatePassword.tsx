import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { updateUserPassword } from "@/schema/user";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { UPDATE_NEW_PASSWORD } from "@/graphql/mutations/user";
import { CURRENT_USER } from "@/graphql/queries/user";

function UpdatePassword() {
  const [updateNewPassword, { loading, error }] = useMutation(
    UPDATE_NEW_PASSWORD,
    {
      onCompleted: () => {
        toast.success("Password updated.");
      },
      refetchQueries: [CURRENT_USER],
    }
  );

  const form = useForm<z.infer<typeof updateUserPassword>>({
    resolver: zodResolver(updateUserPassword),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof updateUserPassword>) {
    const userInput = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };

    try {
      await updateNewPassword({
        variables: {
          oldPassword: userInput.oldPassword,
          newPassword: userInput.newPassword,
        },
      });
    } catch (error: any) {
      form.reset();
      toast.error(error.message.split(":")[1]);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Password</CardTitle>
        <CardDescription className="text-red-600">
          Don't forget your new password!!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>Enter your old password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>Enter your new password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>Re-enter your new password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "updating ..." : "Update password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default UpdatePassword;
