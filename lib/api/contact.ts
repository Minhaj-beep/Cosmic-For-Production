import { db as supabase } from "../supabase";
import type { Database } from "../database.types";

export type ContactSubmission =
  Database["public"]["Tables"]["contact_submissions"]["Insert"];

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  // Save to database
  const { error } = await supabase
    .from("contact_submissions")
    .insert({
      ...data,
      status: "new",
    });

  if (error) {
    return { error };
  }

  // Send notification email
  const { error: functionError } = await supabase.functions.invoke(
    "send-notification",
    {
      body: {
        type: "contact_form",
        data: {
          ...data,
          status: "new",
        },
      },
    }
  );

  if (functionError) {
    console.error("Failed to send notification:", functionError);
  }

  return { error: null };
}

export async function submitDealerEnquiry(data: {
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  message: string;
}) {
  // Save to database
  const { error } = await supabase
    .from("dealer_enquiries")
    .insert({
      ...data,
      status: "new",
      notes: "",
    });

  if (error) {
    return { error };
  }

  // Send notification email
  const { error: functionError } = await supabase.functions.invoke(
    "send-notification",
    {
      body: {
        type: "dealer_enquiry",
        data: {
          ...data,
          status: "new",
          notes: "",
        },
      },
    }
  );

  if (functionError) {
    console.error("Failed to send notification:", functionError);
  }

  return { error: null };
}