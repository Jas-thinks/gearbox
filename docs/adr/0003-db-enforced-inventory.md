# ADR 0003: Inventory correctness via exclusion constraint

Status: accepted

Decision: prevent double-booking with a Postgres `EXCLUDE USING gist` constraint rather than
application or Redis locks.

Why: the database sees every write, so the guarantee holds across replicas, deploys and bugs.
Overlap raises SQLSTATE `23P01`, mapped to HTTP 409.
