import Placeholder from "@/components/placeholder";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import getActivityLogs from "../queries/get-activity-logs";
import ActivityLogPagination from "./activity-log-pagination";

type ActivityLogListProps = {
  organizationId: string;
  page: number;
  size: number;
};

const formatDetails = (
  action: string,
  metadata: Record<string, string> | null,
) => {
  if (action === "attachment.uploaded")
    return `uploaded "${metadata?.filename}"`;
  if (action === "attachment.deleted")
    return `deleted attachment "${metadata?.filename}"`;
  if (action === "comment.updated") return `edited a comment on ticket`;
  if (action === "comment.deleted") return `deleted a comment on ticket`;
  if (action === "comment.created") return `commented on ticket`;
  if (action === "ticket.rejected")
    return `"${metadata?.ticketTitle}" rejected${metadata?.reason ? ` — ${metadata.reason}` : ""}`;
  if (action === "ticket.removed")
    return `"${metadata?.ticketTitle}" removed${metadata?.reason ? ` — ${metadata.reason}` : ""}`;
  if (action === "ticket.approved")
    return `"${metadata?.ticketTitle}" approved`;
  if (!metadata) return "—";
  if (action === "ticket.created")
    return `"${metadata.ticketTitle}" (${metadata.status ?? "OPEN"})`;
  if (action === "ticket.updated") return `"${metadata.ticketTitle}"`;
  if (action === "ticket.status_changed")
    return `"${metadata.ticketTitle}" ${metadata.from} → ${metadata.to}`;
  return "—";
};

const ActivityLogList = async ({
  organizationId,
  page,
  size,
}: ActivityLogListProps) => {
  const { list, metadata } = await getActivityLogs(organizationId, page, size);

  if (!list.length)
    return <Placeholder label="No activity logs found" icon={null} />;

  return (
    <div className="flex flex-col gap-y-4 px-8">
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((log) => {
            const meta = log.metadata as Record<string, string> | null;
            return (
              <TableRow key={log.id}>
                <TableCell>{log.user.name ?? "Unknown"}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{formatDetails(log.action, meta)}</TableCell>
                <TableCell>
                  {format(log.createdAt, "MMM d, yyyy h:mm a")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="md:hidden flex flex-col gap-y-2">
        {list.map((log) => {
          const meta = log.metadata as Record<string, string> | null;
          return (
            <div
              key={log.id}
              className="p-4 border rounded-md flex flex-col gap-y-1"
            >
              <span className="text-sm font-semibold">
                {log.user.name ?? "Unknown"}
              </span>
              <span className="text-sm text-muted-foreground">
                {log.action}
              </span>
              <span className="text-sm">{formatDetails(log.action, meta)}</span>
              <span className="text-xs text-muted-foreground">
                {format(log.createdAt, "MMM d, yyyy h:mm a")}
              </span>
            </div>
          );
        })}
      </div>

      <ActivityLogPagination paginatedMetadata={metadata} />
    </div>
  );
};

export default ActivityLogList;
