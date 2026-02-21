import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {
        const session = await getServerSession(authOptions);
        if(!session?.user?.id) {
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }

        const {searchParams} = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");

        if(!workspaceId) {
            return NextResponse.json({error:"workspace ID required"},{ status:401});
        }

        const members = await prisma.workspaceMember.findMany({
            where:{workspaceId},
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        image:true,
                    },
                },
            },
        });

        return NextResponse.json({ members});
    } catch (error) {
        console.error("Error fetching members:",error);
        return NextResponse.json({error:"Failed to fetch members"},{status:500});
    }
}

export async function POST(req:Request) {
    try {
        const session = await getServerSession(authOptions);
        if(!session?.user?.id) {
            return NextResponse.json({error:"Unauthenticated"},{status:401});
        }

        const body = await req.json();
        const {workspaceId,email,role ="member"} =body;

        if(!workspaceId || !email) {
            return NextResponse.json(
                {error:"Workspace ID and email required"},
                {status:400}
            );
        }

        const requestMembership = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId:session.user.id,
                },
            },
        });

        if(!requestMembership || !["owner","admin"].includes(requestMembership.role)) {
            return NextResponse.json(
                {error:"Only owners and admins can invite members"},
                {status:403}
            );
        }

        
       const invitedUser = await prisma.user.findUnique({
        where:{email},
       });

       if(!invitedUser) {
         return NextResponse.json(
         {error:"User not found. They need to create an account first"},
         {status:404}
         );
       }

       const existingMember = await prisma.workspaceMember.findUnique({
        where:{
            workspaceId_userId:{
                workspaceId,
                userId:invitedUser.id,
            },
        },
       });

       if(existingMember) {
        return NextResponse.json(
            {error:"User is already a member of this workspace"},
            {status:400}
        );
       }

       const member =await prisma.workspaceMember.create({
        data:{
            workspaceId,
            userId:invitedUser.id,
            role,
        },
        include:{
            user:{
                select:{
                    id:true,
                    name:true,
                    email:true,
                    image:true,
                },
            },
        },
       });

       return NextResponse.json({member});
    } catch (error) {
        console.error("Error inviting member:",error);
        return NextResponse.json(
            {error:"Failed to invite member"},
            {status:500}
        );
    }
}

export async function DELETE(req:Request) {
    try {
        const session = await getServerSession(authOptions);
        if(!session?.user?.id) {
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }

        const {searchParams} = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");
        const userId = searchParams.get("userId");

        if(!workspaceId || !userId) {
            return NextResponse.json({error:"Workspace ID and User ID required"},{status:400});
        }

        // Check if requester is owner or admin
        const requestMembership = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId:session.user.id,
                },
            },
        });

        if(!requestMembership || !["owner","admin"].includes(requestMembership.role)) {
            return NextResponse.json(
                {error:"Only owners and admins can remove members"},
                {status:403}
            );
        }
   
        // Dont allow removing the owner
        const memberToRemove = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId,
                },
            },
        });

        if(memberToRemove?.role ==="owner") {
            return NextResponse.json({error:"Cannot remove workspace owner"},{status:403});
        }

        await prisma.workspaceMember.delete({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId,
                },
            },
        });

        return NextResponse.json({success:true});
    } catch(error) {
        console.error("Error removing member:",error);
        return NextResponse.json({error:"Failed to remove member"},{status:500});
    }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { workspaceId, userId, role } = body;

    if (!workspaceId || !userId || !role) {
      return NextResponse.json(
        { error: "Workspace ID, User ID, and role required" },
        { status: 400 }
      );
    }

    // Check if requester is owner
    const requesterMembership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: session.user.id,
        },
      },
    });

    if (requesterMembership?.role !== "owner") {
      return NextResponse.json(
        { error: "Only workspace owner can change roles" },
        { status: 403 }
      );
    }

    // Don't allow changing owner role
    const memberToUpdate = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (memberToUpdate?.role === "owner") {
      return NextResponse.json(
        { error: "Cannot change owner role" },
        { status: 403 }
      );
    }

    // Update role
    const updatedMember = await prisma.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ member: updatedMember });
  } catch (error) {
    console.error("Error updating member role:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}