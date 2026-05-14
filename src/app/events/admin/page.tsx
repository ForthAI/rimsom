import { redirect } from "next/navigation";

/**
 * The admin's old front door. Contacts is the new front door — kick visitors
 * straight there.
 */
export default function AdminIndex() {
  redirect("/events/admin/contacts");
}
