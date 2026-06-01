import { AttachmentEntity } from "@/generated/prisma/enums";

type GenerateS3KeyArgs = {
  entityId: string;
  entity: AttachmentEntity;
  organizationId: string;
  filename: string;
  attachmentId: string;
};

export const generateS3Key = ({
  entityId,
  entity,
  organizationId,
  filename,
  attachmentId,
}: GenerateS3KeyArgs) => {
  return `${organizationId}/${entity}/${entityId}/${attachmentId}-${filename}`;
};
