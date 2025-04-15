import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from '../Components/Signup/Signup.jsx';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  localStorage.clear();
});

describe('Testing Signup component ("/signup" route)', () => {
    const renderSignup = () => {
        render(
            <MemoryRouter initialEntries={['/Signup']}>
                <Signup />
            </MemoryRouter>
        );
    };

    it('renders "Signup" text', () => {
        renderSignup()
        expect(screen.getByText("Sign Up")).toBeInTheDocument()
    });

    it('handles user input accordingly', async () =>{
        renderSignup()
        const firstNameInput = screen.getByLabelText(/first name/i);
        const lastNameInput = screen.getByLabelText(/last name/i);
        const userNameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);

        await userEvent.type(firstNameInput, 'John');
        await waitFor(() => {
            expect(firstNameInput.value).toBe('John');
        });
        await userEvent.type(lastNameInput, 'Doe');
        await waitFor(() => {
            expect(lastNameInput.value).toBe('Doe');
        });
        await userEvent.type(userNameInput, 'john_doe');
        await waitFor(() => {
            expect(userNameInput.value).toBe('john_doe');
        });
        await userEvent.type(passwordInput, 'password123');
        await waitFor(() => {
            expect(passwordInput.value).toBe('password123');
        });
    })

});
