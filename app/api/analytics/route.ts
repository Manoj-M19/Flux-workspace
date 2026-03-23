import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    console.log(" Analytics API called");

    const session = await getServerSession(authOptions);
    console.log(
      " Session:",
      session?.user?.id ? "Authenticated" : "Not authenticated",
    );

    if (!session?.user?.id) {
      console.error(" No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    console.log(" Requested userId:", userId);
    console.log(" Session userId:", session.user.id);

    if (!userId) {
      console.error(" No userId provided");
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    if (userId !== session.user.id) {
      console.error(" User ID mismatch");
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    console.log(" Fetching workspace members...");

    // Get user's workspaces
    const workspaceMembers = await prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            pages: {
              where: { isArchived: false },
            },
          },
        },
      },
    });

    console.log(` Found ${workspaceMembers.length} workspace memberships`);

    const workspaceIds = workspaceMembers.map((m) => m.workspaceId);

    if (workspaceIds.length === 0) {
      console.log(" User has no workspaces");
      return NextResponse.json({
        totalItems: 0,
        completedTasks: 0,
        totalTasks: 0,
        recentItems: [],
        totalComments: 0,
      });
    }

    // Get all pages across all workspaces
    const allPages = await prisma.page.findMany({
      where: {
        workspaceId: { in: workspaceIds },
        isArchived: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 10,
      include: {
        workspace: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(` Found ${allPages.length} pages`);

    // Get comments count
    const totalComments = await prisma.comment.count({
      where: {
        page: {
          workspaceId: { in: workspaceIds },
        },
      },
    });

    console.log(` Found ${totalComments} comments`);

    // Calculate analytics
    const totalItems = allPages.length;
    const totalTasks = 0;
    const completedTasks = 0;

    // Recent items (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentItems = allPages
      .filter((page) => new Date(page.updatedAt) > sevenDaysAgo)
      .map((page) => ({
        id: page.id,
        title: page.title,
        icon: page.icon || "📝",
        workspace: page.workspace.name,
        updatedAt: page.updatedAt,
        type: "page",
      }));

    console.log(` Returning analytics with ${recentItems.length} recent items`);

    return NextResponse.json({
      totalItems,
      completedTasks,
      totalTasks,
      recentItems,
      totalComments,
    });
  } catch (error: any) {
    console.error(" Analytics API Error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return NextResponse.json(
      {
        error: error.message || "Failed to fetch analytics",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
