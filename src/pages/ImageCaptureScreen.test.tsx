import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ImageCaptureScreen from './ImageCaptureScreen';

describe('ImageCaptureScreen', () => {
  it('loads saved images and allows removing them', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      'alufas:image-drafts:ctx-1',
      JSON.stringify([
        {
          id: 'img-1',
          name: 'proof.jpg',
          dataUrl: 'data:image/png;base64,abc',
          source: 'gallery',
          createdAt: '2025-01-01',
        },
      ]),
    );

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/image-capture', state: { contextKey: 'ctx-1', contextTitle: 'Avvik', returnTo: '/avvik' } },
        ]}
      >
        <Routes>
          <Route path="/image-capture" element={<ImageCaptureScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('proof.jpg')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[buttons.length - 1]);

    expect(screen.queryByText('proof.jpg')).not.toBeInTheDocument();
    expect(screen.getByText(/Ingen bilder enn/i)).toBeInTheDocument();
  });
});
