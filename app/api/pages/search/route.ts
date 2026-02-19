import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const query = searchParams.get("query") || "";

    if (!workspaceId || query) {
      return NextResponse.json(
        { error: "Workspace ID and query required" },
        { status: 400 },
      );
    }

    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: session.user.id,
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Acess denied" }, { status: 403 });
    }

    const results = await prisma.page.findMany({
      where: {
        workspaceId,
        isArchived: false,
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: [{ updatedAt: "desc" }],
      take: 20,
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error searching pages:", error);
    return NextResponse.json(
      { error: "Failed to search pages" },
      { status: 500 },
    );
  }
}
