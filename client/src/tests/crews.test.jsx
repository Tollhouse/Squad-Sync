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

    it('renders Crew Rotations text', () => {
        renderCrews()
        expect(screen.getByText(/Crew Rotations/)).toBeInTheDocument();
    });

    it('renders Add new rotations button', () => {
        renderCrews()
        expect(screen.getByText(/Add Crew Rotation/)).toBeInTheDocument();
    });

    // TODO add check for privilege to see other headers (once its not hardcoded)
    it('renders the cell headers', () => {
        renderCrews()
        expect(screen.getByText(/ID/)).toBeInTheDocument();
        expect(screen.getByText(/Crew Name/)).toBeInTheDocument();
        expect(screen.getByText(/Start Date/)).toBeInTheDocument();
        expect(screen.getByText(/End Date/)).toBeInTheDocument();
        expect(screen.getByText(/Shift Type/)).toBeInTheDocument();
        // expect(screen.getByText(/Duration/)).toBeInTheDocument();
    });

    // it('clicking on new rotation button adds row to table', async () => {
    //     renderCrews()
    //     expect(screen.getByText(/Add New Rotation/)).toBeInTheDocument();
    //     const new_rotation_button = await screen.findByRole('button', {
    //         name: /add new rotation/i,
    //     });

    //     await userEvent.click(new_rotation_button)

    //     expect(screen.getByText('New')).toBeInTheDocument()
    // });

    // it('delete button is rendered for crew rotations entries', async () => {
    //     renderCrews();
    //     await screen.findByText("Not Assigned");
    //     await waitFor(() => {
    //         expect(screen.getAllByTestId("test-deleteButton").length).toBeGreaterThan(0);
    //       });
    // });

    // it('edit button is rendered for crew rotations entries', async () => {
    //     renderCrews();
    //     await screen.findByText("Not Assigned");
    //     await waitFor(() => {
    //         expect(screen.getAllByTestId("test-editButton").length).toBeGreaterThan(0);
    //       });
    // });

    // it('delete button is rendered for crew rotations entries', async () => {
    //     renderCrews();
    //     await screen.findByText("Not Assigned");
    //     const deleteButtons = screen.getAllByTestId("test-deleteButton");
    //     await userEvent.click(deleteButtons[0]);
    //     const na = await screen.findAllByText("N/A");
    //     expect(na.length).toBeGreaterThan(0)
    // });

    // it('save icon is rendered after edit is clicked for crew rotations entries', async () => {
    //     renderCrews();
    //     await screen.findByText("Not Assigned");
    //     const editButtons = screen.getAllByTestId("test-editButton");
    //     await userEvent.click(editButtons[0]);
    //     const save = await screen.getAllByTestId("test-saveIcon");
    //     expect(save.length).toBeGreaterThan(0)
    // });

    // it('renders Not assigned crew when edit is clicked', async () => {
    //     renderCrews()
    //     await screen.findByText("Not Assigned");
    //     const editButtons = screen.getAllByTestId("test-editButton");
    //     await userEvent.click(editButtons[0]);
    //     expect(screen.getByText(/Not Assigned Crew/i)).toBeInTheDocument();
    // });

    // it('renders Add crew member button when edit is clicked', async () => {
    //     renderCrews()
    //     await screen.findByText("Not Assigned");
    //     const editButtons = screen.getAllByTestId("test-editButton");
    //     await userEvent.click(editButtons[0]);
    //     expect(screen.getByText(/add crew member/i)).toBeInTheDocument();
    // });

});
