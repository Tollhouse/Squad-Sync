import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SchdedulerUser from '../Components/User/SchedulerUser.jsx';

beforeEach(() => {
  localStorage.clear();
});

describe('Testing SchdedulerUser component ("/user/scheduler" route)', () => {
    const renderSchdedulerUser = () => {
        render(
            <MemoryRouter initialEntries={['/user/scheduler']}>
                <SchdedulerUser />
            </MemoryRouter>
        );
    };

    it('should render table with user info headers', async () => {
        renderSchdedulerUser()
        expect(screen.getByText('ID')).toBeInTheDocument()
        expect(screen.getByText('User Name')).toBeInTheDocument()
        expect(screen.getByText('First Name')).toBeInTheDocument()
        expect(screen.getByText('Last Name')).toBeInTheDocument()
        expect(screen.getByText('Assigned Flight')).toBeInTheDocument()
        expect(screen.getByText('Crew Name')).toBeInTheDocument()
        expect(screen.getByText('Position')).toBeInTheDocument()
        expect(screen.getByText('Privilege')).toBeInTheDocument()
        expect(screen.getByText('Experience Level')).toBeInTheDocument()
        expect(screen.getByText('Edit')).toBeInTheDocument()
    })
});
