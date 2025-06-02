
import React from 'react'
import clientPromise from '@/lib/mongo'
import {redirect} from 'next/navigation'
export default async function page({params}) {
    const id = (await params).id
    const client = await clientPromise;
    const db = client.db('links');
    const collection = db.collection('links');
    const doc = await collection.findOne({ shorturl: id });
    if (!doc) {
            redirect("/404")
        }else{
           redirect(doc.url)
        }
}