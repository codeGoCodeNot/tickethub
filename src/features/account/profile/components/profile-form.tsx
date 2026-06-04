"use client";

import { Label } from "@/components/ui/label";
import { updateUser } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { LucideUserCircle } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import updateAvatar from "../actions/update-avatar";
import createCroppedImage from "../utils/create-cropped-image";
import ChangeEmailDialog from "./change-email-dialog";
import ChangeNameDialog from "./change-name-dialog";
import CropImageDialog from "./crop-image-dialog";

type ProfileFormProps = {
  name: string;
  image?: string | null;
  email: string;
};

type CroppedArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const ProfileForm = ({ name, email, image }: ProfileFormProps) => {
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(image ?? null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<CroppedArea | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(URL.createObjectURL(file));
    setCropDialogOpen(true);
  };

  const onCropComplete = useCallback(
    (_: unknown, croppedAreaPixels: CroppedArea) => {
      setCroppedArea(croppedAreaPixels);
    },
    [],
  );

  const handleCropConfirm = async () => {
    if (!cropSrc || !croppedArea) return;

    const mimeType = inputRef.current?.files?.[0]?.type ?? "image/jpeg";
    const croppedFile = await createCroppedImage(
      cropSrc,
      croppedArea,
      mimeType,
    );

    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(croppedFile));
    setCropDialogOpen(false);

    const formData = new FormData();
    formData.append("avatar", croppedFile);

    startTransition(async () => {
      try {
        const url = await updateAvatar(formData);
        if (url) await updateUser({ image: url });
        queryClient.invalidateQueries({ queryKey: ["user"] });
        toast.success("Avatar updated");
      } catch {
        toast.error("Failed to update avatar");
      }
    });
  };

  return (
    <>
      <div className="flex flex-col gap-y-5">
        <div className="flex flex-col items-center gap-y-2">
          <div
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer relative w-24 h-24 rounded-full overflow-hidden border"
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                key={previewUrl}
                alt="Profile Picture"
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <LucideUserCircle className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isPending ? "Uploading..." : "Click to change photo"}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="grid gap-1.5">
          <Label>Name</Label>
          <div className="flex items-center justify-between gap-x-2 rounded-md border bg-muted/30 px-3 py-2">
            <span className="text-sm truncate">{name}</span>
            <ChangeNameDialog currentName={name} />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label>Email</Label>
          <div className="flex items-center justify-between gap-x-2 rounded-md border bg-muted/30 px-3 py-2">
            <span className="text-sm truncate">{email}</span>
            <ChangeEmailDialog />
          </div>
          <p className="text-xs text-muted-foreground">
            Changing your email requires verification.
          </p>
        </div>
      </div>

      <CropImageDialog
        open={cropDialogOpen}
        onOpenChange={setCropDialogOpen}
        cropSrc={cropSrc}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        onConfirm={handleCropConfirm}
      />
    </>
  );
};

export default ProfileForm;
