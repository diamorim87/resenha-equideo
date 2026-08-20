import React from 'react';
import { UserCheck, Edit3, FileCheck } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, title: 'Identificação & Dados', icon: UserCheck, desc: 'Proprietário e Animal' },
    { number: 2, title: 'Resenha Gráfica', icon: Edit3, desc: 'Vistas Anatômicas & Marcas' },
    { number: 3, title: 'Resenha & Laudo PDF', icon: FileCheck, desc: 'Revisão e Emissão' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 px-2">
      <div className="bg-[#FAF8F5] border border-[#EDE6DB] p-3 sm:p-4 rounded-2xl shadow-sm">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <button
                key={step.number}
                type="button"
                id={`step-indicator-btn-${step.number}`}
                onClick={() => onStepClick(step.number)}
                className={`flex flex-col items-center text-center p-2 sm:p-3 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? 'bg-[#1B5E20] text-white shadow-md ring-2 ring-[#8B5A2B]'
                    : isCompleted
                    ? 'bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#C8E6C9]'
                    : 'bg-white/60 text-[#7A7A7A] hover:bg-white'
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1.5 transition-transform ${
                    isActive
                      ? 'bg-[#8B5A2B] text-white ring-2 ring-white scale-110'
                      : isCompleted
                      ? 'bg-[#2E7D32] text-white'
                      : 'bg-[#EDE6DB] text-[#8B5A2B]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold sm:text-sm tracking-tight leading-tight">
                  {step.title}
                </span>
                <span
                  className={`text-[11px] hidden sm:block mt-0.5 ${
                    isActive ? 'text-[#C8E6C9]' : 'text-[#8A8A8A]'
                  }`}
                >
                  {step.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
