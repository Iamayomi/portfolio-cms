import { bookRepository } from "@/lib/db/repositories/book.repository";

import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import { BookshelfManager, type BookListItem } from "./_components/bookshelf-manager";

export default async function BookshelfManagePage() {
  const books = await bookRepository.findOrdered();
  const items: BookListItem[] = books.map((book) => ({
    id: book._id?.toString() || "",
    title: book.title,
    author: book.author,
    category: book.category,
    note: book.note,
    rating: book.rating,
    published: book.published,
    order: book.order,
  }));
  const managerKey = items
    .map((item) => `${item.id}:${item.order}:${item.published}`)
    .join("|");

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Bookshelf / Manage"
        title="Curate your reading list."
        description="Add books that shaped how you think. Only published books appear on the public bookshelf page."
      />

      <BookshelfManager key={managerKey} items={items} />
    </div>
  );
}
