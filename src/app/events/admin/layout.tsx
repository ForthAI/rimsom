import { AdminHeader } from "@/components/admin/AdminHeader";

/**
 * Wraps every admin page with the shared top nav (Contacts / Active / Past).
 * Auth gating is handled per-page since each page has slightly different
 * 401-handling needs (login form vs. redirect).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminHeader />
      {children}
    </>
  );
}
