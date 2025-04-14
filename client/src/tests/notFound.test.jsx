import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../Components/NotFound/NotFound.jsx';
import { vi } from 'vitest';

beforeEach(() => {
  localStorage.clear();
});

vi.useFakeTimers();

describe('Testing NotFound component ("/*" route)', () => {
    const renderNotFound = () => {
        render(
            <MemoryRouter initialEntries={['/bad_route']}>
                <NotFound />
            </MemoryRouter>
        );
    };

    it('404 error message displayed', () => {
        renderNotFound()
        expect(screen.getByText('404 Page Not Found')).toBeInTheDocument()
    })

    it('redirection message displayed', () => {
        renderNotFound()
        expect(screen.getByText(/Redirecting to home page in/)).toBeInTheDocument()
    })

});
