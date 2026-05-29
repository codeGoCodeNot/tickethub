import { ACCEPTED, MAX_SIZE } from "@/features/attachments/constants";
import { sizeInMB } from "@/features/attachments/utils/size";
import z from "zod";

export const fileSchema = z
  .custom<FileList>()
  .transform((files) => Array.from(files))
  .transform((files) => files.filter((file) => file.size > 0))
  .refine(
    (files) => files.every((file) => sizeInMB(file.size) <= MAX_SIZE),
    `The maximun file size is ${MAX_SIZE}MB`,
  )
  .refine(
    (files) => files.every((file) => ACCEPTED.includes(file.type)),
    "File type is not accepted",
  )
  .refine((files) => files.length !== 0, "Please upload at least one file");
