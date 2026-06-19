import type { Dispatch, SetStateAction } from "react";

import type { TContactPageSchema } from "@/lib/schemas/contact.schema";

export type ContactEditorState = {
  formData: TContactPageSchema;
  setFormData: Dispatch<SetStateAction<TContactPageSchema>>;
};
