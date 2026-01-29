
import { db } from "@/lib/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req:NextRequest) {
    try {
        const { searchParams} = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");

        if(!workspaceId) {
            return NextResponse.json({
                error:"workspaceId is required",
                status:400
            });
        }

        const items = await db.item.findMany({
         where:{ workspaceId},
         orderBy:{ createdAt:"desc"},
        });

        return NextResponse.json({ items});
    } catch (error) {
        console.error("Error fetching items")
        return NextResponse.json(
            { error:"Failed to fetch items"},
            {status:500}
        );
    }
}

export async function POST(req:NextRequest) {
    try {
        const body = await req.json();
        const {type,title,content,workspaceId,userId} = body;

        if(!type || !title || !content || !workspaceId || !userId) {
            return NextResponse.json(
                { error:"type,title,workspace,and userId are required "},
                {status:400}
            );
        }

        const item = await db.item.create({
            data:{
                type,
                title,
                content,
                workspaceId,
                userId,
            },
        });

        return NextResponse.json({ item} ,{status:201})
    } catch (error) {
        console.error("Error creating item",error)
        return NextResponse.json(
            {error:"Failed to create to item"},
            {status:500}
        );
    }
} 

export async function PATCH (req:NextRequest) {
    try {
        const body = await req.json()
        const {id,...updates} = body;

        if(!id ) {
            return NextResponse.json(
                {error:"Item is required"},
                {status:400}
            );
        }

        const item = await db.item.update({
            where:{id},
            data:updates,
        });
        return NextResponse.json({item});
    } catch(error) {
        console.error("Error updating item:",error)
        return NextResponse.json(
            {error:"Failed to update item"},
            {status:500}
        );
    }
}

export async function DELETE(req:NextRequest) {
    try {
        const {searchParams} = new URL(req.url)
        const id = searchParams.get("id");

        if(!id) {
            return NextResponse.json(
                {error:"Item id is required"},
                {status:400}
            );
        }

        await db.item.delete({
            where:{id}
        });
        return NextResponse.json({success:true});
    } catch (error) {
        console.error("Error deleting item:",error) 
        return NextResponse.json(
            {error:"Failed to delete item"},
            {status:500}
        );
    }
}
