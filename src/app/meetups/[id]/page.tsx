import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeetupPageView } from "@/components/meetup-page";
import { MEETUPS } from "@/lib/seed";

export const dynamicParams = false;

export function generateStaticParams() {
  return MEETUPS.map((meetup) => ({ id: meetup.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const meetup = MEETUPS.find((item) => item.id === id);
  if (!meetup) return { title: "번개를 찾을 수 없습니다" };

  return {
    title: meetup.title,
    description: meetup.description.slice(0, 110),
    openGraph: {
      title: meetup.title,
      description: meetup.description.slice(0, 110),
      images: meetup.cover ? [{ url: meetup.cover }] : undefined,
    },
  };
}

export default async function MeetupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meetup = MEETUPS.find((item) => item.id === id);
  if (!meetup) notFound();

  return <MeetupPageView id={id} />;
}
