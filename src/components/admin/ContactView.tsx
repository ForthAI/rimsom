"use client";

import { Contact } from "@/types/contacts";
import { ContactLog } from "./ContactLog";
import { StatusBadge } from "./StatusBadge";
import { FollowUpActions } from "./FollowUpActions";

interface Props {
  contact: Contact;
  onEdit: () => void;
  onClose: () => void;
}

const sectionCls =
  "text-[10px] font-sans font-semibold tracking-widest uppercase text-gray-500 pt-2 pb-1 border-b border-gray-200 mb-3";
const labelCls = "text-[11px] font-sans font-semibold tracking-wider uppercase text-gray-500 w-32 shrink-0";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <div className={labelCls}>{label}</div>
      <div className="text-[13px] font-sans text-gray-900 break-words min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}

function buildAddress(c: Contact): string {
  const lines = [
    c.addressLine1,
    c.addressLine2,
    [c.city, c.state, c.postalCode].filter(Boolean).join(", "),
    c.country,
  ].filter(Boolean);
  return lines.join("\n");
}

export function ContactView({ contact: c, onEdit, onClose }: Props) {
  const fullName = [c.honorific, c.firstName, c.surname].filter(Boolean).join(" ").trim() || c.email;
  const titleOrg = [c.title, c.organization].filter(Boolean).join(" · ");
  const phoneFull = `${c.phoneCountry ? "+" + c.phoneCountry + " " : ""}${c.phone}`.trim();
  const officeFull = `${c.officePhoneCountry ? "+" + c.officePhoneCountry + " " : ""}${c.officePhone}`.trim();
  const address = buildAddress(c);
  const hasContactMethods = phoneFull || officeFull || c.whatsapp || c.linkedin || c.website;
  const hasExtraEmails = c.secondaryEmail || c.schedulerEmail || c.additionalEmails;

  return (
    <div className="space-y-4">
      {/* Identity heading */}
      <div className="pb-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="text-[20px] font-sans font-semibold text-gray-900">{fullName}</h3>
          <StatusBadge status={c.status} size="md" />
        </div>
        {titleOrg && <p className="text-[13px] font-sans text-gray-600 mt-1">{titleOrg}</p>}
      </div>

      {/* Quick follow-up actions */}
      <FollowUpActions contact={c} onStatusChanged={onClose} />

      {/* Emails */}
      <div className={sectionCls}>Emails</div>
      <Row label="Primary">
        <a href={`mailto:${c.email}`} className="text-gray-900 hover:underline">{c.email}</a>
      </Row>
      {c.secondaryEmail && (
        <Row label="Secondary">
          <a href={`mailto:${c.secondaryEmail}`} className="text-gray-900 hover:underline">{c.secondaryEmail}</a>
        </Row>
      )}
      {c.schedulerEmail && (
        <Row label="Scheduler">
          {c.schedulerName && <span className="text-gray-700">{c.schedulerName} · </span>}
          <a href={`mailto:${c.schedulerEmail}`} className="text-gray-900 hover:underline">{c.schedulerEmail}</a>
        </Row>
      )}
      {c.additionalEmails && (
        <Row label="Additional">{c.additionalEmails}</Row>
      )}
      {!hasExtraEmails && (
        <p className="text-[11px] font-sans text-gray-400 italic pl-32">No additional emails</p>
      )}

      {/* Contact methods */}
      {hasContactMethods && (
        <>
          <div className={sectionCls}>Contact Methods</div>
          {phoneFull && <Row label="Mobile">{phoneFull}</Row>}
          {officeFull && <Row label="Office">{officeFull}</Row>}
          {c.whatsapp && <Row label="WhatsApp">{c.whatsapp}</Row>}
          {c.linkedin && (
            <Row label="LinkedIn">
              <a
                href={c.linkedin.startsWith("http") ? c.linkedin : `https://${c.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:underline"
              >
                {c.linkedin}
              </a>
            </Row>
          )}
          {c.website && (
            <Row label="Website">
              <a
                href={c.website.startsWith("http") ? c.website : `https://${c.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:underline"
              >
                {c.website}
              </a>
            </Row>
          )}
        </>
      )}

      {/* Address */}
      {address && (
        <>
          <div className={sectionCls}>Address</div>
          <div className="flex items-start gap-3 py-1.5">
            <div className={labelCls}>Location</div>
            <div className="text-[13px] font-sans text-gray-900 whitespace-pre-line min-w-0 flex-1">
              {address}
            </div>
          </div>
        </>
      )}

      {/* Standing notes — durable context about the person. Separate from
          the timestamped conversation log below. */}
      {c.notes && (
        <>
          <div className={sectionCls}>Notes</div>
          <div className="text-[13px] font-sans text-gray-900 whitespace-pre-line">
            {c.notes}
          </div>
        </>
      )}

      {/* Timestamped conversation log. */}
      <ContactLog contactRowIndex={c.rowIndex} contactEmail={c.email} readOnly />

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-[12px] font-sans font-semibold tracking-wider uppercase text-gray-700 hover:bg-gray-100 rounded"
        >
          Close
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="px-5 py-2 text-[12px] font-sans font-semibold tracking-wider uppercase bg-gray-900 text-white hover:bg-black rounded"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
