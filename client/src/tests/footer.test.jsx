import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../Components/Footer/Footer.jsx';

beforeEach(() => {
  localStorage.clear();
});

vi.useFakeTimers();

describe('Testing Footer component (all routes)', () => {
    const renderFooter = () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Footer />
            </MemoryRouter>
        );
    };

    it('Names displayed', () => {
        renderFooter()
        expect(screen.getByText(/Curtis Bonham/i)).toBeInTheDocument()
        expect(screen.getByText(/Tyson Butler-Currier/i)).toBeInTheDocument()
        expect(screen.getByText(/Harman Gidda/i)).toBeInTheDocument()
        expect(screen.getByText(/Essence Jackson/i)).toBeInTheDocument()
        expect(screen.getByText(/Lorena Longoria/i)).toBeInTheDocument()
        expect(screen.getByText(/Jackie Luu/i)).toBeInTheDocument()
        expect(screen.getByText(/Landon Spencer/i)).toBeInTheDocument()
        expect(screen.getByText(/Michael Thomas/i)).toBeInTheDocument()
        expect(screen.getByText(/Erik Voss/i)).toBeInTheDocument()
    })


});
