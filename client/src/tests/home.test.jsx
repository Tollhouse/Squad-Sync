import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Components/Home/Home.jsx';

beforeEach(() => {
  localStorage.clear();
});

describe('Testing Home component ("/" route)', () => {
    const renderHome = () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Home />
            </MemoryRouter>
        );
    };

    it('renders welcome text', () => {
        renderHome()
        expect(screen.getByText(/Welcome to Squad Sync/i)).toBeInTheDocument();
    });

    it('renders description text', () => {
        renderHome()
        expect(screen.getByText(/Our app strives to provide a one stop, scalable solution that/i)).toBeInTheDocument();
    });

    it('should render "Guest" when not signed in', () => {
        renderHome()
        expect(screen.getByText("Guest")).toBeInTheDocument();
    });

    it('should render "Alicia" when Alicia is signed in', () => {
        localStorage.setItem('username', 'Alicia');

        renderHome()
        expect(screen.getByText('Welcome, Alicia!')).toBeInTheDocument();
    });
});
