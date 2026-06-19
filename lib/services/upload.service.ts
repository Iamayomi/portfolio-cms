import { toast } from "sonner";

import { uploadToCloudinary } from "../actions/s3.actions";
import { extractErrorMessage } from "../utils";

const extractFile = (source: TFile) => {
  const file =
    source instanceof File
      ? source
      : (source as React.ChangeEvent<HTMLInputElement>).target.files?.[0];

  if (!file) throw new Error("No files found for upload");

  return file;
};

export const handleUpload = async (
  source: TFile,
  folder: CloudinaryFolders
) => {
  const file = extractFile(source);
  const { url } = await uploadToCloudinary(file, folder);
  return url;
};

export const handleImageUpload = (source: TFile, options?: UploadOptions) => {
  let $options: UploadOptions = {};

  if (options) $options = { ...options };

  try {
    const image = extractFile(source);

    if (!FILE_CONFIG.IMAGE.mimeTypes.includes(image.type)) {
      if (!(source instanceof File)) source.target.value = "";

      throw new Error(
        "Unsupported image type. Use jpg, jpeg, png, heic, or gif."
      );
    }

    if (image.size > FILE_CONFIG.IMAGE.maxSize) {
      if (!(source instanceof File)) source.target.value = "";
      throw new Error(`File too large`);
    }

    const loader = toast.loading("Uploading image...");

    handleUpload(image, $options.folder ?? "media")
      .then((url) => {
        $options?.onComplete?.(url);
      })
      .catch((err) => {
        if (!(source instanceof File)) source.target.value = "";
        console.log({ err });

        const message = extractErrorMessage(err);
        $options?.onError?.(message);
      })
      .finally(() => toast.dismiss(loader));
  } catch (err) {
    if (!(source instanceof File)) source.target.value = "";

    const message = extractErrorMessage(err);
    $options?.onError?.(message);
  }
};

export const handleDocumentUpload = (
  source: TFile,
  options?: UploadOptions
) => {
  let $options: UploadOptions = {};

  if (options) $options = { ...options };

  try {
    const document = extractFile(source);

    if (!FILE_CONFIG.DOCUMENT.mimeTypes.includes(document.type)) {
      if (!(source instanceof File)) source.target.value = "";
      throw new Error("Unsupported document type.");
    }

    if (document.size > FILE_CONFIG.DOCUMENT.maxSize) {
      if (!(source instanceof File)) source.target.value = "";
      throw new Error(`File too large`);
    }

    const loader = toast.loading("Uploading document...");

    handleUpload(document, $options.folder ?? "documents")
      .then((url) => {
        $options?.onComplete?.(url);
      })
      .catch((err) => {
        if (!(source instanceof File)) source.target.value = "";
        console.log({ err });

        const message = extractErrorMessage(err);
        $options?.onError?.(message);
      })
      .finally(() => toast.dismiss(loader));
  } catch (err) {
    if (!(source instanceof File)) source.target.value = "";

    const message = extractErrorMessage(err);
    $options?.onError?.(message);
  }
};

export const handleUploadDocument = handleDocumentUpload;

export const FILE_CONFIG = {
  IMAGE: {
    maxSize: 12 * 1024 * 1024,
    mimeTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/heic",
      "image/heif",
    ],
  },

  DOCUMENT: {
    maxSize: 8 * 1024 * 1024,
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
  },
};
