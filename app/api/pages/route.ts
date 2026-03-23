import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const workspaceId = searchParams.get("workspaceId");
    const includeArchived = searchParams.get("includeArchived") === "true";

    // Fetch single page by ID
    if (id) {
      const page = await prisma.page.findUnique({
        where: { id },
      });

      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }

      // Check if user has access to this page's workspace
      const member = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: page.workspaceId,
            userId: session.user.id,
          },
        },
      });

      if (!member) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      return NextResponse.json({ page });
    }

    // Fetch pages by workspace
    if (workspaceId) {
      // Check if user is a member
      const member = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId: session.user.id,
          },
        },
      });

      if (!member) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const pages = await prisma.page.findMany({
        where: {
          workspaceId,
          ...(includeArchived ? {} : { isArchived: false }),
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      return NextResponse.json({ pages });
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error) {
    console.error("Error in GET /api/pages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    console.log(" POST /api/pages - Session:", session?.user?.id);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log(" POST /api/pages - Body:", body);

    const { title, icon, content, workspaceId, parentId } = body;

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID required" },
        { status: 400 },
      );
    }

    // Check if user is a member of the workspace
    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: session.user.id,
        },
      },
    });

    if (!member) {
      console.error(" User not a member of workspace");
      return NextResponse.json(
        { error: "Access denied - not a workspace member" },
        { status: 403 },
      );
    }

    // Check for recent duplicate creation (within 2 seconds)
    const recentPage = await prisma.page.findFirst({
      where: {
        workspaceId,
        title,
        createdAt: {
          gte: new Date(Date.now() - 2000),
        },
      },
    });

    if (recentPage) {
      console.log(" Prevented duplicate page creation");
      return NextResponse.json({ page: recentPage });
    }

    // Create the page
    const page = await prisma.page.create({
      data: {
        title: title || "Untitled",
        icon: icon || "📝",
        content: content || "",
        workspaceId,
        parentId: parentId || null,
      },
    });

    console.log(" Page created successfully:", page.id);
    return NextResponse.json({ page });
  } catch (error: any) {
    console.error(" Error in POST /api/pages:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create page" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Page ID required" }, { status: 400 });
    }

    // Get the page to check workspace access
    const existingPage = await prisma.page.findUnique({
      where: { id },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Check if user has access
    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: existingPage.workspaceId,
          userId: session.user.id,
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const page = await prisma.page.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ page });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Page ID required" }, { status: 400 });
    }

    // Get the page to check workspace access
    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Check if user has access
    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: page.workspaceId,
          userId: session.user.id,
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 },
    );
  }
}
