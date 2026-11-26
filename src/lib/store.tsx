"use client";

import dayjs from "dayjs";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  BOOST_HOURS,
  BOOST_PRICE,
  CATEGORY_COVERS,
  COMMENTS,
  FEED,
  ME,
  MEETUPS,
  POSTS,
  SPONSOR_PINS,
  sponsorOf,
  userOf,
} from "./seed";
import type {
  BoostOrder,
  CategoryId,
  CreateMeetupInput,
  CreatePostInput,
  CrewUser,
  FeedItem,
  Meetup,
  NeighborhoodId,
  PostComment,
  ProofPost,
  SponsorPin,
} from "./types";

export type NeighborhoodFilter = NeighborhoodId | "all";
export type CategoryFilter = CategoryId | "all";
export type FeedSort = "recommended" | "latest" | "popular";
export type ComposerTab = "meetup" | "post";

interface StoreValue {
  /* data */
  meetups: Meetup[];
  posts: ProofPost[];
  comments: PostComment[];
  feed: FeedItem[];
  likes: Record<string, number>;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  joined: Record<string, boolean>;
  coupons: Record<string, boolean>;
  boosts: BoostOrder[];
  sponsors: SponsorPin[];

  /* filters */
  neighborhood: NeighborhoodFilter;
  category: CategoryFilter;
  sort: FeedSort;
  setNeighborhood: (value: NeighborhoodFilter) => void;
  setCategory: (value: CategoryFilter) => void;
  setSort: (value: FeedSort) => void;

  /* derived */
  visibleFeed: FeedItem[];
  counts: Record<NeighborhoodFilter, number>;
  meetupById: (id: string) => Meetup | undefined;
  postById: (id: string) => ProofPost | undefined;
  userById: (id: string) => CrewUser;
  sponsorById: (id: string) => SponsorPin | undefined;
  commentsFor: (postId: string) => PostComment[];
  likeCount: (postId: string) => number;
  participantCount: (meetupId: string) => number;
  spotsLeft: (meetupId: string) => number;
  isBoosted: (meetupId: string) => boolean;
  meetupsIn: (neighborhood: NeighborhoodFilter) => Meetup[];

  /* actions */
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  toggleJoin: (meetupId: string) => void;
  addComment: (postId: string, body: string) => void;
  createMeetup: (input: CreateMeetupInput) => string;
  createPost: (input: CreatePostInput) => string;
  boostMeetup: (meetupId: string) => void;
  claimCoupon: (sponsorId: string) => void;

  /* overlay state, shared by header / feed / map / footer */
  composerOpen: boolean;
  composerTab: ComposerTab;
  openComposer: (tab?: ComposerTab) => void;
  closeComposer: () => void;
  setComposerTab: (tab: ComposerTab) => void;

  detailId: string | null;
  openDetail: (meetupId: string) => void;
  closeDetail: () => void;

  boostTargetId: string | null;
  openBoost: (meetupId: string) => void;
  closeBoost: () => void;

  couponTargetId: string | null;
  openCoupon: (sponsorId: string) => void;
  closeCoupon: () => void;

  proOpen: boolean;
  setProOpen: (open: boolean) => void;
}

const CrewlogContext = createContext<StoreValue | null>(null);

/** the demo starts with the current user already in a couple of crews */
const initialJoined = (): Record<string, boolean> => {
  const map: Record<string, boolean> = {};
  MEETUPS.forEach((meetup) => {
    if (meetup.participantIds.includes(ME.id)) map[meetup.id] = true;
  });
  return map;
};

const normalizeMeetups = (): Meetup[] =>
  MEETUPS.map((meetup) => ({
    ...meetup,
    participantIds: meetup.participantIds.filter((id) => id !== ME.id),
  }));

