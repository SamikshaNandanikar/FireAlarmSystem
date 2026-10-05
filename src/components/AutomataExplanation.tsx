import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface ConceptCard {
  title: string;
  summary: string;
  details: string;
}

const CONCEPTS: ConceptCard[] = [
  {
    title: 'What is a Mealy Machine?',
    summary: 'M = (Q, Σ, δ, λ, q0)',
    details:
      'A Mealy Machine is a Finite State Transducer where the output depends on both the current state and the current input. Formally: Q (States), Σ (Inputs), δ (Transition Function), λ (Output Function), q0 (Initial State).',
  },
  {
    title: 'State Set (Q)',
    summary: 'Q = {q0, q1, q2, q3, q4, q5, q6, q7}',
    details:
      'Q represents the discrete system states: q0 (NORMAL), q1 (WARNING), q2 (FIRE_SUSPECTED), q3 (FIRE_CONFIRMED), q4 (EVACUATION), q5 (FIRE_CLEARED), q6 (SYSTEM_FAULT), q7 (RESET).',
  },
  {
    title: 'Input Alphabet (Σ)',
    summary: 'Σ = {Smoke, Heat, Flame, Manual, Fault, Reset}',
    details:
      'Sensors generate virtual input combinations per building zone: Smoke (S), Heat (H), Flame (F), Manual Pull (M), System Fault (X), Reset (R).',
  },
  {
    title: 'Transition Function (δ)',
    summary: 'δ : Q × Σ → Q',
    details:
      'Determines the next state based on current state and active zone input combination. E.g., δ(q1 [WARNING], Smoke+Heat) = q2 [FIRE_SUSPECTED].',
  },
  {
    title: 'Output Function (λ)',
    summary: 'λ : Q × Σ → Output Relay',
    details:
      'Determines hardware relay outputs (Sprinklers, Siren, Evacuation, Lights, Notifications) associated with state transitions. E.g., λ(q3) = {Sprinkler: ON, Siren: ON}.',
  },
  {
    title: 'Initial & Absorbing States',
    summary: 'q0 (Initial), q3/q4 (Accepting Emergency)',
    details:
      'q0 is the safe initial state. q3 and q4 represent accepting emergency conditions where alarms lock until system reset.',
  },
];

export const AutomataExplanation: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <BookOpen size={16} className="text-amber-400" />
          AUTOMATA THEORY & VIVA PREPARATION GUIDE
        </span>
        <span className="text-xs text-slate-500 font-medium">Formal Math Definitions</span>
      </div>

      {/* Formal Mealy Machine Hero Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 mb-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-sky-500/5 to-emerald-500/5 pointer-events-none" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
          Mealy Machine Formal 5-Tuple Definition
        </span>
        <div className="text-2xl md:text-4xl font-extrabold font-heading text-sky-400 tracking-wider my-2">
          M = (Q, Σ, δ, λ, q₀)
        </div>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed mt-2">
          "The fire alarm system operates as a finite state transducer where sensor inputs (Σ) drive state transitions (δ), and hardware relays (Sprinklers, Sirens, Evacuation Lights) are generated as Mealy outputs (λ)."
        </p>
      </div>

      {/* Concept Accordion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONCEPTS.map((concept, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-colors hover:border-slate-700"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 font-heading focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-slate-950 border border-slate-800 text-amber-400">
                    <Layers size={14} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{concept.title}</h4>
                    <span className="text-xs font-mono text-sky-400">{concept.summary}</span>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3"
                  >
                    <p>{concept.details}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
