import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {ConfirmSaveModal, ConfirmDeleteModal} from '../Components/AddOns/ConfirmModal.jsx';

beforeEach(() => {
  localStorage.clear();
});

describe('Testing ConfirmSaveModal component ', () => {
    const renderConfirmSave = () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ConfirmSaveModal open={true} onClose={() => {}} onConfirm={() => {}}/>
            </MemoryRouter>
        );
    };

    it('renders "Yes, Save" text', () => {
        renderConfirmSave()
        expect(screen.getByText("Yes, Save")).toBeInTheDocument()
    });

    it('renders default "message" text', () => {
        renderConfirmSave()
        expect(screen.getByText("Are you sure you want to save your changes?")).toBeInTheDocument()
    });

    it('renders custom "message" text', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ConfirmSaveModal open={true}
                                    onClose={() => {}}
                                    onConfirm={() => {}}
                                    message={'Test Message'}/>
            </MemoryRouter>
        );
        expect(screen.getByText("Test Message")).toBeInTheDocument()
    })

    it('renders "Cancel" button', () => {
        renderConfirmSave()
        expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('renders "Yes, Save" button', () => {
        renderConfirmSave()
        expect(screen.getByText('Yes, Save')).toBeInTheDocument()
    })

});

describe('Testing ConfirmDeleteModal component ', () => {
    const renderConfirmDelete = () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ConfirmDeleteModal open={true} onClose={() => {}} onConfirm={() => {}}/>
            </MemoryRouter>
        );
    };

    it('renders "Yes, Delete" text', () => {
        renderConfirmDelete()
        expect(screen.getByText("Yes, Delete")).toBeInTheDocument()
    });

    it('renders default "message" text', () => {
        renderConfirmDelete()
        expect(screen.getByText("Are you sure you want to delete this item? This action cannot be undone.")).toBeInTheDocument()
    });

    it('renders custom "message" text', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ConfirmDeleteModal open={true}
                                    onClose={() => {}}
                                    onConfirm={() => {}}
                                    message={'Test Message'}/>
            </MemoryRouter>
        );
        expect(screen.getByText("Test Message")).toBeInTheDocument()
    })

    it('renders "Cancel" button', () => {
        renderConfirmDelete()
        expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('renders "Yes, Delete" button', () => {
        renderConfirmDelete()
        expect(screen.getByText('Yes, Delete')).toBeInTheDocument()
    })

});
