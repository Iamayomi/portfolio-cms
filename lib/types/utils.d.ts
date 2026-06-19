type CloudinaryFolders = "notes" | "documents" | "media";

type UploadType = "image" | "document";

type TFile = File | React.ChangeEvent<HTMLInputElement>;

type UploadOptions = {
  onComplete?: (url: string) => void;
  onError?: (msg: string) => void;
  folder?: CloudinaryFolders;
};

interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}
