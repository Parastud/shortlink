import clientPromise from '@/lib/mongo'

export async function POST(req, res) {
    const client  = await clientPromise;
    const db = client.db('links');
    const collection = db.collection('links');
    const body = await req.json();
    const doc = await collection.findOne({ shorturl: body.type });
    if( doc ) {
        return Response.json({ success:false,error:true, message: 'Short URL already exists' });
    }
    const result = await collection.insertOne({
        url: body.link,
        shorturl: body.type
    })
    
  return Response.json({success:true, error:false, message: 'Your Short URL Created' })
}