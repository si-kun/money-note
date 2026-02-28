import { prisma } from "../prisma/prisma";
import { getAuthUser } from "./getUser";

export const getAuthUserWithProfile = async () => {
  const user = await getAuthUser();

  const userProfile = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!userProfile) throw new Error("ユーザーが見つかりません");

  return userProfile;
};
