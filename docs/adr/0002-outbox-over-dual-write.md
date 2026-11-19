# ADR 0002: Transactional outbox for events

Status: accepted

Context: a booking must reliably trigger notifications and CRM sync. Writing to the DB and SQS
separately can lose or duplicate events.

Decision: insert the event in the same transaction as the state change; a relay publishes to SQS
using `FOR UPDATE SKIP LOCKED` with lease-based retry. Consumers are idempotent.

Consequences: at-least-once delivery, ~1 s publish latency, no lost events.
