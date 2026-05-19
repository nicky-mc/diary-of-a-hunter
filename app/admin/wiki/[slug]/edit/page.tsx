// src/app/admin/wiki/[slug]/edit/page.tsx
//
// Server component — loads the wiki entry by slug and hands it to the
// client form.

import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import WikiEntry, { IWikiEntry } from "@/app/models/wikiEntry";
import EditWikiForm from "./EditWikiForm";

export const metadata = {
  title: "Edit Lore Entry | Restricted",
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditWikiEntryPage(props: PageProps) {
  const { slug } = await props.params;

  await dbConnect();

  const entry = (await WikiEntry.findOne({ slug })
    .lean()) as unknown as IWikiEntry | null;

  if (!entry) {
    notFound();
  }

  return (
    <EditWikiForm
      initial={{
        id: entry._id.toString(),
        title: entry.title,
        category: entry.category,
        threatLevel: entry.threatLevel,
        weaknesses: entry.weaknesses?.length ? [...entry.weaknesses] : [""],
        content: entry.content,
        coverImage: entry.coverImage ?? null,
      }}
    />
  );
}
