interface AuthFormState {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}
