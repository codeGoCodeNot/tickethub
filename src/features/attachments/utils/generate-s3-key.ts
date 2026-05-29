type GenerateS3KeyArgs = {
  organizationId: string;
  ticketId: string;
  filename: string;
  attachmentId: string;
};

export const generateS3Key = ({
  organizationId,
  ticketId,
  filename,
  attachmentId,
}: GenerateS3KeyArgs) => {
  return `${organizationId}/${ticketId}/${attachmentId}-${filename}`;
};
