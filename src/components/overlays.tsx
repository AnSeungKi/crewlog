"use client";

import { CreateSheet, ComposerSheet } from "./sheets/composer";
import { BoostSheet, CouponSheet, ProSheet } from "./sheets/offers";
import { MeetupDetailSheet } from "./meetup-detail";

/** every sheet and overlay of the app, mounted once */
export function AppOverlays() {
  return (
    <>
      <CreateSheet />
      <ComposerSheet />
      <MeetupDetailSheet />
      <BoostSheet />
      <CouponSheet />
      <ProSheet />
    </>
  );
}
