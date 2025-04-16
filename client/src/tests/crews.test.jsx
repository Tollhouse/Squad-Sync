import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Crews from '../Components/Crews/Crews.jsx';
import { ThemeProvider } from  '@mui/material/styles';
import TableTheme from '../Components/AddOns/TableTheme';

beforeEach(() => {
  localStorage.clear();
});

describe('Testing Crews component ("/Crews" route)', () => {
    const renderCrews = () => {
        render(
            <MemoryRouter initialEntries={['/crews']}>
                <ThemeProvider theme={TableTheme()}>
                    <Crews />
                </ThemeProvider>
            </MemoryRouter>
          );
    };

    it('renders Crew Rotations text', async () => {
        renderCrews()
        const crew_rotations = await screen.getByText(/Crew Rotations/)
        expect(crew_rotations).toBeInTheDocument();
    });

    it('renders Add new rotations button', () => {
        renderCrews()
        expect(screen.getByText(/Add Crew Rotation/)).toBeInTheDocument();
    });

    // // TODO add check for privilege to see other headers (once its not hardcoded)
    it('renders the cell headers', () => {
        renderCrews()
        expect(screen.getByText(/ID/)).toBeInTheDocument();
        expect(screen.getByText(/Crew Name/)).toBeInTheDocument();
        expect(screen.getByText(/Start Date/)).toBeInTheDocument();
        expect(screen.getByText(/End Date/)).toBeInTheDocument();
        expect(screen.getByText(/Shift Type/)).toBeInTheDocument();
        expect(screen.getByText(/Crew Experience/)).toBeInTheDocument();
        expect(screen.getByText(/Edit/)).toBeInTheDocument();
    });

    it('clicking on new rotation button brings up modal', async () => {
        renderCrews()
        expect(screen.getByText(/Add Crew Rotation/)).toBeInTheDocument();
        const new_rotation_button = await screen.findByTestId('test-addCrewRotation')

        await userEvent.click(new_rotation_button)

        expect(screen.getByText('Add Rotation')).toBeInTheDocument()
    });

    it('clicking on rotation row button brings up crew roster', async () => {
        renderCrews()
        expect(screen.getByText(/Add Crew Rotation/)).toBeInTheDocument();
        const rotation_row = await screen.findAllByTestId('test-rotationRow')

        await userEvent.click(rotation_row[0])

        expect(await screen.findByText('Alpha Crew Roster')).toBeInTheDocument()
    });

    it('edit button is rendered for crew rotations entries', async () => {
        renderCrews();
        await screen.findByText("Not Assigned");
        const edit_button = await screen.findAllByTestId('test-crewRotationEdit')
        expect(edit_button.length).toBeGreaterThan(0)
    });

    it('save icon is rendered after edit is clicked for crew rotations entries', async () => {
        renderCrews();
        await screen.findByText("Not Assigned");
        const editButtons = await screen.findAllByTestId('test-crewRotationEdit');
        await userEvent.click(editButtons[0]);
        const save = await screen.findAllByTestId("test-crewRotationSave");
        expect(save.length).toBeGreaterThan(0)
    });

    it('renders edit icon for crew roster', async () => {
        renderCrews()
        expect(screen.getByText(/Add Crew Rotation/)).toBeInTheDocument();
        const rotation_row = await screen.findAllByTestId('test-rotationRow')

        await userEvent.click(rotation_row[0])

        expect(await screen.findByText('Alpha Crew Roster')).toBeInTheDocument()
        const edit = await screen.findAllByTestId('test-crewRosterEdit')
        expect(edit.length).toBeGreaterThan(0)
    })

    it('clicking edit icon for crew roster renders save', async () => {
        renderCrews()
        expect(screen.getByText(/Add Crew Rotation/)).toBeInTheDocument();
        const rotation_row = await screen.findAllByTestId('test-rotationRow')

        await userEvent.click(rotation_row[0])

        expect(await screen.findByText('Alpha Crew Roster')).toBeInTheDocument()
        const edit = await screen.findAllByTestId('test-crewRosterEdit')
        expect(edit.length).toBeGreaterThan(0)
        userEvent.click(edit[0])
        const save = await screen.findAllByTestId('test-crewRosterSave')
        expect(edit.length).toBeGreaterThan(0)
    })

});
