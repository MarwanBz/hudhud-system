# Hudhud System MVP V1 Mobile Plan

The mobile app is local-first. It should support field work during weak or missing internet, then sync changes safely when connectivity returns.

Mobile V1 has two views:

- Agent view.
- Driver view.

Customer mobile view is not part of V1.

## Shared Mobile Foundation

### Feature: Authenticated Mobile Session

**V1 behavior**
- Agent and driver can sign in while online.
- App stores a secure session token.
- App can continue showing cached permitted data offline.
- App prevents new sync submissions if the account is deactivated once it reconnects.

**Why this is needed in V1**
- Offline work still needs identity.
- Every shipment or delivery outcome must be tied to a real agent or driver.

**Acceptance signal**
- Offline-created records sync under the correct authenticated user.

### Feature: Local Sync Queue

**V1 behavior**
- Store outbound mobile operations locally:
  - Agent shipment creation.
  - Driver delivery outcome.
  - Proof photo upload metadata.
- Each queued item has:
  - Local ID.
  - Idempotency key.
  - Operation type.
  - Payload.
  - Created time.
  - Last attempt time.
  - Retry count.
  - Status: `pending`, `syncing`, `synced`, `failed`, `conflict`.
  - Error message if failed.
- Sync automatically when internet returns.
- Allow manual retry.
- Agent shipment sync can fail when server-side system credit is insufficient.
- Retrying a sync item must not duplicate shipment fee reservations.

**Why this is needed in V1**
- This is the technical heart of the local-first requirement.
- It prevents duplicate shipments and duplicate delivery outcomes during retries.
- It prevents duplicate shipment fee reservations during mobile retry.
- It gives field users confidence that their work is not lost.

**Acceptance signal**
- Turning internet off, creating records, then turning internet on syncs each valid operation exactly once and reports insufficient-credit failures without creating duplicate reservations.

### Feature: Sync Status UI

**V1 behavior**
- Show clear banners or badges:
  - Online.
  - Offline.
  - Pending sync count.
  - Sync failed.
  - Sync failed because system credit is insufficient.
  - Conflict needs review.
- Show per-record sync state.
- Show when a failed shipment can be retried after admin adds system credit.

**Why this is needed in V1**
- Field users need to know whether the system has received their work.
- Without visible sync states, offline-first behavior creates confusion.
- Insufficient-credit failures need plain messaging so agents know to recharge through admin instead of re-entering the shipment.

**Acceptance signal**
- A user can identify which records are official, which are still local, and which failed because system credit is insufficient.

### Feature: Local Reference Data Cache

**V1 behavior**
- Cache required lookup data:
  - Governorates.
  - Service types.
  - Current user profile.
  - Agent last-synced system credit summary.
  - Assigned driver shipments.
  - Recent agent shipments.
- Refresh cache after login and successful sync.

**Why this is needed in V1**
- Offline forms need dropdown data and assigned shipment details.
- Cache keeps the app useful without requiring live API calls for every screen.

**Acceptance signal**
- Agent can fill a shipment form offline after a successful prior login/bootstrap and see the last-synced system credit summary.

## Agent Mobile View

### Feature: Create Shipment Offline Or Online

**V1 behavior**
- Agent can create shipment with:
  - Sender name.
  - Sender phone.
  - Receiver name.
  - Receiver phone.
  - Destination governorate.
  - Address details.
  - Shipment value.
  - Weight/package details.
  - Service type.
  - Paid checkbox:
    - Checked: `مدفوع`.
    - Unchecked: `غير مدفوع`.
  - Notes.
- Online submission sends directly to backend.
- Online submission requires enough available system credit and reserves the fixed shipment fee when the backend accepts it.
- Offline submission is stored in local queue.
- Offline submission stays local until backend validation, prepaid flag validation, system credit check, and fee reservation succeed during sync.
- If server-side system credit is insufficient during sync, the shipment remains unofficial and shows a failed sync state.

**Why this is needed in V1**
- This is the primary business action for agents.
- Offline creation is the main reason to build native mobile instead of relying only on web/PWA.
- Agents need a simple checkbox to mark whether delivery money was already paid.
- Backend system credit checks protect the pay-as-you-use business model even when the device was offline.

**Acceptance signal**
- Agent can create a shipment while offline and receive an official tracking number only after sync succeeds with prepaid flag validation, backend credit check, and fee reservation.

### Feature: Local Draft And Pending Shipment States

**V1 behavior**
- Save incomplete forms as drafts.
- Mark submitted offline shipments as pending sync.
- Allow editing or deleting drafts.
- Allow editing pending sync shipments only before first successful sync attempt.
- Lock synced shipments from local-only editing.

**Why this is needed in V1**
- Agents may be interrupted while entering shipment data.
- Editing after official sync can create conflicts, so V1 should keep post-sync changes controlled.

**Acceptance signal**
- Drafts remain local, pending submissions sync, and synced records become official read records.

### Feature: Temporary Receipt And Official Tracking Number

