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

    it('renders news box', () => {
        renderHome()
        expect(screen.getByText(/News/i)).toBeInTheDocument();
        expect(screen.getByText(/new courses available/i)).toBeInTheDocument();
    });

    it('should render "Welcome to Squad Sync" when not signed in', () => {
        renderHome()
        expect(screen.getByText("Welcome to Squad Sync!")).toBeInTheDocument();
    });

    it('should render "Welcome to Squad Sync" when signed in', () => {
        localStorage.setItem('username', 'Alicia');

        renderHome()
        expect(screen.getByText('Welcome to Squad Sync!')).toBeInTheDocument();
    });

    it('should render features when signed in', () => {
        renderHome()
        expect(screen.getByText('Features')).toBeInTheDocument();
        expect(screen.getByText(/Commander's Dashboard/)).toBeInTheDocument();
        expect(screen.getByText(/Crew Schedules/)).toBeInTheDocument();
        expect(screen.getByText(/Training Calendar/)).toBeInTheDocument();
    });
});
