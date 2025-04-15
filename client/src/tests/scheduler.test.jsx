import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Scheduler from '../Components/Scheduler/Scheduler.jsx';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  localStorage.clear();
});

describe('Testing Scheduler component ("/scheduler" route)', () => {
    const renderScheduler = () => {
        render(
            <MemoryRouter initialEntries={['/scheduler']}>
                <Scheduler />
            </MemoryRouter>
        );
    };

    it('renders "Scheduler Dashboard" text', async () => {
        renderScheduler()
        await waitFor(() => {
            const scheduler_text = screen.getByText(/Scheduler Dashboard/i);
            expect(scheduler_text).toBeInTheDocument();
        });
    });

    it('renders "tab labels"', async () => {
        renderScheduler()
        await waitFor(() => {
            const scheduler_text = screen.getByText(/Scheduler Dashboard/i);
            expect(scheduler_text).toBeInTheDocument();
        });
        const tab1 = screen.getAllByText(/Available for Course/i);
        expect(tab1.length).toBeGreaterThan(0)
        const tab2 = screen.getAllByText(/Soon to be Certified/i);
        expect(tab2.length).toBeGreaterThan(0)
        const tab3 = screen.getAllByText(/Certified Members & Their Certifications/i);
        expect(tab3.length).toBeGreaterThan(0)
    })

});
