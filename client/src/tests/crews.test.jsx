import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Crews from '../Components/Crews/Crews.jsx';

beforeEach(() => {
  localStorage.clear();
});

describe('Testing Crews component ("/Crews" route)', () => {
    const renderCrews = () => {
        render(
            <MemoryRouter initialEntries={['/crews']}>
                <Crews />
            </MemoryRouter>
        );
    };

    it('renders Crew Rotations text', () => {
        renderCrews()
        expect(screen.getByText(/Crew Rotations/)).toBeInTheDocument();
    });

    it('renders Add new rotations button', () => {
        renderCrews()
        expect(screen.getByText(/Add New Rotation/)).toBeInTheDocument();
    });

    // TODO add check for privilege to see other headers (once its not hardcoded)
    it('renders the cell headers', () => {
        renderCrews()
        expect(screen.getByText(/ID/)).toBeInTheDocument();
        expect(screen.getByText(/Crew Name/)).toBeInTheDocument();
        expect(screen.getByText(/Start Date/)).toBeInTheDocument();
        expect(screen.getByText(/End Date/)).toBeInTheDocument();
        expect(screen.getByText(/Shift Type/)).toBeInTheDocument();
        expect(screen.getByText(/Duration/)).toBeInTheDocument();
    });

    it('clicking on new rotation button adds row to table', async () => {
        renderCrews()
        expect(screen.getByText(/Add New Rotation/)).toBeInTheDocument();
        const new_rotation_button = await screen.findByRole('button', {
            name: /add new rotation/i,
        });

        await userEvent.click(new_rotation_button)

        expect(screen.getByText('New')).toBeInTheDocument()
    });

});
