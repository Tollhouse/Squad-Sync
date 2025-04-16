import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import About from '../Components/About/About.jsx';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  localStorage.clear();
});

describe('Testing About component ("/about" route)', () => {
    const renderAbout = () => {
        render(
            <MemoryRouter initialEntries={['/about']}>
                <About />
            </MemoryRouter>
        );
    };

    it('should render "our mission" text box"', () => {
        renderAbout()
        expect(screen.getByText(/Our Mission/)).toBeInTheDocument()
        expect(screen.getByText(/Enable combat mission effectiveness through/)).toBeInTheDocument()
    })

    it('should render "our vision" text box"', () => {
        renderAbout()
        expect(screen.getByText(/Our Vision/)).toBeInTheDocument()
        expect(screen.getByText(/To provide a one stop, scalable solution that/)).toBeInTheDocument()
    })

    it('should render "Role Based Actions" text box"', () => {
        renderAbout()
        expect(screen.getByText(/Role Based Actions/)).toBeInTheDocument()
        expect(screen.getByText(/This application breaks down users into various roles based on personnel assignment within the squadron./)).toBeInTheDocument()
        expect(screen.getAllByText(/Commander/)).toHaveLength(2)
        expect(screen.getAllByText(/Scheduler/)).toHaveLength(3)
        expect(screen.getAllByText(/Training Manager/)).toHaveLength(2)
        expect(screen.getAllByText(/User/)).toHaveLength(2)
    })

    it('should render "Contact Us" text box"', () => {
        renderAbout()
        expect(screen.getByText(/Contact Us/)).toBeInTheDocument()
        expect(screen.getByText(/Feedback/)).toBeInTheDocument()
    })
});
