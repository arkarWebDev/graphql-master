import { User } from "@/types/User";
import { makeVar } from "@apollo/client";

export const isAuthenticatedVar = makeVar(false);
export const userInfoVar = makeVar<null | User>(null);
export const isLoadingVar = makeVar(true);
