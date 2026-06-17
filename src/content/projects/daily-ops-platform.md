---
title: "Daily Operations Platform"
summary: "A Node + Postgres + WebSockets PWA that replaced paper-based stockroom workflows at Suitsupply San Francisco. Built from scratch, deployed to production, 50+ daily users."
status: shipped
featured: true
order: 2
tags: ["software", "node", "postgres", "pwa", "production"]
repo: https://github.com/joaovorocha/stockroom-dashboard
---

I spent a year and a half running the stockroom at Suitsupply San Francisco,
and the longer I ran it the more obvious it got that the bottleneck wasn't
people — it was the paper. Shipments, lost punches, game plans, closing
duties, radio call-outs — all of it lived in a clipboard or somebody's
head. So I started building.

## What it is

A Progressive Web App that runs every stockroom workflow in the store:
shipment tracking, time-off requests, lost-punch corrections, daily game
plans, closing checklists, real-time radio call-outs, and live email
processing. Mobile-first, but a manager can run the same thing from a
desktop.

## The stack

- **Backend** — Node + Express, PostgreSQL 15, Redis for ephemeral state,
  WebSockets for live sync across every connected device.
- **Frontend** — PWA, "Add to Home Screen" on iOS with a built-in install
  prompt, offline-capable for the views that matter.
- **Deploy** — Linux, PM2, Nginx, SSL via Let's Encrypt. Tailscale for
  remote access, plus a smart-routing layer that flips users between
  local WiFi (fast) and Tailscale (secure) automatically.
- **Integrations** — Salesforce, PredictSpring, UPS API, Gmail API with
  OAuth 2.0 and real-time push via Google Cloud Pub/Sub. Plus a few MCP
  servers for inventory, shipments, and radio operations.

## What it does in production

- **50+ active daily users**, sub-200 ms response times.
- Real-time email processing — the inbox-to-action loop is gone.
- The paper game-plan board is gone.
- The radio system is logged and searchable.
- The closing checklist is enforced and auditable.

## What I learned building it

You don't actually need a frontend framework to ship a PWA that 50 people
use every day. You do need to think hard about the network — the
single biggest performance win we shipped was *not* a code change. It was
detecting which network the user was on and routing them to the fastest
path automatically.

## Where it goes next

Multi-store deployment, harder offline guarantees, and a proper public
API for the integrations.
