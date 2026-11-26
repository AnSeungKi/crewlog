export type NeighborhoodId = "seongsu" | "yeonnam" | "jamsil" | "pangyo";

export type CategoryId = "running" | "cafe" | "hiking" | "boardgame" | "photowalk";

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
  tint: string;
  /** short editorial line used on cards */
  blurb: string;
}

export interface Neighborhood {
  id: NeighborhoodId;
  label: string;
  note: string;
  /** two-letter code used in the map corner */
  code: string;
}

export interface CrewUser {
  id: string;
  name: string;
  handle: string;
  bio: string;
  accent: string;
  pro?: boolean;
  partner?: boolean;
}

export interface Meetup {
  id: string;
  title: string;
  categoryId: CategoryId;
  neighborhoodId: NeighborhoodId;
  startsAt: string;
  place: string;
  hostId: string;
  capacity: number;
  participantIds: string[];
  description: string;
  cover?: string;
  /** ISO date the boost runs until, null when not boosted */
  boostedUntil?: string | null;
  sponsorId?: string;
  /** seeded meetups have a shareable detail page, session-created ones do not */
  persisted: boolean;
}

export interface ProofPost {
  id: string;
  title: string;
  body: string;
  categoryId: CategoryId;
  neighborhoodId: NeighborhoodId;
  authorId: string;
  image?: string;
  createdAt: string;
  meetupId?: string;
  sponsorId?: string;
  baseLikeCount: number;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface SponsorPin {
  id: string;
  name: string;
  neighborhoodId: NeighborhoodId;
  categoryLabel: string;
  benefit: string;
  detail: string;
  code: string;
  expiresAt: string;
  /** map placement in percent of the map canvas */
  x: number;
  y: number;
}

export interface BoostOrder {
  id: string;
  meetupId: string;
  amount: number;
  hours: number;
  createdAt: string;
  status: "paid";
}

export type FeedItem =
  | { id: string; kind: "post"; postId: string; createdAt: string }
  | { id: string; kind: "meetup"; meetupId: string; createdAt: string };

export interface CreateMeetupInput {
  title: string;
  categoryId: CategoryId;
  neighborhoodId: NeighborhoodId;
  startsAt: string;
  place: string;
  capacity: number;
  description: string;
  boost: boolean;
}

export interface CreatePostInput {
  title: string;
  body: string;
  categoryId: CategoryId;
  neighborhoodId: NeighborhoodId;
  image?: string;
  meetupId?: string;
}
