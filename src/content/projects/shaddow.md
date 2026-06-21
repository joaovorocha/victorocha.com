---
title: "Shaddow — a self-built smart-vehicle platform"
summary: "A full smart-vehicle stack for a 2017 Ford Transit — native iPhone / Mac / head-unit apps, live OBD + CAN telemetry, EcoFlow power, and automation, all on one MQTT bus and self-hosted in the van."
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

**Shaddow** (a.k.a. *Shadow Van*) is a smart-vehicle platform I built from
scratch for my 2017 Ford Transit. One message bus — MQTT — ties together a
native in-dash head unit, iPhone and Mac apps, live vehicle telemetry, the
house battery, and a stack of automation services, so the van runs as one
connected system instead of a pile of disconnected gadgets.

The software is mine end to end. A custom 12 V dock board is a separate
hardware track, currently on hold — more on that at the bottom.

## What it does

A single Mosquitto MQTT broker is the contract every part speaks. Around it:

- **Native apps, shared code** — a SwiftUI app that runs on iPhone *and* as a
  native macOS app from one codebase, plus an Android head-unit app running
  kiosk-mode on the in-dash screen.
- **Vehicle telemetry** — an OBD-II poller (RPM, coolant, fuel, range) and a
  read-only CAN tap (doors, windows, diagnostics) on the Transit's buses,
  normalized onto MQTT.
- **Power** — EcoFlow DELTA Pro battery telemetry and control: state of charge,
  per-port watts, AC/DC, with an energy dashboard and 7-day history.
- **Automation & alerts** — Node-RED flows and Home Assistant (~46 entities)
  react to all of it; a health monitor pushes problems to my phone over Apple
  Push, iMessage, or an AI summary.
- **AI, local-first** — on-box Ollama models with an OpenRouter fallback,
  reachable from the apps through an MCP control plane that itself lives on MQTT.

<figure class="photo full-bleed">
  <picture>
    <source type="image/webp" srcset="/images/shaddow/architecture-1200.webp 1200w, /images/shaddow/architecture-1600.webp 1600w" sizes="100vw" />
    <img src="/images/shaddow/architecture-1200.jpg" srcset="/images/shaddow/architecture-1200.jpg 1200w, /images/shaddow/architecture-1600.jpg 1600w" sizes="100vw" alt="Shadow Van system-context diagram — four layers (people and devices, cloud services, connectivity, van systems) wired through a central Mosquitto MQTT broker, with the SwiftUI app, Android head unit, OBD/CAN, EcoFlow, Node-RED, Home Assistant, Grafana, and local AI." width="1600" height="1185" loading="lazy" decoding="async" />
  </picture>
  <figcaption><span class="fig">FIG. 02 ·</span> SHADDOW · SYSTEM ARCHITECTURE · MQTT BUS</figcaption>
</figure>

## The stack underneath

Everything self-hosts on an Apple-silicon Mac in the van, reachable from
anywhere over Tailscale:

- **Dockerized services** — Mosquitto, InfluxDB + Grafana (history and
  dashboards), Node-RED, Home Assistant, AdGuard.
- **CI/CD** — push to `main`, GitHub Actions deploys to the van over SSH.
- **Always-on** — T-Mobile 5G for connectivity, EcoFlow LiFePO4 for power, so
  the system stays up independent of the ignition.

## Where it stands

The software runs daily: the head unit, the phone and Mac apps, telemetry,
power, and automation are all live in the van.

The hardware track — **Front Dock**, a custom 4-layer 12 V dock PCB (on-board
USB hub, local power generation, and an isolated read-only dual-CAN interface,
designed in KiCad and Flux.ai) — collapses a bench of adapters into one board.
It's **on hold**: the next steps there are going to a hardware collaborator
while I keep building the software side.

<figure class="photo full-bleed">
  <picture>
    <source type="image/webp" srcset="/images/shaddow/disassembly-1200.webp 1200w, /images/shaddow/disassembly-1600.webp 1600w" sizes="100vw" />
    <img src="/images/shaddow/disassembly-1200.jpg" srcset="/images/shaddow/disassembly-1200.jpg 1200w, /images/shaddow/disassembly-1600.jpg 1600w" sizes="100vw" alt="Shaddow hardware mid-disassembly laid out on dark velvet — exposed PCB, ribbon harnesses, and machined enclosure halves arranged like an exploded view." width="1600" height="1067" loading="lazy" decoding="async" />
  </picture>
  <figcaption><span class="fig">FIG. 03 ·</span> FRONT DOCK · HARDWARE TRACK (ON HOLD) · BENCH · 2026</figcaption>
</figure>
