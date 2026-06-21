import type { TBookSchema } from "@/lib/schemas/book.schema";

export type BookListItem = TBookSchema & {
  id: string;
  order: number;
};

export const emptyBookForm: TBookSchema = {
  title: "",
  author: "",
  category: "",
  note: "",
  rating: undefined,
  published: false,
};
