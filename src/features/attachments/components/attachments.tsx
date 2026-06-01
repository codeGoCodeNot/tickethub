import CardCompact from "@/components/card-compact";
import AttachmentCreateForm from "./attachment-create-form";
import getAttachments from "../queries/get-attachments";
import AttachmentItem from "./attachment-item";
import AttachmentDeleteButton from "./attachment-delete-button";
import { AttachmentEntity } from "@/generated/prisma/enums";

type AttachmentsProps = {
  entityId: string;
  isOwner: boolean;
  entity: AttachmentEntity;
};

const Attachments = async ({ entityId, isOwner, entity }: AttachmentsProps) => {
  const attachments = await getAttachments(entityId, entity);

  return (
    <>
      <div className="mx-2 flex flex-wrap gap-3 mb-4">
        {attachments.map((attachment) => (
          <AttachmentItem
            key={attachment.id}
            attachment={attachment}
            buttons={[
              ...(isOwner
                ? [<AttachmentDeleteButton key="0" id={attachment.id} />]
                : []),
            ]}
          />
        ))}
      </div>
      {isOwner && <AttachmentCreateForm entityId={entityId} entity={entity} />}
    </>
  );
};

export default Attachments;
