import { NextResponse } from "next/server";
import { authOptions } from "./../../../lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";

export async function GET(req:Request) {
    try {
        const session = await getServerSession(authOptions);
        if(!session) {
             return NextResponse.json({error:"Unauthorized"},{status:401})
        }
       
        const {searchParams} = new URL(req.url);
        const pageId = searchParams.get("pageId");

        if(!pageId) {
            return NextResponse.json({error:"Page ID required"},{status:400});
        }

        const comments = await prisma.comment.findMany({
            where:{
                pageId,
                parentId:null,
            },
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                    },
                },
                replies:{
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
                    orderBy:{
                        createdAt:"asc",
                    },
                },
            },
            orderBy:{
               createdAt:"desc",
            },
        });
       return NextResponse.json({comments});

    } catch(error) {
        console.error("Error fetching comments:",error)
        return NextResponse.json({error:"Failed to fetch comments"},{status:500})
    }
}

export async function POST(req:Request) {
    try {

     const session  = await getServerSession(authOptions);
     if(!session) {
        return NextResponse.json({error:"Unauthorized"},{status:401});
     }

     const body = await req.json();
     const {content,pageId,parentId} = body;

     if(!content || !pageId) {
        return NextResponse.json({error:"Content and Page ID required"},{status:400});
     }

     const comment = await prisma.comment.create({
        data:{
            content,
            pageId,
            userId:session.user.id,
            parentId:parentId || null,
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

     return NextResponse.json({comment})

} catch (error) {
    console.error("Error creating comment:",error)
    return NextResponse.json({error:"Failed to create comment"},{status:500})
}
}

export async function PATCH(req:Request) {
    try {
        const session = await getServerSession(authOptions);
        if(!session) {
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }

        const body = await req.json();
        const {id,content} = body;

        if(!id || !content) {
            return NextResponse.json({error:"Comment ID and content required"},{status:400})
        }

        const comment = await prisma.comment.update({
            where:{
                id,
                userId:session.user.id,
            },
            data:{
                content,
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

        return NextResponse.json({comment})
    } catch (error) {
        console.error("Error updating comment:",error);
        return NextResponse.json({error:"Failed to update comment"},{status:500})
    }
}

export  async function DELETE(req:Request) {
    try {
        const session = await getServerSession(authOptions);
        if(!session) {
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }

        const {searchParams}= new URL(req.url);
        const id = searchParams.get("id");

        if(!id) {
            return NextResponse.json({error:"Comment ID required"},{status:400})
        }

        await prisma.comment.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}