import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Components/Login/Login.jsx';

beforeEach(() => {
  localStorage.clear();
});

describe('Testing Login component ("/login" route)', () => {
    const renderLogin = () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Login />
            </MemoryRouter>
        );
    };

    it('renders "Login" text', () => {
        renderLogin()
        expect(screen.getAllByText("Login")).toHaveLength(2);
    });

    it('renders sign up text', () => {
        renderLogin()
        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    });

    it('renders Username text field', () => {
        renderLogin()
        expect(screen.getByLabelText('Username')).toBeInTheDocument()
    });

    it('renders Password text field', () => {
        renderLogin()
        expect(screen.getByLabelText('Password')).toBeInTheDocument()
    });

    it('renders Sign Up button', () => {
        renderLogin()
        expect(screen.getByText('Sign Up')).toBeInTheDocument()
    });

    it('renders the currently signed in user if navigated back to this page', () => {
        localStorage.setItem('username', 'Alicia')
        renderLogin()
        expect(screen.getByText("You are already logged in as Alicia")).toBeInTheDocument()
        expect(screen.getByText("Not Alicia?")).toBeInTheDocument()
        expect(screen.getByText("Logout")).toBeInTheDocument()
    })

});
