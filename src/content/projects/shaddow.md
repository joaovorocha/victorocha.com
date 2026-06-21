---
title: "Shaddow — a self-built smart-vehicle platform"
summary: "I turned a 2017 Ford Transit into one self-hosted computer — native iPhone / Mac / head-unit apps, live OBD + CAN telemetry, battery control, and automation on a single MQTT bus. Built end to end, running in the van today."
status: active
featured: true
order: 1
tags: ["software", "mqtt", "swift", "kotlin", "iot", "automotive"]
---

<figure class="photo full-bleed">
  <picture>
    <source type="image/webp" srcset="/images/shaddow/headunit-dash-1280.webp 1280w, /images/shaddow/headunit-dash-640.webp 640w" sizes="100vw" />
    <img src="/images/shaddow/headunit-dash-1280.jpg" srcset="/images/shaddow/headunit-dash-1280.jpg 1280w, /images/shaddow/headunit-dash-640.jpg 640w" sizes="100vw" alt="The Shadow Van in-dash head unit — a dark dashboard showing the EcoFlow battery at 88%, a connected iPhone source, AUX / CarPlay / Bluetooth / Radio tiles, a live vehicle matrix (speed, RPM, fuel), now-playing, and GPS coordinates." width="1280" height="720" loading="eager" decoding="async" />
  </picture>
  <figcaption><span class="fig">FIG. 01 ·</span> SHADDOW · HEAD-UNIT DASHBOARD · IN-VAN</figcaption>
</figure>

**I gave my van a brain.**

Shaddow (*Shadow Van*) turns a 2017 Ford Transit into a single, self-hosted
computer. One message bus — MQTT — wires the in-dash head unit, my iPhone and
Mac, the engine, and the house battery into one system that actually talks to
itself: no cloud account required, no pile of disconnected gadgets. I designed
and built the whole software side, and it runs in the van every day.

## What it does

Everything speaks to one Mosquitto MQTT broker — the contract that makes every
piece swappable:

- **One app, three screens.** A SwiftUI app that's native on iPhone *and* Mac
  from a single codebase, plus an Android head unit running kiosk-mode in the dash.
- **The van reports in.** OBD-II (RPM, coolant, fuel, range) and a read-only CAN
  tap (doors, windows, diagnostics) stream the Transit's own data onto the bus.
- **Power you can see and steer.** Live EcoFlow DELTA Pro telemetry and control —
  state of charge, per-port watts, AC/DC — with an energy dashboard and 7-day history.
- **It watches itself.** Node-RED and Home Assistant (~46 entities) run the
  automations; a health monitor pings my phone — Apple Push, iMessage, or an AI
  summary — the moment something drifts.
- **AI on board.** Local Ollama models with an OpenRouter fallback, reachable
  from the apps through an MCP control plane that lives on the same bus.

<figure class="photo full-bleed">
  <picture>
    <source type="image/webp" srcset="/images/shaddow/architecture-1200.webp 1200w, /images/shaddow/architecture-1600.webp 1600w" sizes="100vw" />
    <img src="/images/shaddow/architecture-1200.jpg" srcset="/images/shaddow/architecture-1200.jpg 1200w, /images/shaddow/architecture-1600.jpg 1600w" sizes="100vw" alt="Shadow Van system-context diagram — four layers (people and devices, cloud services, connectivity, van systems) wired through a central Mosquitto MQTT broker, with the SwiftUI app, Android head unit, OBD/CAN, EcoFlow, Node-RED, Home Assistant, Grafana, and local AI." width="1600" height="1185" loading="lazy" decoding="async" />
  </picture>
  <figcaption><span class="fig">FIG. 02 ·</span> SHADDOW · SYSTEM ARCHITECTURE · MQTT BUS</figcaption>
</figure>

## Built like production, not a hobby

The whole stack self-hosts on an Apple-silicon Mac in the van and reaches me
anywhere over Tailscale:

- **Dockerized** — Mosquitto, InfluxDB + Grafana, Node-RED, Home Assistant, AdGuard.
- **Shipped on push** — GitHub Actions deploys to the van over SSH on every merge to `main`.
- **Always on** — T-Mobile 5G and an EcoFlow LiFePO4 bank keep it up independent of the ignition.

## Where it stands

The software is live and runs daily — head unit, phone and Mac apps, telemetry,
power, and automation, all in the van.

The hardware track — **Front Dock**, a custom 4-layer 12 V dock board (USB hub,
local power generation, and an isolated read-only dual-CAN interface, designed in
KiCad and Flux.ai) that collapses a bench of adapters into one PCB — is **on
hold**, with the next steps handed to a hardware collaborator while I keep
pushing the software side.

<figure class="photo full-bleed">
  <picture>
    <source type="image/webp" srcset="/images/shaddow/disassembly-1200.webp 1200w, /images/shaddow/disassembly-1600.webp 1600w" sizes="100vw" />
    <img src="/images/shaddow/disassembly-1200.jpg" srcset="/images/shaddow/disassembly-1200.jpg 1200w, /images/shaddow/disassembly-1600.jpg 1600w" sizes="100vw" alt="Shaddow hardware mid-disassembly laid out on dark velvet — exposed PCB, ribbon harnesses, and machined enclosure halves arranged like an exploded view." width="1600" height="1067" loading="lazy" decoding="async" />
  </picture>
  <figcaption><span class="fig">FIG. 03 ·</span> FRONT DOCK · HARDWARE TRACK (ON HOLD) · BENCH · 2026</figcaption>
</figure>
