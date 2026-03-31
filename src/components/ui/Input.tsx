import * as React from 'react';
import { BODY_FONT_FAMILY, UI_COLORS } from '../../styles/uiTokens';

const baseInputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '3.35rem',
  borderRadius: '1rem',
  border: `2px solid ${UI_COLORS.line300}`,
  padding: '0 1.1rem',
  fontSize: 'clamp(1rem, 2.5vw, 1.12rem)',
  fontWeight: 700,
  color: UI_COLORS.ink900,
  background: UI_COLORS.surface0,
  boxSizing: 'border-box',
  fontFamily: BODY_FONT_FAMILY,
  outline: 'none',
};

function Input({ style, type = 'text', ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      style={{ ...baseInputStyle, ...style }}
      {...props}
    />
  );
}

export { Input };