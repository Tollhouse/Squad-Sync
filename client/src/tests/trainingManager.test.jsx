import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TrainingManager from '../Components/TrainingManager/TrainingManager.jsx';
import userEvent from '@testing-library/user-event';

describe('Testing TrainingManager component ("/training-manager" route)', () => {
    const renderTrainingManager = () => {
        render(
            <MemoryRouter initialEntries={['/training-manager']}>
                <TrainingManager />
            </MemoryRouter>
        );
    };

    it('renders "Course Management" text', () => {
        renderTrainingManager()
        expect(screen.getByText('Course Management')).toBeInTheDocument()
    })

    it('renders "Add Course" button', () => {
        renderTrainingManager()
        expect(screen.getByText('Add Course')).toBeInTheDocument()
    })

    it('renders table headers', () => {
        renderTrainingManager()
        expect(screen.getByText('ID')).toBeInTheDocument()
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('Start Date')).toBeInTheDocument()
        expect(screen.getByText('End Date')).toBeInTheDocument()
        expect(screen.getByText('Description')).toBeInTheDocument()
        expect(screen.getByText('Seats Offered')).toBeInTheDocument()
        expect(screen.getByText('Cert Granted')).toBeInTheDocument()
        expect(screen.getByText('Edit')).toBeInTheDocument()
    })

    it('renders data from backend', async () => {
        renderTrainingManager()
        const desc_text = await screen.findAllByText("Training teaches how to supervise and how to oversee all crew requirements.")
        expect(desc_text.length > 0).toBe(true)
    })

    it('renders edit button', async () => {
        renderTrainingManager()
        const edit_button = await screen.findAllByTestId("test-editButton")
        expect(edit_button.length > 0).toBe(true)
    })

    it('renders delete button', async () => {
        renderTrainingManager()
        const delete_button = await screen.findAllByTestId("test-deleteButton")
        expect(delete_button.length > 0).toBe(true)
    })

    it('renders save and cancel button when edit is clicked', async () => {
        renderTrainingManager()
        const edit_button = await screen.findAllByTestId("test-editButton")
        expect(edit_button.length > 0).toBe(true)
        userEvent.click(edit_button[0])
        const save_button = await screen.findByTestId('test-saveButton')
        const cancel_button = await screen.findByTestId('test-cancelButton')
        expect(save_button).toBeInTheDocument()
        expect(cancel_button).toBeInTheDocument()
    })

});
