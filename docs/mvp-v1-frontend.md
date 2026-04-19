# Hudhud System MVP V1 Frontend Plan

The web app is online-first. It should assume an active backend connection and should prioritize management, reporting, search, and operational control.

## Admin Dashboard

### Feature: Admin Login And Role-Based Routing

**V1 behavior**
- Admin can sign in.
- Admin is routed to the admin dashboard.
- UI only exposes admin-authorized actions.
- Expired sessions return the user to login without losing clear error context.

**Why this is needed in V1**
- The admin dashboard exposes sensitive operational and financial data.
- Without admin auth, the system cannot safely move beyond a prototype.
- Role-based routing becomes the foundation for later branch manager and support roles.

**Acceptance signal**
- A non-admin user cannot access admin dashboard routes or APIs.

### Feature: Operational Overview

**V1 behavior**
- Show top-level KPIs:
  - Total shipments.
  - Shipments created today.
  - Delivered today.
  - In transit.
  - At destination branch.
  - Out for delivery.
  - Rejected.
  - Postponed.
  - Mobile sync failures or conflicts.
- Support a simple date filter for today, this week, this month, and custom range.

**Why this is needed in V1**
- Admins need immediate visibility into whether the operation is healthy.
- Sync failures are especially important because mobile is local-first.
- Basic operational KPIs help validate the business value of the MVP quickly.

**Acceptance signal**
- Dashboard numbers are calculated from real shipment and event records, not mock constants.

### Feature: Shipment Management

**V1 behavior**
- List shipments with pagination.
- Search by tracking number, sender, receiver, or phone.
- Filter by status, agent, driver, governorate, and date.
- Open a shipment detail page or modal.
- Show full shipment timeline.
- Show sender, receiver, destination, address, value, weight, service type, agent, assigned driver, and current status.
- Allow admin to update status only through valid V1 transitions.

**Why this is needed in V1**
- Shipments are the central entity of the whole system.
- Admins need a trusted source of truth when customers, agents, or drivers report issues.
- Filtering by status and role is required for daily operations, not just analytics.

**Acceptance signal**
- Admin can find a shipment, inspect its timeline, and see the same status that customer tracking returns.

### Feature: Web Shipment Creation

**V1 behavior**
- Admin can create a new shipment from the web.
- Agent can create a new shipment from the agent web dashboard.
- Required fields match mobile shipment creation.
- Shipment creation requires enough available system credit for the selected agent.
- If system credit is insufficient, show a clear failure and do not show an official tracking number.
- Backend returns the official tracking number.
- Created shipment starts in `received`.

**Why this is needed in V1**
- Agents primarily use mobile, but web creation is still useful for office users and operational backfill.
- Reusing the same backend creation flow validates consistency across web and mobile.
- Web users need immediate feedback when a shipment cannot become official because the agent needs more system credit.

**Acceptance signal**
- A shipment created from web appears in admin lists, agent lists, public tracking, and the selected agent's fee history.

### Feature: Driver Assignment

**V1 behavior**
- Admin can assign an available driver to a shipment.
- Admin can reassign a driver before final delivery outcome.
- Assigned shipment appears in the driver mobile app on the next sync/bootstrap.
- Assignment creates a shipment event.

**Why this is needed in V1**
- Driver delivery updates cannot work unless the system knows which driver owns the next action.
- Assignment closes the gap between shipment intake and last-mile delivery.

**Acceptance signal**
- Assigned driver sees the shipment on mobile and can submit an outcome.

### Feature: Mobile Sync Exception Review

**V1 behavior**
- Admin can see mobile sync items that failed or conflicted.
- Conflict examples:
  - Driver submits offline outcome after shipment was already closed.
  - Agent offline shipment is missing required backend validation.
  - Agent offline shipment cannot become official because server-side system credit is insufficient.
  - Photo upload succeeds but status update fails.
- Admin can inspect the failed payload, error reason, related shipment, and retry state.
- Admin can mark an item resolved after manual correction.

**Why this is needed in V1**
- Local-first mobile introduces a new operational failure mode.
- If sync failures are invisible, staff will assume data was saved when it was not.
- Admin review keeps field work reliable without needing perfect automation in V1.

**Acceptance signal**
- A forced sync conflict appears in the admin dashboard and is not silently discarded.

### Feature: Agent Management

**V1 behavior**
- Admin can list agents.
- Admin can view agent profile, phone, governorate, status, shipment count, commission rate, system credit, reserved credit, available credit, and commission earned.
- Admin can activate or deactivate an agent.
- Admin can inspect an agent's shipments.

**Why this is needed in V1**
- Agents are the main source of shipment creation.
- Admins need to manage who can submit operational records.
- Deactivation is required if a phone is lost or an agent leaves the network.

**Acceptance signal**
- A deactivated agent cannot create new shipments from web or mobile sync.

### Feature: Agent System Credit Management

**V1 behavior**
- Admin can add system credit to an agent with amount and note/reference.
- Admin can add positive or negative correction entries with a required reason.
- Admin can view append-only credit, correction, reservation, capture, and release history.
- Admin can see available credit and reserved credit separately.
- Admin can see commission earned separately from system credit.

**Why this is needed in V1**
- Agents recharge outside the app through company bank or exchange accounts.
- Admin needs a simple screen to record confirmed payments and correct mistakes without editing old ledger records.
- The business depends on prepaid system credit before shipments become official.

**Acceptance signal**
- Admin can add credit for an agent, then that agent can create official shipments until available credit is no longer enough for the fixed shipment fee.

