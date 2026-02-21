import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

async function checkWorkspaceAccess(workspaceId: string, userId: string) {
  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  return member;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const includeArchived = searchParams.get("includeArchived") === "true";

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Worspace ID required" },
        { status: 400 },
      );
    }

    const member = await checkWorkspaceAccess(workspaceId, session.user.id);
    if (!member) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const pages = await prisma.page.findMany({
      where: {
        workspaceId,
        ...(includeArchived ? {} :{ isArchived:false}),
      },
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
      include: {
        children: {
          where: includeArchived ? {} :{ isArchived:false},
          orderBy: { position: "asc" },
        },
      },
    });
    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, icon, content, parentId, workspaceId } = body;

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID required" },
        { status: 400 },
      );
    }

    const member = await checkWorkspaceAccess(workspaceId,session.user.id);
    if(!member) {
        return NextResponse.json({error:"Acess denied"},{status:403})
    }

    if(member.role ==="viewer"){
        return NextResponse.json(
            {error:"Viewers cannot create pages"},
            {status:403}
        );
    }

    const lastPage = await prisma.page.findFirst({
      where: {
        workspaceId,
        parentId: parentId || null,
      },
      orderBy: { position: "desc" },
    });

    const page = await prisma.page.create({
      data: {
        title: title || "Untitled",
        icon: icon || "📝",
        content: content || "",
        parentId: parentId || null,
        position: lastPage ? lastPage.position + 1 : 0,
        workspaceId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ page });
  } catch (error) {
    console.error("Error creating page:", error);
    NextResponse.json({ error: "Failed to create Page" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 500 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: " Page id  required" },
        { status: 400 },
      );
    }

    const page = await prisma.page.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: updates,
    });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "page if is required" },
        { status: 400 },
      );
    }

    await prisma.page.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        isArchived: true,
      },
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