export function CrewlogProvider({ children }: { children: React.ReactNode }) {
  const [meetups, setMeetups] = useState<Meetup[]>(normalizeMeetups);
  const [posts, setPosts] = useState<ProofPost[]>(POSTS);
  const [comments, setComments] = useState<PostComment[]>(COMMENTS);
  const [feed, setFeed] = useState<FeedItem[]>(FEED);
  const [likes, setLikes] = useState<Record<string, number>>(() =>
    POSTS.reduce<Record<string, number>>((acc, post) => {
      acc[post.id] = post.baseLikeCount;
      return acc;
    }, {}),
  );
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [joined, setJoined] = useState<Record<string, boolean>>(initialJoined);
  const [coupons, setCoupons] = useState<Record<string, boolean>>({});
  const [boosts, setBoosts] = useState<BoostOrder[]>([]);

  const [neighborhood, setNeighborhood] = useState<NeighborhoodFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<FeedSort>("recommended");

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerTab, setComposerTab] = useState<ComposerTab>("meetup");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [boostTargetId, setBoostTargetId] = useState<string | null>(null);
  const [couponTargetId, setCouponTargetId] = useState<string | null>(null);
  const [proOpen, setProOpen] = useState(false);

  const tasksById = useMemo(() => {
    const map = new Map<string, Meetup>();
    meetups.forEach((m) => map.set(m.id, m));
    return map;
  }, [meetups]);

  const postsById = useMemo(() => {
    const map = new Map<string, ProofPost>();
    posts.forEach((p) => map.set(p.id, p));
    return map;
  }, [posts]);

  const commentsByPost = useMemo(() => {
    const map = new Map<string, PostComment[]>();
    comments.forEach((c) => {
      const list = map.get(c.postId) ?? [];
      list.push(c);
      map.set(c.postId, list);
    });
    map.forEach((list) =>
      list.sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()),
    );
    return map;
  }, [comments]);

  const meetupById = useCallback((id: string) => tasksById.get(id), [tasksById]);
  const postById = useCallback((id: string) => postsById.get(id), [postsById]);
  const userById = useCallback((id: string) => userOf(id), []);
  const sponsorById = useCallback((id: string) => sponsorOf(id), []);
  const commentsFor = useCallback(
    (postId: string) => commentsByPost.get(postId) ?? [],
    [commentsByPost],
  );

  const participantCount = useCallback(
    (meetupId: string) => {
      const meetup = tasksById.get(meetupId);
      if (!meetup) return 0;
      return meetup.participantIds.length + (joined[meetupId] ? 1 : 0);
    },
    [tasksById, joined],
  );

  const spotsLeft = useCallback(
    (meetupId: string) => {
      const meetup = tasksById.get(meetupId);
      if (!meetup) return 0;
      return Math.max(0, meetup.capacity - participantCount(meetupId));
    },
    [tasksById, participantCount],
  );

  const isBoosted = useCallback(
    (meetupId: string) => {
      const meetup = tasksById.get(meetupId);
      if (!meetup?.boostedUntil) return false;
      return dayjs(meetup.boostedUntil).isAfter(dayjs());
    },
    [tasksById],
  );

  const counts = useMemo(() => {
    const result: Record<NeighborhoodFilter, number> = {
      all: meetups.length,
      seongsu: 0,
      yeonnam: 0,
      jamsil: 0,
      pangyo: 0,
    };
    meetups.forEach((meetup) => {
      result[meetup.neighborhoodId] += 1;
    });
    return result;
  }, [meetups]);

  const meetupsIn = useCallback(
    (value: NeighborhoodFilter) =>
      value === "all"
        ? meetups
        : meetups.filter((meetup) => meetup.neighborhoodId === value),
    [meetups],
  );

  const visibleFeed = useMemo(() => {
    const matched = feed.filter((item) => {
      const source =
        item.kind === "post" ? postsById.get(item.postId) : tasksById.get(item.meetupId);
      if (!source) return false;
      if (neighborhood !== "all" && source.neighborhoodId !== neighborhood) return false;
      if (category !== "all" && source.categoryId !== category) return false;
      return true;
    });

    const withMeta = matched.map((item, index) => {
      const isMeetup = item.kind === "meetup";
      const boosted = isMeetup ? isBoosted(item.meetupId) : false;
      const score = isMeetup
        ? participantCount(item.meetupId) * 12 + (boosted ? 120 : 0)
        : likes[item.postId] ?? 0;
      return { item, index, boosted, score };
    });

    if (sort === "latest") {
      withMeta.sort(
        (a, b) => dayjs(b.item.createdAt).valueOf() - dayjs(a.item.createdAt).valueOf(),
      );
    } else if (sort === "popular") {
      withMeta.sort((a, b) => b.score - a.score);
    } else {
      withMeta.sort((a, b) => {
        if (a.boosted !== b.boosted) return a.boosted ? -1 : 1;
        return a.index - b.index;
      });
    }

    return withMeta.map((entry) => entry.item);
  }, [
    feed,
    postsById,
    tasksById,
    neighborhood,
    category,
    sort,
    isBoosted,
    participantCount,
    likes,
  ]);

  const toggleLike = useCallback((postId: string) => {
    setLiked((prev) => {
      const next = !prev[postId];
      setLikes((counts) => ({
        ...counts,
        [postId]: Math.max(0, (counts[postId] ?? 0) + (next ? 1 : -1)),
      }));
      return { ...prev, [postId]: next };
    });
  }, []);

  const toggleSave = useCallback((postId: string) => {
    setSaved((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }, []);

  const toggleJoin = useCallback(
    (meetupId: string) => {
      const meetup = tasksById.get(meetupId);
      if (!meetup) return;
      const already = joined[meetupId];
      if (!already && spotsLeft(meetupId) <= 0) return;
      setJoined((prev) => ({ ...prev, [meetupId]: !already }));
    },
    [tasksById, joined, spotsLeft],
  );

  const addComment = useCallback((postId: string, body: string) => {
    const trimmed = body.trim();
    if (!trimmed) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        postId,
        authorId: ME.id,
        body: trimmed,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const createMeetup = useCallback((input: CreateMeetupInput) => {
    const id = `m-${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const meetup: Meetup = {
      id,
      title: input.title,
      categoryId: input.categoryId,
      neighborhoodId: input.neighborhoodId,
      startsAt: input.startsAt,
      place: input.place,
      hostId: ME.id,
      capacity: input.capacity,
      participantIds: [],
      description: input.description,
      cover: CATEGORY_COVERS[input.categoryId],
      boostedUntil: input.boost ? dayjs().add(BOOST_HOURS, "hour").toISOString() : null,
      persisted: false,
    };
    setMeetups((prev) => [meetup, ...prev]);
    setJoined((prev) => ({ ...prev, [id]: true }));
    setFeed((prev) => [
      { id: `f-${id}`, kind: "meetup", meetupId: id, createdAt: now },
      ...prev,
    ]);
    if (input.boost) {
      setBoosts((prev) => [
        {
          id: `b-${id}`,
          meetupId: id,
          amount: BOOST_PRICE,
          hours: BOOST_HOURS,
          createdAt: now,
          status: "paid",
        },
        ...prev,
      ]);
    }
    return id;
  }, []);

  const createPost = useCallback((input: CreatePostInput) => {
    const id = `p-${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const post: ProofPost = {
      id,
      title: input.title,
      body: input.body,
      categoryId: input.categoryId,
      neighborhoodId: input.neighborhoodId,
      authorId: ME.id,
      image: input.image,
      createdAt: now,
      meetupId: input.meetupId || undefined,
      baseLikeCount: 0,
    };
    setPosts((prev) => [post, ...prev]);
    setLikes((prev) => ({ ...prev, [id]: 0 }));
    setFeed((prev) => [
      { id: `f-${id}`, kind: "post", postId: id, createdAt: now },
      ...prev,
    ]);
    return id;
  }, []);

  const boostMeetup = useCallback((meetupId: string) => {
    const until = dayjs().add(BOOST_HOURS, "hour").toISOString();
    setMeetups((prev) =>
      prev.map((meetup) => (meetup.id === meetupId ? { ...meetup, boostedUntil: until } : meetup)),
    );
    setBoosts((prev) => [
      {
        id: `b-${meetupId}-${Date.now().toString(36)}`,
        meetupId,
        amount: BOOST_PRICE,
        hours: BOOST_HOURS,
        createdAt: new Date().toISOString(),
        status: "paid",
      },
      ...prev,
    ]);
    setFeed((prev) => {
      const target = prev.find(
        (item) => item.kind === "meetup" && item.meetupId === meetupId,
      );
      if (!target) {
        const meetup = tasksById.get(meetupId);
        if (!meetup) return prev;
        return [
          {
            id: `f-boost-${meetupId}`,
            kind: "meetup",
            meetupId,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ];
      }
      return [target, ...prev.filter((item) => item !== target)];
    });
  }, [tasksById]);

  const claimCoupon = useCallback((sponsorId: string) => {
    setCoupons((prev) => ({ ...prev, [sponsorId]: true }));
  }, []);

  const value: StoreValue = {
    meetups,
    posts,
    comments,
    feed,
    likes,
    liked,
    saved,
    joined,
    coupons,
    boosts,
    sponsors: SPONSOR_PINS,
    neighborhood,
    category,
    sort,
    setNeighborhood,
    setCategory,
    setSort,
    visibleFeed,
    counts,
    meetupById,
    postById,
    userById,
    sponsorById,
    commentsFor,
    likeCount: (postId) => likes[postId] ?? 0,
    participantCount,
    spotsLeft,
    isBoosted,
    meetupsIn,
    toggleLike,
    toggleSave,
    toggleJoin,
    addComment,
    createMeetup,
    createPost,
    boostMeetup,
    claimCoupon,
    composerOpen,
    composerTab,
    openComposer: (tab = "meetup") => {
      setComposerTab(tab);
      setComposerOpen(true);
    },
    closeComposer: () => setComposerOpen(false),
    setComposerTab,
    detailId,
    openDetail: (id) => setDetailId(id),
    closeDetail: () => setDetailId(null),
    boostTargetId,
    openBoost: (id) => setBoostTargetId(id),
    closeBoost: () => setBoostTargetId(null),
    couponTargetId,
    openCoupon: (id) => setCouponTargetId(id),
    closeCoupon: () => setCouponTargetId(null),
    proOpen,
    setProOpen,
  };

  return <CrewlogContext.Provider value={value}>{children}</CrewlogContext.Provider>;
}

export function useCrewlog(): StoreValue {
  const context = useContext(CrewlogContext);
  if (!context) throw new Error("useCrewlog must be used inside CrewlogProvider");
  return context;
}
