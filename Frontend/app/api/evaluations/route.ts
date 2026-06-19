import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/evaluations — fetch user's evaluation history
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("evaluations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Fetch evaluations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch evaluations" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

// POST /api/evaluations — save a new evaluation
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { data, error } = await supabase
    .from("evaluations")
    .insert({
      user_id: user.id,
      input: body.input,
      result: body.result,
    })
    .select()
    .single();

  if (error) {
    console.error("Save evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to save evaluation" },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
