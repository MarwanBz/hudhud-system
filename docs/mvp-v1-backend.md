# Hudhud System MVP V1 Backend Plan

The backend is the system of record. It must enforce rules that frontend and mobile clients cannot be trusted to enforce alone.

## Authentication And RBAC

### Feature: Identity And Role Management

**V1 behavior**
- Support roles:
  - Admin.
  - Agent.
  - Driver.
- Every authenticated request is scoped by role.
- Agent can only access own shipments and analytics.
- Driver can only access assigned shipments and own outcomes.
- Admin can access global MVP data.

**Why this is needed in V1**
- Real shipment data includes customer names, phone numbers, addresses, values, and operational details.
- RBAC is mandatory before production use.

**Acceptance signal**
- API tests prove cross-role and cross-agent access is denied.

## Core Data Model

### Feature: Persistent Operational Database

**V1 behavior**
- Store:
  - Users.
  - Agents.
  - Drivers.
  - Shipments.
  - Shipment events.
  - Delivery proofs.
  - Mobile sync items.
  - Notification logs.
  - Basic commission records.
  - Agent system credit balances.
  - System credit ledger entries.
  - Shipment fee reservations, captures, and releases.
  - Admin credit and correction records.
- Use stable IDs and timestamps.

**Why this is needed in V1**
- The current prototype uses mock data.
- A persistent database is required for real operations, sync, tracking, and reporting.
- System credit must be ledger-backed because it controls whether agents can create official shipments.

**Acceptance signal**
- Restarting the application does not lose shipments, events, sync records, system credit balances, or ledger history.

## Agent System Credit And Shipment Fees

### Feature: Prepaid system credit ledger

**V1 behavior**
- Define one backend constant: `SYSTEM_SHIPMENT_FEE_YER = 500`.
- Track `system credit` separately from `commission earned`.
- Admin can add system credit to an agent with amount and note/reference.
- Admin can create positive or negative correction entries with a required reason.
- System credit ledger records are append-only.
- Old credit, correction, reservation, capture, and release records are not edited or deleted.
- Store the fee amount snapshot on each shipment fee reservation so future constant changes do not rewrite old shipment economics.
- Agents and admins can view system credit, reserved credit, available credit, and credit/fee history.
- Drivers cannot view agent credit or fee history.

**Why this is needed in V1**
- Hudhud charges agents per official shipment, so shipment creation must be backed by prepaid credit.
- Agents recharge outside the app through company bank or exchange accounts, and admin needs a simple way to record confirmed payments.
- Separating system credit from commission earned prevents confusing money agents paid into the system with money agents earned from the system.

**Acceptance signal**
- Admin can add credit and corrections for an agent, and every balance-changing action creates an immutable ledger entry.

### Feature: Shipment fee reservation and capture

**V1 behavior**
- Official shipment creation requires enough available system credit for the selected agent.
- Backend reserves `SYSTEM_SHIPMENT_FEE_YER` when the shipment becomes official.
- The shipment's selected agent pays the fee even when admin creates the shipment on that agent's behalf.
- `delivered` captures the reserved shipment fee.
- Final non-delivery closure releases the reserved fee.
- `postponed` keeps the fee reserved until later delivery or final closure.
- Idempotent retries never reserve, capture, or release the same fee twice.

**Why this is needed in V1**
- The business model is pay-as-you-use, but agents should not create unlimited official shipments without credit.
- Reserving on creation and capturing on delivery protects both sides: the platform knows funds exist, and agents only pay for delivered shipments.
- Fee operations must follow shipment state changes or financial records will drift from operations.

**Acceptance signal**
- A delivered shipment consumes the reserved fee once, while a final non-delivered shipment returns the reservation to available credit.

## Shipment Management

### Feature: Shipment Creation API

**V1 behavior**
- Accepts shipment creation from web and mobile sync.
- Validates required fields.
- Requires enough available system credit for the selected agent before creating an official shipment.
- Generates official tracking number.
- Creates initial shipment event.
- Reserves `SYSTEM_SHIPMENT_FEE_YER` from the selected agent's system credit.
- Calculates initial commission record if applicable.
- Supports idempotency key for mobile sync.
- Admin-created shipments reserve the fee from the selected agent's system credit.
- Rejects official shipment creation when available system credit is insufficient.

**Why this is needed in V1**
- Shipment creation is the core transaction.
- Idempotency prevents duplicate shipments when mobile retries.
- System credit enforcement ensures every official shipment can pay the platform fee.

**Acceptance signal**
- Replaying the same mobile create request returns the same created shipment and does not reserve the system fee twice.

### Feature: Shipment State Machine

**V1 behavior**
- Support statuses:
  - `received`.
  - `at_origin_branch`.
  - `in_transit`.
  - `at_destination_branch`.
  - `out_for_delivery`.
  - `delivered`.
  - `rejected`.
  - `postponed`.
  - `cancelled`.
  - `ready_for_pickup`.
- Enforce allowed transitions.
- Every status change creates a shipment event.
- `delivered` captures the reserved shipment fee.
- Final non-delivery states such as `rejected` or `cancelled` release the reserved fee.
- `postponed` keeps the fee reserved until later delivery or final closure.

**Why this is needed in V1**
- Shipment status must be consistent across admin, agent, driver, and customer views.
- Invalid transitions create customer confusion and operational disputes.
- Fee capture and release must be deterministic so agents can trust their system credit history.

**Acceptance signal**
- Invalid status transitions are rejected by backend even if client attempts them, and valid terminal transitions apply the correct fee capture or release exactly once.

### Feature: Driver Assignment API

