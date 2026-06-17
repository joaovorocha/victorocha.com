---
title: "Shaddow — 12V Automotive Dock Power Stage"
summary: "Custom power board for a vehicle dock — designed in Flux.ai, built around the realities of automotive 12V (transients, cold cranks, dirty rails)."
status: active
featured: true
order: 1
tags: ["hardware", "power-electronics", "flux.ai", "automotive"]
---

The dock power stage is the heart of Shaddow's in-vehicle system: it takes a noisy, swinging 12V automotive rail and turns it into clean, monitored rails the rest of the dock can rely on.

## Why it exists

A car's "12V" is anything but 12V. It can dip below 6V during a cold crank, sit at 14.4V while the alternator is running, and spike well past that during a load dump. Anything plugged into it needs more than a passive regulator — it needs a power stage that protects what's downstream and tells the system what's happening upstream.

## What it does

- **Wide-input buck conversion** down to the rails the dock needs.
- **Inrush + reverse-polarity protection** at the front end.
- **Telemetry**: voltage, current, and thermal sensing reported to the host so the system can make decisions (sleep, throttle, shut down cleanly).
- **Hot-swap-safe load switching** so peripherals can be added/removed without resetting the dock.

## Where it lives

Designed in [Flux.ai](https://www.flux.ai). EE work, layout, and BOM curation are mine. Future revs will add a bench-test harness so the same firmware can validate the board outside the vehicle.

## Status

Active design. Drafting Rev B with feedback from the first bench bring-up.
