import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// DELETE /api/evaluations/[id] — delete a specific evaluation
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("evaluations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // RLS ensures only own records

  if (error) {
    console.error("Delete evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to delete evaluation" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
