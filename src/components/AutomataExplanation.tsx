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
    title: 'What is a DFA?',
    summary: 'Deterministic Finite Automaton',
    details:
      'A Deterministic Finite Automaton (DFA) is a theoretical model of computation with a finite set of states. For every state and input symbol, there is exactly one deterministic transition to a next state.',
  },
  {
    title: 'States (Q)',
    summary: 'Q = {q0, q1, q2, q3}',
    details:
      'States represent the discrete operational phases of the system. In our Fire Alarm system: q0 = NORMAL, q1 = SMOKE DETECTED, q2 = HIGH TEMPERATURE, q3 = FIRE ALARM.',
  },
  {
    title: 'Alphabet (Σ)',
    summary: 'Σ = {N, S, H, F}',
    details:
      'The input alphabet consists of symbols representing physical sensor events: N = Normal, S = Smoke Detected, H = High Temperature, F = Fire Detected.',
  },
  {
    title: 'Transition Function (δ)',
    summary: 'δ : Q × Σ → Q',
    details:
      'The transition function defines the deterministic mapping from a current state and input token to the subsequent state. E.g., δ(q1, H) = q2.',
  },
  {
    title: 'Initial State (q0)',
    summary: 'q0 = NORMAL',
    details:
      'The designated state where computation begins when the system is initialized or reset.',
  },
  {
    title: 'Final / Emergency State (F)',
    summary: 'F = {q3}',
    details:
      'The set of accepting or terminal states. In our safety system, q3 represents the accepting emergency condition where fire alarms activate.',
  },
  {
    title: 'Absorbing State',
    summary: 'Trap state q3',
    details:
      'An absorbing (trap) state is a state where all input transitions return to itself: δ(q3, σ) = q3 for all σ ∈ Σ. Once entered, the system remains in q3 until an explicit SYSTEM RESET occurs.',
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
          UNDERSTANDING THE DFA (AUTOMATA THEORY)
        </span>
        <span className="text-xs text-slate-500 font-medium">Academic Theory & Formal Definition</span>
      </div>

      {/* Formal Definition Hero Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 mb-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-sky-500/5 to-emerald-500/5 pointer-events-none" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
          Formal 5-Tuple Definition
        </span>
        <div className="text-2xl md:text-4xl font-extrabold font-heading text-sky-400 tracking-wider my-2">
          M = (Q, Σ, δ, q₀, F)
        </div>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed mt-2">
          "Each sensor event is treated as an input symbol. The DFA determines the next system state based on the current state and the received input token."
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
