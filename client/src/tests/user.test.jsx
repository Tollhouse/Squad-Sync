import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import User from '../Components/User/User.jsx';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  localStorage.clear();
});

describe('Testing User component ("/user/:id" route)', () => {
    const renderUser = () => {
        render(
            <MemoryRouter initialEntries={['/user/1']}>
                <Routes>
                    <Route path="/user/:id" element={<User />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('renders "username" text', async () => {
        renderUser()
        const usernameText = await screen.findByTestId("test-userNameText");
        expect(usernameText).toBeInTheDocument();
    });

    it('renders "your courses" text', async () => {
        renderUser()
        const courses = await screen.findByText(/Your Courses/i);
        expect(courses).toBeInTheDocument();
    });

    it('renders "your crew" text', async () => {
        renderUser()
        const crew = await screen.findByText(/Your Crew/i, {}, { timeout: 5000 });
        expect(crew).toBeInTheDocument();
    });

});
