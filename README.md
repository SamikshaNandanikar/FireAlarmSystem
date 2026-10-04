# 🔥 Smart Fire Alarm System — DFA Simulator

A polished, college-level interactive Deterministic Finite Automaton (DFA) simulation of a Smart Fire Alarm Control System built with **React**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Web Audio API synthesis**.

Designed specifically for **Automata Theory / Theory of Computation** classroom demonstrations, project vivas, and interactive learning.

---

## 🚀 Live Demo & Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm / yarn

### Installation & Execution

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd automata-project

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 🧮 Formal DFA Machine Specifications

The underlying state machine strictly models a 5-tuple Deterministic Finite Automaton:

$$M = (Q, \Sigma, \delta, q_0, F)$$

### 1. Set of States ($Q$)
- **$q_0$ = NORMAL**: System monitoring active; ambient baselines clean.
- **$q_1$ = SMOKE DETECTED**: Aerosol smoke sensors register suspended particulates.
- **$q_2$ = HIGH TEMPERATURE**: Thermal sensors exceed warning threshold ($75^\circ\text{C}$).
- **$q_3$ = FIRE ALARM**: Optical flame sensors confirm active combustion ($95^\circ\text{C}$).

### 2. Input Alphabet ($\Sigma$)
- **$N$ = Normal**: Sensor signal returns to ambient baseline.
- **$S$ = Smoke Detected**: Optical chamber registers particulate obscuration.
- **$H$ = High Temperature**: Rapid thermal temperature spike registered.
- **$F$ = Fire Detected**: Infrared & UV flame sensors confirm active flame.

### 3. Initial State ($q_0$)
- $q_0 = \text{NORMAL}$

### 4. Accepting / Emergency State ($F$)
- $F = \{q_3\}$ (Absorbing State)

### 5. Transition Matrix ($\delta : Q \times \Sigma \to Q$)

| Current State ($Q$) | Input $N$ | Input $S$ | Input $H$ | Input $F$ | State Description |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **$q_0$ (NORMAL)** | $q_0$ | **$q_1$** | $q_0$ | $q_0$ | Safe ambient state |
| **$q_1$ (SMOKE)** | $q_1$ | $q_1$ | **$q_2$** | $q_1$ | Smoke monitoring state |
| **$q_2$ (HIGH TEMP)**| $q_2$ | $q_2$ | $q_2$ | **$q_3$** | Heat warning state |
| **$q_3$ (FIRE ALARM)**| **$q_3$** | **$q_3$** | **$q_3$** | **$q_3$** | **Absorbing emergency alarm state** |

> **Note on $q_3$ (Absorbing Trap State):** Once $q_3$ is reached, all input symbols ($N, S, H, F$) transition back to $q_3$ without restarting the siren audio instance. Only an explicit **SYSTEM RESET** returns the system to $q_0$.

---

## ✨ Features

- **Web Audio API Synthesis**: Pure programmatic sound synthesis (warning beeps, dual-tone thermal beeps, looping siren sweep, and ascending reset resolve chime) without external audio file dependencies.
- **Dynamic Visual Environment**: Pure CSS keyframe animations, smoke particle cloud rise ($q_1$), heat-wave shimmer distortion ($q_2$), and multi-layer SVG flames ($q_3$).
- **Interactive SVG State Graph**: Real-time glowing node indicators and flowing dashed path edges on transitions.
- **DFA Transition Table**: High-performance matrix table highlighting active state rows and selected input columns.
- **Transition Log History**: Timed event log with timestamp, token input, state change, and a non-destructive clear log option.
- **Automata Theory Guide**: 5-tuple math definitions and expandable concept accordions for classroom presentations.
- **Professor Demo Mode**: Step-by-step recommended manual progression guide ($q_0 \xrightarrow{S} q_1 \xrightarrow{H} q_2 \xrightarrow{F} q_3$).

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Custom Glassmorphism System
- **Animations**: Framer Motion + CSS Keyframes + SVG Filters
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API (`AudioContext`)

---

## 📜 License

Distributed under the MIT License. Designed for Automata Theory / Theory of Computation demonstration.
