// src/components/Shared/Button.tsx
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'gradient' | 'ghost' | 'tertiary'
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'gradient',
  ...props
}) => {
  const baseClasses =
    'group px-7 py-3 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center text-lg'

  const variantClasses = {
    // For the bright blue "Start creating" button
    gradient:
      'bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:shadow-xl hover:shadow-cyan-500/30',

    // For the transparent "Watch demo" button
    ghost:
      'bg-black/20 backdrop-blur-sm border border-slate-600 text-slate-200 hover:text-white hover:border-slate-400 hover:bg-white/5',

    // For the white button used in other sections
    tertiary: 'bg-white text-black font-bold hover:bg-slate-200',
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
