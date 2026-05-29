import CardCompact from "@/components/card-compact";
import AttachmentCreateForm from "./attachment-create-form";

type AttachmentsProps = {
  ticketId: string;
  isOwner: boolean;
};

const Attachments = ({ ticketId, isOwner }: AttachmentsProps) => {
  return (
    <CardCompact
      className="max-w-[580px] w-full  self-center"
      title="Attachments"
      description="Attached images or PDFs"
      content={isOwner && <AttachmentCreateForm ticketId={ticketId} />}
    />
  );
};

export default Attachments;
