import * as React from 'react';
import { BODY_FONT_FAMILY, UI_COLORS } from '../../styles/uiTokens';

const baseTextareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '7rem',
  borderRadius: '1rem',
  border: `2px solid ${UI_COLORS.line300}`,
  padding: '1rem 1.1rem',
  fontSize: 'clamp(1rem, 2.5vw, 1.12rem)',
  fontWeight: 700,
  color: UI_COLORS.ink900,
  background: UI_COLORS.surface0,
  boxSizing: 'border-box',
  fontFamily: BODY_FONT_FAMILY,
  outline: 'none',
  resize: 'vertical',
};

function Textarea({ style, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      style={{ ...baseTextareaStyle, ...style }}
      {...props}
    />
  );
}

export { Textarea };
