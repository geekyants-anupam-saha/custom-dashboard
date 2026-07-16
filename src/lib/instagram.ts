import { prisma } from "@/lib/prisma";

export type InstagramConfig = {
  instagram_business_id?: string;
  page_access_token?: string;
};

export async function readInstagramConfig(): Promise<InstagramConfig | null> {
  const pageName = process.env.PAGE_NAME;

  const account = pageName
    ? await prisma.facebookAccount.findFirst({
        where: { name: pageName },
      })
    : await prisma.facebookAccount.findFirst({
        orderBy: { createdAt: "desc" },
      });

  if (!account) {
    return null;
  }

  return {
    instagram_business_id: account.instagramBusinessAccountId,
    page_access_token: account.pageAccessToken,
  };
}

export async function writeInstagramConfig(config: InstagramConfig): Promise<void> {
  const pageName = process.env.PAGE_NAME;
  const account = pageName
    ? await prisma.facebookAccount.findFirst({ where: { name: pageName } })
    : await prisma.facebookAccount.findFirst({ orderBy: { createdAt: "desc" } });

  if (!account) {
    return;
  }

  await prisma.facebookAccount.update({
    where: { id: account.id },
    data: {
      pageAccessToken: config.page_access_token ?? account.pageAccessToken,
      instagramBusinessAccountId: config.instagram_business_id ?? account.instagramBusinessAccountId,
    },
  });
}
