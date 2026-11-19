# Roadmap: MVP to Seed

## MVP
- [x] Waitlist, contact, Growth OS CRM pipeline
- [x] Catalog browse/search, equipment detail
- [x] Availability API and idempotent, double-booking-proof booking requests
- [x] Notification pipeline (outbox, SQS, worker)
- [x] AWS infra as code, CI/CD, WAF, autoscaling, alarms
- [ ] Auth UI (email/OTP, Google) and renter/owner dashboards
- [ ] Owner listing flow with S3 presigned image upload
- [ ] Owner approve/decline booking state machine
- [ ] Email provider (Resend/SES) in the worker

## Seed-round milestones
- [ ] Payments (Razorpay) with hold-and-release escrow, deposits, refunds
- [ ] Owner KYC and Verified badge
- [ ] Two-way reviews and reputation
- [ ] Damage protection and photo condition reports
- [ ] Geo search, filters, saved searches, price alerts (Typesense)
- [ ] Referral loop and owner earnings calculator
- [ ] Metrics dashboard: liquidity, request-to-accept, GMV, take-rate
- [ ] Renter/owner chat, mobile app

## Metrics to track
Supply liquidity, request-to-accept rate, time-to-accept, repeat-rental rate, GMV and take-rate, CAC by channel, dispute rate.