**V1 behavior**
- Offline shipment receives a local temporary receipt ID.
- Backend creates official tracking number during sync only after system credit check and fee reservation succeed.
- Backend makes QR tracking available only after official tracking number is created.
- App replaces the temporary ID with official tracking number after sync.
- App shows official QR/public tracking link only after successful sync.
- Agent can share official tracking once available.

**Why this is needed in V1**
- Official tracking numbers must be generated centrally to avoid duplicates.
- Agents still need local proof that they captured the shipment offline.
- QR tracking must point to the official backend shipment, not a temporary local record.

**Acceptance signal**
- No two synced shipments receive the same official tracking number, and failed insufficient-credit shipments keep only their local temporary receipt ID with no official QR.

### Feature: Agent Shipment List

**V1 behavior**
- Show recent synced shipments from backend.
- Show local drafts and pending sync shipments.
- Show failed insufficient-credit shipments clearly.
- Show whether each shipment is `مدفوع` or `غير مدفوع`.
- Show QR/public tracking link for official synced shipments.
- Allow retry after admin adds enough system credit.
- Search cached local records offline.
- Search backend records online.

**Why this is needed in V1**
- Agents need to confirm what they submitted.
- Offline pending records must appear next to official records to avoid duplicate entry.

**Acceptance signal**
- A newly created offline shipment appears immediately in the list as pending sync, and an insufficient-credit failure remains visible without official QR until it syncs successfully or the agent resolves it.

### Feature: Agent Mobile Analytics

**V1 behavior**
- Show lightweight metrics:
  - Shipments created today/month.
  - Delivered shipments.
  - Rejected/postponed shipments.
  - Available system credit.
  - Reserved system credit.
  - Fee history.
  - Commission earned.
- Data can be cached from last successful sync.

**Why this is needed in V1**
- Agents care about commission and performance.
- Agents need to know whether enough system credit is available before creating official shipments.
- System credit must stay visually separate from commission earned.
- Lightweight analytics encourages adoption without requiring advanced BI.

**Acceptance signal**
- Agent can see last synced shipment totals, system credit, reserved credit, fee history, commission earned, and clear timestamp showing when metrics were updated.

## Driver Mobile View

### Feature: Assigned Shipment List

**V1 behavior**
- Driver sees assigned shipments for today/current workload.
- Assigned shipments are cached for offline access.
- Each list item shows tracking number, receiver, phone, area/address summary, and status.

**Why this is needed in V1**
- Drivers need a daily work queue.
- Offline access is needed because delivery locations may have poor connectivity.

**Acceptance signal**
- Driver can open assigned shipment details while offline after bootstrap.

### Feature: Shipment Detail And Contact Action

**V1 behavior**
- Driver can open shipment details:
  - Receiver name.
  - Receiver phone.
  - Full address.
  - Tracking number.
  - Paid status: `مدفوع` or `غير مدفوع`.
  - Notes.
- Driver can call receiver from the app.

**Why this is needed in V1**
- Delivery requires enough information to reach the customer.
- Drivers need to know whether receiver-side payment is expected.
- Call action is more important than maps in the first MVP.

**Acceptance signal**
- Driver can call the receiver from a shipment detail screen and identify whether the shipment is `مدفوع` or `غير مدفوع`.

### Feature: Delivery Outcome Update

**V1 behavior**
- Driver can submit:
  - Delivered.
  - Rejected.
  - Postponed.
- Rejected and postponed require a reason.
- Delivered requires confirmation and photo proof.
- Outcome can be submitted offline and synced later.

**Why this is needed in V1**
- Shipment lifecycle is incomplete without last-mile outcome capture.
- Rejection and postponement are common operational exceptions and must be recorded.
- The paid flag is informational in V1 and stays separate from delivery status.

**Acceptance signal**
- A driver outcome creates a shipment event, updates shipment status, preserves the prepaid flag, and appears in admin and tracking views after sync.

### Feature: Photo Proof Capture

**V1 behavior**
- Driver attaches one photo to the outcome.
- Photo is stored locally if offline.
- Photo uploads during sync.
- Backend links uploaded photo to delivery proof record.

**Why this is needed in V1**
- Proof reduces disputes about delivery, rejection, or postponement.
- Photo proof is simpler than signature capture and sufficient for V1 accountability.

**Acceptance signal**
- Admin can view the proof photo after driver sync completes.

### Feature: Driver Sync Conflict Handling

**V1 behavior**
- If driver submits an offline outcome but server shipment state changed before sync, backend rejects automatic application and marks conflict.
- Mobile shows conflict state.
- Admin sees the conflict in sync exception review.

**Why this is needed in V1**
- Offline work can race with admin updates or another device.
- Silent overwrites would damage trust in shipment status.

**Acceptance signal**
- A conflicting offline update does not overwrite a closed shipment.

### Feature: Delivery History

**V1 behavior**
- Driver can view recent completed outcomes.
- History includes synced and pending items.
- Failed sync items remain visible until resolved.

**Why this is needed in V1**
- Drivers need proof of their work.
- Support teams may ask drivers about recent attempts.

**Acceptance signal**
- Driver can identify which outcomes are synced and which are still pending.
