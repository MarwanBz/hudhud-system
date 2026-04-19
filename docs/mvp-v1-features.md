# Hudhud System MVP V1 Features And Workflows

This file captures cross-surface product principles, end-to-end workflows, shared checklists, acceptance criteria, and the recommended delivery order.

## V1 Product Principles

- **Shipment creation is the core business action.** If agents cannot create shipments reliably, the system does not provide operational value.
- **Mobile must survive poor connectivity.** Agents and drivers work in field conditions where internet can be weak or unavailable.
- **Web is the control center.** Admins need connected dashboards, filters, assignment tools, reports, and exception handling.
- **V1 should complete the shipment lifecycle.** A shipment should move from creation to delivery, rejection, or postponement.
- **Every operational update should be auditable.** Status changes, sync retries, delivery proof, and notification attempts need a trace.
- **Agents must maintain prepaid system credit.** The system charges agents per official shipment, so credit and fee history are core business records.
- **Avoid advanced features that do not protect the core flow.** Maps, route optimization, customer accounts, branch-manager role separation, and advanced finance can wait.

## Scope By Surface

| Surface | V1 Scope | Why It Is Needed In The First MVP |
| --- | --- | --- |
| Web frontend | Admin dashboard, agent dashboard, public tracking | Gives connected users visibility, control, shipment creation, and customer self-service tracking. |
| Mobile app | Agent view and driver view | Lets field users keep working when internet is unreliable. |
| Backend | Auth, RBAC, shipment APIs, mobile sync, delivery proof, notifications, analytics | Converts the prototype from static screens into a real operating platform. |

## End-To-End MVP Workflows

### Online Agent Shipment Creation

1. Agent signs in on web or mobile.
2. Agent submits shipment while online.
3. Backend validates fields.
4. Backend verifies the agent has enough available system credit.
5. Backend creates shipment and tracking number.
6. Backend reserves the fixed system shipment fee from the agent's system credit.
7. Backend creates `received` event.
8. Backend creates notification log for shipment created.
9. Shipment appears in admin dashboard, agent dashboard, and public tracking.

### Offline Agent Shipment Creation

1. Agent signs in and bootstraps data while online.
2. Agent loses connection.
3. Agent creates shipment on mobile.
4. App stores pending sync item with temporary receipt ID.
5. Connection returns.
6. App syncs queued item with idempotency key.
7. Backend verifies real server-side system credit can reserve the fee.
8. If credit is sufficient, backend creates official shipment and tracking number.
9. Backend reserves the fixed system shipment fee from the agent's system credit.
10. App replaces temporary receipt with official tracking number.
11. If credit is insufficient, sync returns a failed item and the shipment remains unofficial on the device.

### Admin Driver Assignment

1. Admin opens shipment list.
2. Admin filters assignable shipments.
3. Admin assigns active driver.
4. Backend validates assignment.
5. Backend creates assignment event.
6. Driver receives assignment on next mobile sync/bootstrap.

### Offline Driver Delivery Outcome

1. Driver bootstraps assigned shipments while online.
2. Driver loses connection.
3. Driver opens assigned shipment.
4. Driver submits delivered/rejected/postponed with reason and photo.
5. App stores outcome and proof photo locally.
6. Connection returns.
7. App uploads proof and syncs outcome.
8. Backend updates status, stores proof, creates event, and triggers notification.
9. If the outcome is delivered, backend captures the reserved system shipment fee.
10. If the shipment is finally closed without delivery, backend releases the reserved fee.
11. If the shipment is postponed, backend keeps the fee reserved.
12. Admin, agent, and public tracking show updated status.

### Sync Conflict Review

1. Driver queues offline outcome.
2. Admin changes or closes the shipment before driver sync.
3. Driver syncs later.
4. Backend rejects automatic overwrite and marks conflict.
5. Mobile shows conflict.
6. Admin dashboard shows exception for review.
7. Admin resolves manually.

## V1 Data And API Checklist

### Core Data

- Users.
- Roles.
- Agents.
- Drivers.
- Shipments.
- Shipment events.
- Driver assignments.
- Delivery proofs.
- Mobile sync items.
- Notification logs.
- Commission records.
- Agent system credit balances.
- System credit ledger entries.
- Shipment fee reservations.
- Admin credit and correction records.

### Core APIs

- `POST /auth/login`
- `POST /auth/refresh`
- `GET /me`
- `POST /shipments`
- `GET /shipments`
- `GET /shipments/:id`
- `GET /shipments/tracking/:trackingNumber`
- `PATCH /shipments/:id/status`
- `POST /shipments/:id/assign-driver`
- `GET /mobile/bootstrap`
- `POST /mobile/sync`
- `POST /delivery-outcomes`
- `POST /files/proof-photos`
- `POST /admin/agents/:agentId/system-credit`
- `POST /admin/agents/:agentId/system-credit/corrections`
- `GET /admin/agents/:agentId/system-credit`
- `GET /agents/me/system-credit`
- `GET /analytics/admin`
- `GET /analytics/agent`
- `GET /public/track/:trackingNumber`
- `GET /notification-logs`

## Explicitly Out Of Scope For V1

- Customer mobile app.
- Customer accounts.
- Dedicated governorate manager dashboard.
- Advanced branch-level permission model beyond data fields needed for later.
- Route optimization.
- Live GPS tracking.
- Signature capture.
- Advanced payout settlement.
- Automated accounting integration.
- Automatic bank/exchange reconciliation.
- Agent-submitted recharge requests.
- Recharge proof image upload.
- Payment provider integration.
- Per-agent or per-route dynamic pricing.
- Advanced accounting settlement.
- Advanced report builder.
- Multi-provider notification template management.
- SLA automation.
- Inventory/warehouse scanning flows.

## V1 Acceptance Criteria

The MVP is acceptable when all of the following are true:

- Admin can sign in and manage shipments, agents, drivers, assignments, analytics, and sync exceptions.
- Agent can create shipments from web while online.
- Agent can create shipments from mobile while offline and sync later.
- Driver can view assigned shipments on mobile.
- Driver can submit delivery, rejection, or postponement outcome with reason/photo and sync later.
- Public tracking shows safe shipment status and timeline by tracking number.
- Automated notifications are attempted for key shipment events and logged.
- Backend prevents invalid status transitions.
- Backend prevents cross-role and cross-user data access.
- Mobile sync uses idempotency and does not duplicate shipments or outcomes on retry.
- Sync conflicts are visible to admin instead of silently overwriting server state.
- Agent cannot create an official shipment without enough system credit.
- Every official shipment reserves the fixed system shipment fee.
- Delivered shipments capture the reserved system fee.
- Final non-delivery shipments release the reserved system fee.
- Postponed shipments keep the reserved system fee until delivery or final closure.
- Offline sync does not bypass system credit checks.
- Admin can add system credit and correction entries.
- System credit and commission earned are shown separately.
- Fee operations are idempotent and audited.
- Basic admin and agent analytics are calculated from persisted data.

## Recommended Delivery Order

1. Backend foundation: auth, RBAC, database schema, system credit ledger, shipment creation, shipment events.
2. Web admin shipment management and agent web shipment creation.
3. Public tracking endpoint and page.
4. Mobile bootstrap and local sync queue.
5. Agent mobile offline shipment creation.
6. Driver assignment and driver mobile assigned shipment list.
7. Driver outcome sync with reason and photo proof.
8. Notifications and notification logs.
9. Analytics APIs and dashboard cards.
10. Sync exception review and conflict resolution.

This order keeps the system usable at each stage and avoids building offline mobile behavior before the backend has stable idempotent APIs to receive it.
