import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar.jsx';

beforeEach(() => {
  localStorage.clear();
});

describe('Testing Navbar component (all routes)', () => {
    const renderNavbar = () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Navbar />
            </MemoryRouter>
        );
    };

    it('renders "SquadSync" text', () => {
        renderNavbar()
        expect(screen.getByText("SquadSync")).toBeInTheDocument();
    });

    it('renders "Home" text', () => {
        renderNavbar()
        expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it('renders "Sign Up" text if not logged in', () => {
        renderNavbar()
        expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    it('renders "Log In" text if not logged in', () => {
        renderNavbar()
        expect(screen.getByText("Log In")).toBeInTheDocument();
    });

    it('does not render "Sign Up" if logged in', () => {
        localStorage.setItem('username', 'Alicia')
        renderNavbar()
        expect(screen.queryByText("Sign Up")).toBeNull()
    })

    it('does not render "Login" if logged in', () => {
        localStorage.setItem('username', 'Alicia')
        renderNavbar()
        expect(screen.queryByText("Log In")).toBeNull()
    })

    it('renders Dashboard if userPrivilege is commander', () => {
        localStorage.setItem('username', 'Alicia')
        localStorage.setItem('userPrivilege', 'commander')
        renderNavbar()
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('renders Dashboard if userPrivilege is scheduler', () => {
        localStorage.setItem('username', 'Alicia')
        localStorage.setItem('userPrivilege', 'scheduler')
        renderNavbar()
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('does not render Dashboard if userPrivilege is not commander or scheduler', () => {
        localStorage.setItem('username', 'Alicia')
        localStorage.setItem('userPrivilege', 'user')
        renderNavbar()
        expect(screen.queryByText('Dashboard')).toBeNull()
        localStorage.setItem('userPrivilege', 'training_manager')
        renderNavbar()
        expect(screen.queryByText('Dashboard')).toBeNull()
    })

    it('renders My Schedule if userPrivilege is scheduler', () => {
        localStorage.setItem('username', 'Alicia')
        localStorage.setItem('userPrivilege', 'scheduler')
        renderNavbar()
        expect(screen.getByText('My Schedule')).toBeInTheDocument()
    })

    it('does not render My Schedule if userPrivilege is not user or scheduler', () => {
        localStorage.setItem('username', 'Alicia')
        localStorage.setItem('userPrivilege', 'commander')
        renderNavbar()
        expect(screen.queryByText('My Schedule')).toBeNull()
        localStorage.setItem('userPrivilege', 'training_manager')
        renderNavbar()
        expect(screen.queryByText('My Schedule')).toBeNull()
    })

    it('renders Courses if userPrivilege is scheduler', () => {
        localStorage.setItem('username', 'Alicia')
        localStorage.setItem('userPrivilege', 'scheduler')
        renderNavbar()
        expect(screen.getByText('Courses')).toBeInTheDocument()
    })

    it('does not render Courses if userPrivilege is not scheduler', () => {
        localStorage.setItem('username', 'Alicia')
        localStorage.setItem('userPrivilege', 'commander')
        renderNavbar()
        expect(screen.queryByText('Courses')).toBeNull()
        localStorage.setItem('userPrivilege', 'training_manager')
        renderNavbar()
        expect(screen.queryByText('Courses')).toBeNull()
        localStorage.setItem('userPrivilege', 'user')
        renderNavbar()
        expect(screen.queryByText('Courses')).toBeNull()
    })

    it('renders Crew Schedule if userPrivilege is scheduler', () => {
        localStorage.setItem('username', 'Alicia')
        localStorage.setItem('userPrivilege', 'scheduler')
        renderNavbar()
        expect(screen.getByText('Crew Schedule')).toBeInTheDocument()
    })

    it('does not render Crew Schedule if userPrivilege is not scheduler', () => {
        localStorage.setItem('username', 'Alicia')
        localStorage.setItem('userPrivilege', 'commander')
        renderNavbar()
        expect(screen.queryByText('Crew Schedule')).toBeNull()
        localStorage.setItem('userPrivilege', 'training_manager')
        renderNavbar()
        expect(screen.queryByText('Crew Schedule')).toBeNull()
        localStorage.setItem('userPrivilege', 'user')
        renderNavbar()
        expect(screen.queryByText('Crew Schedule')).toBeNull()
    })

    it('renders Update Users if userPrivilege is scheduler', () => {
        localStorage.setItem('username', 'Alicia')
        localStorage.setItem('userPrivilege', 'scheduler')
        renderNavbar()
        expect(screen.getByText('Update Users')).toBeInTheDocument()
    })

    it('does not render Update Users if userPrivilege is not scheduler', () => {
        localStorage.setItem('username', 'Alicia')
        localStorage.setItem('userPrivilege', 'commander')
        renderNavbar()
        expect(screen.queryByText('Update Users')).toBeNull()
        localStorage.setItem('userPrivilege', 'training_manager')
        renderNavbar()
        expect(screen.queryByText('Update Users')).toBeNull()
        localStorage.setItem('userPrivilege', 'user')
        renderNavbar()
        expect(screen.queryByText('Update Users')).toBeNull()
    })

    it('renders My Schedule if userPrivilege is user', () => {
        localStorage.setItem('username', 'Alicia')
        localStorage.setItem('userPrivilege', 'user')
        renderNavbar()
        expect(screen.getByText('My Schedule')).toBeInTheDocument()
    })



});
