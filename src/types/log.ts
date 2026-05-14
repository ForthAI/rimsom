/**
 * A single conversation log entry. Entries are stored in the
 * `ConversationLog` tab of the contacts sheet, keyed by the contact's
 * primary email and a stable id.
 *
 * The id is a short random string generated at creation time, so we can
 * edit/delete a specific entry without depending on row indices.
 */
export interface LogEntry {
  /** Stable id (used as the path param for edit/delete). */
  id: string;
  /** Sheet row index (1-based). Internal — for write paths only. */
  rowIndex: number;
  /** Primary email of the contact this entry belongs to (lowercased). */
  email: string;
  /** ISO datetime of when the entry was created. */
  createdAt: string;
  /** The user-typed note. */
  note: string;
}
