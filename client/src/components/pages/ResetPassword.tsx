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
import { resetPassword as resetPasswordType } from "@/schema/user";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD_MUTATION } from "@/graphql/mutations/user";
import { CURRENT_USER } from "@/graphql/queries/user";
import { useNavigate, useParams } from "react-router";

function ResetPassword() {
  const params = useParams();
  const navigate = useNavigate();
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION, {
    onCompleted: () => {
      toast.success("Password updated.");
      navigate("/");
    },
    refetchQueries: [CURRENT_USER],
  });

  const form = useForm<z.infer<typeof resetPasswordType>>({
    resolver: zodResolver(resetPasswordType),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordType>) {
    const userInput = {
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword,
    };

    try {
      await resetPassword({
        variables: {
          newPassword: userInput.newPassword,
          confirmNewPassword: userInput.confirmNewPassword,
          token: params.token,
        },
      });
      form.reset();
    } catch (error: any) {
      form.reset();
      toast.error(error.message);
    }
  }

  return (
    <main className="layout space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Reset new password</CardTitle>
          <CardDescription className="text-red-600">
            Don't forget your new password!!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormDescription>
                      Re-enter your new password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating ..." : "Update password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}

export default ResetPassword;