**V1 behavior**
- Assign or reassign a driver.
- Validate driver is active.
- Validate shipment is assignable.
- Create assignment event.
- Make assignment available to driver mobile bootstrap.

**Why this is needed in V1**
- Driver app depends on backend assignment.
- Admin needs operational control over last-mile work.

**Acceptance signal**
- Assigned shipment appears only for the assigned driver.

## Mobile Sync

### Feature: Mobile Bootstrap API

**V1 behavior**
- Returns:
  - Current mobile user profile.
  - Role.
  - Lookup data.
  - Agent recent shipments or driver assigned shipments.
  - Last sync cursor/version.

**Why this is needed in V1**
- Mobile needs enough data to work offline after login.
- Bootstrap defines the cache boundary for local-first behavior.

**Acceptance signal**
- Mobile can bootstrap online and then perform supported actions offline.

### Feature: Batched Sync API

**V1 behavior**
- Accepts a batch of queued mobile operations.
- Processes each item independently.
- Uses idempotency keys.
- Returns per-item result:
  - Synced.
  - Failed validation.
  - Conflict.
  - Retryable server error.
- Allows offline shipments to be saved locally, but creates official shipments only when server-side system credit can reserve the fee.
- Returns a failed item result for insufficient system credit without creating a duplicate shipment or fee reservation.
- Does not let one bad item block the whole batch.

**Why this is needed in V1**
- Field users can generate multiple offline actions.
- Independent per-item sync reduces data loss and support work.
- Offline mobile must not bypass prepaid system credit enforcement.

**Acceptance signal**
- A batch with one invalid or insufficient-credit item still syncs valid items and does not create duplicate reservations on retry.

## Delivery Proof

### Feature: Proof Photo Upload And Linking

**V1 behavior**
- Accept image upload for driver outcome.
- Store file securely.
- Link file to delivery proof.
- Expose proof only to authorized admin and relevant operational views.

**Why this is needed in V1**
- Delivery proof is needed for accountability.
- Photo proof is the lowest-complexity proof format that still has operational value.

**Acceptance signal**
- Public tracking does not expose proof photo, while admin can view it.

## Notifications

### Feature: Automated Key-Event Notifications

**V1 behavior**
- Send notifications for:
  - Shipment created.
  - Out for delivery.
  - Delivered.
  - Rejected.
  - Postponed.
- Store notification logs.
- Retry retryable failures.
- Do not rollback shipment state when notification fails.

**Why this is needed in V1**
- Notifications keep customers informed and reduce manual follow-up.
- Logs make provider failure visible without blocking operations.

**Acceptance signal**
- Updating shipment to delivered creates a delivered notification log.

## Analytics And Reporting APIs

### Feature: Admin Analytics API

**V1 behavior**
- Return operational and basic financial KPIs:
  - Shipment counts by status.
  - Created/delivered counts by date.
  - Rejected/postponed counts.
  - Revenue summary.
  - Agent commission summary.
  - Agent system credit total.
  - Reserved system credit total.
  - Captured shipment fee total.
  - Recent system credit history.
  - Driver outcome summary.
  - Sync exception count.

**Why this is needed in V1**
- Admin dashboard depends on backend-calculated data.
- Operations need one trusted set of numbers.
- Prepaid credit and captured shipment fees are part of the core V1 business model.

**Acceptance signal**
- Dashboard KPI cards match report query totals for the same filter.

### Feature: Agent Analytics API

**V1 behavior**
- Return scoped agent metrics:
  - Shipment count.
  - Delivered/rejected/postponed count.
  - Commission earned.
  - System credit balance.
  - Reserved system credit.
  - Available system credit.
  - Fee history.
  - Commission earned as a separate amount.
  - Recent commission records.

**Why this is needed in V1**
- Agents need visibility into work and earnings.
- Scoped API avoids leaking other agents' data.
- Agents need to know whether they have enough system credit to create official shipments.

**Acceptance signal**
- Agent analytics only includes that agent's records and shows system credit separately from commission earned.

## Public Tracking API

### Feature: Safe Public Tracking Endpoint

**V1 behavior**
- Lookup by tracking number.
- Return safe shipment status and timeline.
- Apply rate limiting.
- Avoid exposing private fields.

**Why this is needed in V1**
- Customer tracking is part of the core product promise.
- Public endpoints need abuse protection from the first release.

**Acceptance signal**
- Public tracking response passes a privacy field audit.

## Audit And Observability

### Feature: Audit Log For Sensitive Actions

**V1 behavior**
- Record actor, action, target entity, timestamp, and metadata for:
  - Shipment creation.
  - Status update.
  - Driver assignment.
  - Delivery outcome.
  - Agent/driver activation changes.
  - Sync conflict resolution.
  - Admin system credit additions.
  - System credit corrections.
  - Shipment fee reservation.
  - Shipment fee capture.
  - Shipment fee release.
  - Insufficient-credit shipment failures.

**Why this is needed in V1**
- Operations need traceability when disputes happen.
- Audit logs are cheaper to include early than retrofit later.
- Money-affecting actions require a clear actor, timestamp, reason, and related shipment or agent.

**Acceptance signal**
- Admin can trace who changed a shipment status, who changed agent system credit, and when each fee was reserved, captured, or released.

### Feature: Basic Operational Logs

**V1 behavior**
- Log API errors, sync failures, notification failures, and proof upload failures.
- Include correlation IDs for mobile sync batches.

**Why this is needed in V1**
- Local-first sync and notifications create async failure modes.
- Debugging without logs will slow launch support.

**Acceptance signal**
- A failed sync item can be traced from mobile idempotency key to backend logs.
