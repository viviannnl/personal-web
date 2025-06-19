import { supabase } from "@/utils/supabase";
import { NextRequest } from 'next/server';

export async function GET() {
  const { data, error } = await supabase.from('questions').select('*');
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase.from('questions').insert([{ content: body.content }]);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

