---
title: "Shaddow — a 12 V automotive dock platform"
summary: "An in-vehicle dock built around a Mac. The current board, Front Dock, is a 4-layer USB / power / dual-CAN extender designed in Flux.ai and KiCad."
status: active
featured: true
order: 1
tags: ["hardware", "kicad", "flux.ai", "automotive", "usb"]
---

<figure class="photo full-bleed">
  <picture>
    <source type="image/webp" srcset="/images/shaddow/disassembly-1200.webp 1200w, /images/shaddow/disassembly-1600.webp 1600w" sizes="100vw" />
    <img src="/images/shaddow/disassembly-1200.jpg" srcset="/images/shaddow/disassembly-1200.jpg 1200w, /images/shaddow/disassembly-1600.jpg 1600w" sizes="100vw" alt="Shaddow hardware mid-disassembly laid out on dark velvet — exposed PCB, ribbon harnesses, and machined enclosure halves arranged like an exploded view." width="1600" height="1067" loading="eager" decoding="async" />
  </picture>
  <figcaption><span class="fig">FIG. 01 ·</span> SHADDOW / DISASSEMBLY · BENCH · 2026 · CH 03 ▮ GREEN</figcaption>
</figure>

**Shaddow** is the project name for the hardware I'm building around a Mac
that lives in a vehicle dashboard. The Mac does all the processing; Shaddow
provides power, I/O, vehicle integration, and the physical mounting that
makes a laptop behave like a head unit.

The current board is **Front Dock** — the first piece of Shaddow on a PCB.

## Overview

A 4-layer board, designed thin-edge / fat-core: a single USB 2.0 uplink to
the Mac fans out through an on-board hub to every peripheral, and power is
generated locally from a 12 V input (an EcoFlow LiFePO4 house battery in
the test van). Target board cost: roughly $150–270 for the first 5 units
through JLCPCB.

## Stack

- **Power** — reverse-polarity FET (DMP3013SFV), TVS (SMCJ18CA), fused
  input → 45 W USB-C PD (LM51772 4-switch buck-boost + TPS25751 PD
  controller, EEPROM-configured for 5/9/15 V at ≤45 W). Then 5 V / 3 A
  via TPS54331 buck, 3.3 V via TLV1117. A separate isolated 5 V rail
  feeds the CAN side through an SN6505B transformer driver and a small
  isolation transformer.
- **USB hub + Mac uplink** — two cascaded FE1.1S 2.0 hubs, USB-C device
  uplink with proper CC pulldowns, USBLC6 ESD on every pair.
- **Video** — MS2130 USB-UVC capture fed by a CVBS-to-HDMI front end,
  with a THS7374 75 Ω buffer for a low-latency loop-through to the head
  unit.
- **Audio** — PCM2904 USB audio codec, AC-coupled line in and line out.
- **Front camera** — off-board IMX462 UVC module on a 4-pin USB header.
- **Dual CAN, read-only, isolated** — STM32G0B1 (native dual FDCAN) with
  two ISO1042 isolated transceivers on the vehicle-ground side. No
  on-board termination, listen-only — the only allowed TX is OBD-II PID
  requests.
- **Control** — ESP32-S3 over native USB-CDC, BTS7008 PROFET high-side
  switches driving relay outputs, INA226 monitoring the 12 V rail, plus
  brownout / ignition / reverse / door sense inputs.
- **Remote start** — Fortin EVO-FORT1 interface, opto-isolated on the
  vehicle-ground side: three dry-contact outputs (START / LOCK / UNLOCK)
  and two status inputs (RUNNING + status).

<figure class="photo full-bleed">
  <img src="/images/shaddow/front-dock-plan.png" alt="Front Dock revised-plan flowchart — skip Flux, KiCad to JLCPCB cost/timeline, two chip-swap fixes (MS2106 video; IP2368/TPS25751DREFR power), and a hand-routing bottleneck note." width="1188" height="691" loading="lazy" decoding="async" />
  <figcaption><span class="fig">FIG. 02 ·</span> FRONT DOCK · REVISED PLAN · KICAD → JLCPCB · ROUTING PASS · CH 03 ▮ GREEN</figcaption>
</figure>

## Design rules I committed to

Galvanic isolation between the CAN transceivers / Fortin interface and the
board ground (single star to the EcoFlow DC negative). CAN strictly
listen-only — the vehicle bus is already terminated, and I don't want to
write to anything I don't have to. macOS sees the dual-CAN MCU as SLCAN
and talks to it via python-can.

## Status

Schematic and placement are done. I'm wrapping up the routing pass and
DRC cleanup against JLCPCB's rules, then it goes to fab. Rev B will add
a bench-test harness so the same firmware that runs in a vehicle can
validate the board on a desk — closing the loop between dashboard tests
and the lab.

The proving ground is a self-built camper van — a 12 V workshop on wheels,
and the bench where this hardware actually has to survive. The fixes that
last aren't the prettiest ones; they're the ones I can redo at 11 pm in a
parking lot. That lesson travels well to software, too.

## Why Flux.ai *and* KiCad

I started in Flux.ai for the schematic capture — fast, agreeable to the
AI-assisted placement workflow, and good at the early-iteration phase
when the architecture is still moving. The serious layout work moved to
KiCad: more control over multi-layer routing, copper pours, and the
exact JLCPCB-spec fab pack. Flux is the napkin; KiCad is where the board
actually ships from.

## Why it exists

A vehicle "12 V" rail is anything but 12 V. It sags during a crank,
spikes on a load dump, and is noisy whenever the alternator is awake.
Shaddow's whole point is to absorb that and present clean, monitored
rails to everything downstream — and to do the vehicle-bus integration
so the Mac on top doesn't have to.
