import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Courses from '../Components/Courses/Courses.jsx';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  localStorage.clear();
});

describe('Testing Courses component ("/courses" route)', () => {
    const renderCourses = () => {
        render(
            <MemoryRouter initialEntries={['/courses']}>
                <Courses />
            </MemoryRouter>
        );
    };

    it('renders "Courses" text', async () => {
        renderCourses()
        await waitFor(() => {
            const courses_text = screen.getByText(/Courses/i);
            expect(courses_text).toBeInTheDocument();
        });
    });

    it('renders the fetched courses from the backend', async () => {
        renderCourses()
        await waitFor(() => {
            expect(screen.getByText(/id/i)).toBeInTheDocument();
            expect(screen.getByText(/name/i)).toBeInTheDocument();
            expect(screen.getByText(/Start Date/i)).toBeInTheDocument();
            expect(screen.getByText(/End Date/i)).toBeInTheDocument();
            expect(screen.getByText(/Cert Granted/i)).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getAllByText(/Systems Engineer/i)).toHaveLength(4);
            expect(screen.getByText(/2025-06-01/i)).toBeInTheDocument();
            expect(screen.getByText(/2025-12-01/i)).toBeInTheDocument();
        });
    })

    it('provides additional information when course is clicked', async () => {
        renderCourses()
        await waitFor(() => {
            expect(screen.getByText(/id/i)).toBeInTheDocument();
            expect(screen.getByText(/name/i)).toBeInTheDocument();
            expect(screen.getByText(/Start Date/i)).toBeInTheDocument();
            expect(screen.getByText(/End Date/i)).toBeInTheDocument();
            expect(screen.getByText(/Cert Granted/i)).toBeInTheDocument();
        });
        await waitFor(async () => {
            expect(await screen.findAllByText(/Systems Engineer/i)).toHaveLength(4);
            expect(screen.getByText(/2025-02-01/i)).toBeInTheDocument();
            expect(screen.getByText(/2025-02-28/i)).toBeInTheDocument();
        });
        const courseButton = screen.getAllByTestId('test-courseRow')
        await userEvent.click(courseButton[0])
        expect(screen.getByText(/Registered Personnel/i)).toBeInTheDocument()
        await waitFor(() => {
            expect(screen.getByText(/Registered Personnel/i)).toBeInTheDocument();
        });
    })

});
