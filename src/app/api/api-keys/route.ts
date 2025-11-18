import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

// In production, store these in a database
const API_KEYS_STORE = new Map<string, Array<{
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}>>();

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userKeys = API_KEYS_STORE.get(userId) || [];
  
  // Return keys with masked values
  return NextResponse.json({
    keys: userKeys.map(key => ({
      ...key,
      key: `${key.key.substring(0, 8)}...${key.key.substring(key.key.length - 4)}`
    }))
  });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  
  // Generate API key
  const apiKey = `cyfa_${crypto.randomBytes(32).toString('hex')}`;
  
  const newKey = {
    id: crypto.randomUUID(),
    name,
    key: apiKey,
    createdAt: new Date().toISOString(),
    lastUsed: null,
  };

  const userKeys = API_KEYS_STORE.get(userId) || [];
  userKeys.push(newKey);
  API_KEYS_STORE.set(userId, userKeys);

  return NextResponse.json({ key: newKey });
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  
  const userKeys = API_KEYS_STORE.get(userId) || [];
  const filteredKeys = userKeys.filter(key => key.id !== id);
  API_KEYS_STORE.set(userId, filteredKeys);

  return NextResponse.json({ success: true });
}