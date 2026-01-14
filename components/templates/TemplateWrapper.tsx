'use client'

import { ReactNode } from 'react'
import { ContractorTemplate, ContractorTier, TRADE_THEME_DEFAULTS } from '@/types'

interface TemplateWrapperProps {
  children: ReactNode
  tier: ContractorTier
  template: ContractorTemplate | null | undefined
  tradeCategory?: string
}

// Get default colors for a trade category
function getTradeDefaults(categorySlug?: string) {
  if (!categorySlug) {
    return { primary: '#1e40af', secondary: '#1e3a8a', accent: '#3b82f6' }
  }
  return TRADE_THEME_DEFAULTS[categorySlug] || { primary: '#1e40af', secondary: '#1e3a8a', accent: '#3b82f6' }
}

// Convert hex to RGB for CSS variables that need opacity
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
  }
  return '30 64 175' // Fallback to blue
}

export function TemplateWrapper({ children, tier, template, tradeCategory }: TemplateWrapperProps) {
  // Get colors - premium users get their custom colors, free users get trade defaults
  const tradeDefaults = getTradeDefaults(tradeCategory)

  const colors = {
    primary: template?.primary_color || tradeDefaults.primary,
    secondary: template?.secondary_color || tradeDefaults.secondary,
    accent: template?.accent_color || tradeDefaults.accent,
  }

  // Build CSS custom properties
  const cssVariables = {
    '--template-primary': colors.primary,
    '--template-primary-rgb': hexToRgb(colors.primary),
    '--template-secondary': colors.secondary,
    '--template-secondary-rgb': hexToRgb(colors.secondary),
    '--template-accent': colors.accent,
    '--template-accent-rgb': hexToRgb(colors.accent),
    '--template-font': template?.font_family || 'Inter',
  } as React.CSSProperties

  // Determine template style class
  const styleClass = template?.template_style || 'modern'

  return (
    <div
      className={`template-wrapper template-${styleClass} ${tier === 'premium' ? 'is-premium' : 'is-free'}`}
      style={cssVariables}
    >
      {children}
    </div>
  )
}

// Hook to access template colors in child components
export function useTemplateColors() {
  return {
    primary: 'var(--template-primary)',
    secondary: 'var(--template-secondary)',
    accent: 'var(--template-accent)',
  }
}

// Utility classes for using template colors in Tailwind-style
export const templateClasses = {
  // Background colors
  bgPrimary: 'bg-[var(--template-primary)]',
  bgSecondary: 'bg-[var(--template-secondary)]',
  bgAccent: 'bg-[var(--template-accent)]',

  // Text colors
  textPrimary: 'text-[var(--template-primary)]',
  textSecondary: 'text-[var(--template-secondary)]',
  textAccent: 'text-[var(--template-accent)]',

  // Border colors
  borderPrimary: 'border-[var(--template-primary)]',
  borderSecondary: 'border-[var(--template-secondary)]',
  borderAccent: 'border-[var(--template-accent)]',

  // Gradient from primary to secondary
  gradientPrimarySecondary: 'bg-gradient-to-r from-[var(--template-primary)] to-[var(--template-secondary)]',
  gradientPrimarySecondaryVertical: 'bg-gradient-to-b from-[var(--template-primary)] to-[var(--template-secondary)]',
}
