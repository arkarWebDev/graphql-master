import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useMutation, useReactiveVar } from "@apollo/client";
import { userInfoVar } from "@/apollo/apollo-vars";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AVATAR_UPLOAD_MUTATION } from "@/graphql/mutations/user";
import { toast } from "sonner";
import { CURRENT_USER } from "@/graphql/queries/user";

function AvatarUpload() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const user = useReactiveVar(userInfoVar);

  const [avatarUpload, { loading, error }] = useMutation(
    AVATAR_UPLOAD_MUTATION,
    {
      onCompleted: () => {
        toast.success("Avatar uploaded.");
      },
      refetchQueries: [CURRENT_USER],
    }
  );

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result as string);
      }
    };

    reader.readAsDataURL(e.target.files![0]);
  };

  const submitHandler = async () => {
    await avatarUpload({
      variables: { image: avatar },
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload avatar</CardTitle>
        <CardDescription>upload your profile photo.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatar ? avatar : user?.avatar.url} />
              <AvatarFallback className="bg-black text-white font-bold">
                {user?.name.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Input
              id="avatar"
              type="file"
              accept="images/*"
              onChange={onChangeHandler}
              className="mt-2"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !avatar}
            onClick={submitHandler}
          >
            {loading ? "Uploading ..." : "Upload"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AvatarUpload;
