"use client";

import { BoostModal } from "./boost-modal";
import { Composer } from "./composer";
import { CouponModal } from "./coupon-modal";
import { MeetupDetail } from "./meetup-detail";
import { ProModal } from "./pro-modal";

/** every modal and drawer of the app, mounted once */
export function AppOverlays() {
  return (
    <>
      <Composer />
      <MeetupDetail />
      <BoostModal />
      <ProModal />
      <CouponModal />
    </>
  );
}
