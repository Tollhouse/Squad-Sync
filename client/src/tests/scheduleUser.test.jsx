import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SchdedulerUser from '../Components/User/SchedulerUser.jsx';
import userEvent from '@testing-library/user-event';

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

    it('should render table with user info headers', () => {
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

    it('should render user search bar', () => {
        renderSchdedulerUser()
        expect(screen.getByTestId('test-userSearchBar')).toBeInTheDocument()
    })

    it('should render user edit button', async () => {
        renderSchdedulerUser()
        const edit_buttons = await screen.findAllByTestId('test-editIcon', {}, { timeout: 3000 })
        expect(edit_buttons.length > 0).toBe(true)
    })

    it('should render user delete button', async () => {
        renderSchdedulerUser()
        const delete_buttons = await screen.findAllByTestId('test-deleteIcon', {}, { timeout: 3000 })
        expect(delete_buttons.length > 0).toBe(true)
    })

    it('clicking user delete button brings up modals', async () => {
        renderSchdedulerUser()
        const delete_buttons = await screen.findAllByTestId('test-deleteIcon', {}, { timeout: 3000 })
        expect(delete_buttons.length > 0).toBe(true)
        userEvent.click(delete_buttons[0])
        const delete_modal = await screen.findByText(/Confirm Delete/, {}, { timeout: 3000 })
        expect(delete_modal).toBeInTheDocument()
    })

    it('clicking user edit button renders save button', async () => {
        renderSchdedulerUser()
        const edit_buttons = await screen.findAllByTestId('test-editIcon', {}, { timeout: 3000 })
        expect(edit_buttons.length > 0).toBe(true)
        userEvent.click(edit_buttons[0])
        const save_icons = await screen.findAllByTestId("test-saveIcon", {}, { timeout: 3000 })
        expect(save_icons.length).toBe(1)
    })
});
