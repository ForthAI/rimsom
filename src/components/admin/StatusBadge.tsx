import { ContactStatus, STATUS_STYLES } from "@/types/contacts";

interface Props {
  status: ContactStatus | "";
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: Props) {
  if (!status) return null;
  const style = STATUS_STYLES[status as ContactStatus];
  if (!style) return null;
  const sizeCls =
    size === "md"
      ? "text-[11px] px-2 py-0.5"
      : "text-[10px] px-1.5 py-0.5";
  return (
    <span
      className={`inline-block ${sizeCls} font-sans font-semibold tracking-wider uppercase rounded border ${style.badge}`}
      title={style.description}
    >
      {status}
    </span>
  );
}
