import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { WaitlistFormData } from "@/types/waitlist";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Get user email
    const email = user.email;
    if (!email) {
      return NextResponse.json(
        { error: "Email not found in user profile." },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body: WaitlistFormData = await request.json();
    const { occupation, job_role, years_of_experience } = body;

    // Validate required fields
    if (!occupation || !job_role || !years_of_experience) {
      return NextResponse.json(
        { error: "Missing required fields: occupation, job_role, years_of_experience" },
        { status: 400 }
      );
    }

    // Validate years_of_experience is a valid number
    if (
      typeof years_of_experience !== "number" ||
      years_of_experience < 1 ||
      years_of_experience > 11
    ) {
      return NextResponse.json(
        { error: "Invalid years_of_experience value" },
        { status: 400 }
      );
    }

    // Check if user already has a waitlist entry
    const { data: existingEntry } = await supabase
      .from("waitlist")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existingEntry) {
      // Update existing entry
      const { error: updateError } = await supabase
        .from("waitlist")
        .update({
          email,
          occupation,
          job_role,
          years_of_experience,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating waitlist entry:", updateError);
        return NextResponse.json(
          { error: "Failed to update waitlist entry" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Waitlist entry updated successfully" },
        { status: 200 }
      );
    }

    // Create new entry
    const { error: insertError } = await supabase.from("waitlist").insert({
      email,
      occupation,
      job_role,
      years_of_experience,
      user_id: user.id,
    });

    if (insertError) {
      console.error("Error inserting waitlist entry:", insertError);
      return NextResponse.json(
        { error: "Failed to save waitlist entry" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Successfully joined the waitlist!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error in waitlist API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

