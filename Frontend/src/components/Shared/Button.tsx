// src/components/Shared/Button.tsx
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary'
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  ...props
}) => {
  const baseClasses =
    'px-6 py-3 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center'

  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:shadow-cyan-500/40',
    secondary:
      'border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-white/10',
    tertiary: 'bg-white text-black font-bold',
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
