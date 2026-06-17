---
title: "Shaddow — a 12 V automotive dock platform"
summary: "An in-vehicle dock built around a Mac. The current board, Front Dock, is a 4-layer USB / power / dual-CAN extender designed in Flux.ai and KiCad."
status: active
featured: true
order: 1
tags: ["hardware", "kicad", "flux.ai", "automotive", "usb"]
---

**Shaddow** is the project name for the hardware I'm building around a Mac
that lives in a vehicle dashboard. The Mac does all the processing; Shaddow
provides power, I/O, vehicle integration, and the physical mounting that
makes a laptop behave like a head unit.

The current board is **Front Dock** — the first piece of Shaddow on a PCB.

## Front Dock — what it does

A 4-layer board that takes a stable 12 V from an EcoFlow LiFePO4 house
battery and gives the Mac a complete USB dock — video capture, audio in /
out, a front camera, two read-only CAN buses on the vehicle side, and a
control MCU on the host side. One USB 2.0 uplink to the Mac is fanned out
through an on-board hub to every peripheral. Power is generated locally
from the 12 V input.

## Headline blocks

- **Power** — reverse-polarity FET, TVS, fused input → buck-boost USB-C PD
  (LM51772 + TPS25751) → 5 V (TPS54331) → 3.3 V (TLV1117). A separate
  isolated 5 V rail feeds the CAN side via an SN6505B transformer driver.
- **USB hub + Mac uplink** — two cascaded FE1.1S hubs, ~7 downstream ports,
  ESD on every pair. USB-C device uplink with the proper CC pulldowns.
- **Video** — MS2130 USB UVC capture fed by a CVBS-to-HDMI front end with
  a THS7374 buffer for low-latency loop-through.
- **Audio** — PCM2904 USB audio codec, line in and line out, AC-coupled.
- **Dual CAN, read-only** — STM32G0B1 with dual FDCAN, two ISO1042 isolated
  transceivers. Listen-only, no on-board termination (the vehicle bus is
  already terminated).
- **Control** — ESP32-S3 over native USB-CDC, BTS7008 PROFET high-side
  switches for relay outputs, INA226 monitoring the 12 V rail, brownout
  and ignition sense inputs.
- **Remote start** — Fortin EVO-FORT1 interface, opto-isolated, on the
  vehicle-ground side.

## Where I am with it

Schematic and placement are done. Outside help is finishing the routing
and DRC cleanup for a clean JLCPCB fab pack; then first board bring-up on
the bench. Rev B will add a bench-test harness so the same firmware that
runs in a vehicle can validate the board on a desk.

## Why it exists

A vehicle "12 V" rail is anything but 12 V. It sags during a crank, spikes
on a load dump, and is noisy whenever the alternator is awake. Shaddow's
whole point is to absorb that and present clean, monitored rails to
everything downstream — and to do the vehicle-bus integration so the Mac
on top doesn't have to.
