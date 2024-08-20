import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://blaah:blaah123@cluster0.8f8e2kg.mongodb.net/CrowdIN?retryWrites=true&w=majority';

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    const client = new MongoClient(uri);
    await client.connect();

    const database = client.db('CrowdIN');
    const collection = database.collection('RaiseQn');

    const result = await collection.insertOne({
      chat_id: 300961814,
      message: question,
      user: 'User',
      timeStamp: Date.now(),
    });

    await client.close();
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 200 });
  } catch (error) {
    console.error('Failed to insert question:', error);
    return NextResponse.json({ success: false, error: 'Failed to insert question' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const database = client.db('CrowdIN');
    const collection = database.collection('RaiseQn');

    const messages = await collection.find({}).toArray();

    await client.close();
    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    console.error('Failed to retrieve messages:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve messages' }, { status: 500 });
  }
}