### Feature: Driver Management

**V1 behavior**
- Admin can list drivers.
- Admin can view driver status, phone, governorate, assigned shipments, and delivery outcomes.
- Admin can inspect delivery proof photos.
- Admin can activate or deactivate a driver.

**Why this is needed in V1**
- Driver identity must be tied to delivery outcomes and proof.
- Admins need to know who is available and who completed each delivery.

**Acceptance signal**
- A deactivated driver cannot receive new assignments or submit delivery outcomes.

### Feature: Basic Financial Dashboard

**V1 behavior**
- Show shipment revenue totals.
- Show agent commission totals.
- Show total agent system credit.
- Show reserved system credit.
- Show captured shipment fee totals.
- Show commission earned separately from prepaid system credit.
- Filter by date and agent.
- Show system credit history and fee history.
- Show simple commission rows tied to shipments.

**Why this is needed in V1**
- Agent commissions are part of the current business model and prototype.
- System credit is part of the core pay-as-you-use business model.
- Finance does not need to be advanced in V1, but agents and admins need a shared view of prepaid credit, captured fees, and earned commissions.
- Basic financial visibility helps validate operational adoption.

**Acceptance signal**
- System credit totals, reserved credit, captured fee totals, and commission totals match backend records for the selected date range.

### Feature: Basic Reports

**V1 behavior**
- Shipment status report.
- Agent performance report.
- Driver delivery outcome report.
- Basic export can be included if low effort, but it is not a blocker for V1.

**Why this is needed in V1**
- Reports help leadership and operations review adoption and performance.
- The first MVP needs enough reporting to replace manual daily summaries.

**Acceptance signal**
- Admin can answer: how many shipments were created, delivered, rejected, postponed, and by whom.

### Feature: Notification Monitoring

**V1 behavior**
- Admin can view notification logs for shipment events.
- Each log shows event type, channel (`whatsapp` or `sms`), recipient, recipient phone, provider, status, sent time, retry count, and failure reason if available.
- Admin can filter or inspect failed notifications by shipment, channel, recipient, status, and date.
- Admin can identify when SMS was used as fallback after WhatsApp failed or was unavailable.

**Why this is needed in V1**
- WhatsApp and SMS customer messaging are in scope, so operational staff need visibility when they fail.
- Messaging failure should not block shipment state, but it must be visible.

**Acceptance signal**
- A simulated WhatsApp provider failure creates a failed or fallback notification log without breaking the shipment update.

## Agent Web Dashboard

### Feature: Agent Login And Scoped Dashboard

**V1 behavior**
- Agent can sign in.
- Agent sees only their own shipments, system credit, fee history, commissions, and analytics.
- Agent cannot access admin data or other agents' records.

**Why this is needed in V1**
- Agents need a connected web option for office use.
- Data scoping is required before real agents can use the system.

**Acceptance signal**
- Agent API responses are scoped to the authenticated agent.

### Feature: Create Shipment Online

**V1 behavior**
- Agent can create a shipment from web using the same required fields as mobile.
- Agent sees a clear insufficient-credit message if available system credit cannot cover the fixed shipment fee.
- Backend returns official tracking number immediately.
- Shipment appears in agent and admin dashboards.
- Shipment creation is blocked until admin adds enough system credit.

**Why this is needed in V1**
- Some agents may work from offices with stable internet.
- Web creation gives a simpler path for support and training.
- Agents need to understand when a shipment failed because credit must be added before it can become official.

**Acceptance signal**
- Agent-created web shipment follows the same validation, fee reservation, and event creation as mobile-created shipments.

### Feature: My Shipments

**V1 behavior**
- Agent can list, search, and filter their shipments.
- Agent can open shipment timeline.
- Agent can see delivery outcome once completed.

**Why this is needed in V1**
- Agents will receive customer questions after creating shipments.
- They need self-service visibility instead of calling admin.

**Acceptance signal**
- Agent can find a shipment they created and cannot find another agent's shipment.

### Feature: Agent Analytics, System Credit, And Commissions

**V1 behavior**
- Show total shipments, delivered shipments, rejected/postponed shipments, available system credit, reserved system credit, fee history, and commission earned.
- Show recent commission rows tied to shipments.

**Why this is needed in V1**
- Commissions motivate agent usage and reduce disputes.
- Agents need simple proof of what they have earned and whether they have enough system credit to keep creating official shipments.
- System credit must stay visually separate from commission earned.

**Acceptance signal**
- Agent dashboard totals match the underlying shipment, system credit, fee history, and commission records.

## Public Customer Tracking

### Feature: Tracking Lookup

**V1 behavior**
- Customer enters tracking number without logging in.
- Page returns safe shipment status and timeline.
- Page hides private operational fields such as system credit, shipment fee records, commission earned, internal IDs, admin notes, and sync metadata.
- Invalid tracking number returns a clear not-found state.

**Why this is needed in V1**
- Tracking is the customer-facing proof that the system works.
- Public tracking reduces customer calls to agents and admins.

**Acceptance signal**
- A real tracking number shows current status and timeline, while private fields are absent from the response.

### Feature: Contact Actions

**V1 behavior**
- Show configured contact or WhatsApp action when available.
- Do not expose driver contact unless business policy allows it.

**Why this is needed in V1**
- Customers need a next step when a shipment is delayed or out for delivery.
- Contact actions reduce support friction without requiring customer accounts.

**Acceptance signal**
- Tracking page renders a contact path from backend configuration.
