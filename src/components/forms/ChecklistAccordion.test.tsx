import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ChecklistAccordion, { type ChecklistStep } from './ChecklistAccordion';

const steps: ChecklistStep[] = [
  {
    id: 1,
    title: 'Identifikasjon og sjekk av leveransen',
    kontrolleresMot: 'Følgeseddel',
    testprosedyre: 'Visuell sjekk',
  },
  {
    id: 2,
    title: 'Evt. transportskade',
    kontrolleresMot: 'Riper og bulker',
    testprosedyre: 'Visuell sjekk',
  },
];

const resultOptions = ['Profilene', 'Pakninger'];

describe('ChecklistAccordion', () => {
  it('renders expanded step details and result options', () => {
    render(
      <ChecklistAccordion
        steps={steps}
        resultOptions={resultOptions}
        expandedSteps={[1]}
        selectedResults={{ 1: ['Profilene'] }}
        onToggleStep={vi.fn()}
        onToggleResult={vi.fn()}
      />,
    );

    expect(screen.getByText('Kontrolleres mot:')).toBeInTheDocument();
    expect(screen.getByText('Testprosedyre:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pakninger' })).toBeInTheDocument();
  });

  it('forwards toggle handlers for step and result interactions', async () => {
    const user = userEvent.setup();
    const handleToggleStep = vi.fn();
    const handleToggleResult = vi.fn();

    render(
      <ChecklistAccordion
        steps={steps}
        resultOptions={resultOptions}
        expandedSteps={[1]}
        selectedResults={{ 1: [] }}
        onToggleStep={handleToggleStep}
        onToggleResult={handleToggleResult}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Evt. transportskade/i }));
    await user.click(screen.getByRole('button', { name: 'Pakninger' }));

    expect(handleToggleStep).toHaveBeenCalledWith(2);
    expect(handleToggleResult).toHaveBeenCalledWith(1, 'Pakninger');
  });
});
