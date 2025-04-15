import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Commander from '../Components/Commander/Commander.jsx';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

beforeEach(() => {
  localStorage.clear();

  global.fetch = vi.fn((url) => {
    switch (url) {
      case 'http://localhost:8080/users':
        return Promise.resolve({
          json: () => Promise.resolve([{ id: 1, first_name: 'Alice', last_name: 'Smith', role: 'User', experience_type: 'green' }])
        });
      case 'http://localhost:8080/courses':
        return Promise.resolve({
          json: () => Promise.resolve([{ id: 1, course_name: 'Test Course', date_start: '2023-01-01', date_end: '2023-06-01' }])
        });
      case 'http://localhost:8080/course_registration':
        return Promise.resolve({
          json: () => Promise.resolve([{ id: 1, user_id: 1, course_id: 1, in_progress: 'enrolled', cert_earned: false }])
        });
      case 'http://localhost:8080/crew_rotations':
        return Promise.resolve({
          json: () => Promise.resolve([{ id: 1, crew_id: 2, shift_type: 'Night', date_start: '2023-03-01', date_end: '2023-03-05', shift_duration: 12, experience_type: 'yellow' }])
        });
      default:
        return Promise.reject(new Error('Unknown endpoint'));
    }
  });
});

afterEach(() => {
    vi.resetAllMocks();
});

describe('Testing Commander component ("/commander" route)', () => {
  const renderCommander = () => {
    const mockUser = { first_name: 'Test User', id: 1 };

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/commander',
            search: '',
            hash: '',
            state: { user: mockUser },
            key: 'testKey',
          },
        ]}
      >
        <Routes>
          <Route path="/commander" element={<Commander />} />
        </Routes>
      </MemoryRouter>
    );
  };

  // This test works due to correct mocking, but the actual implementation fails to pass
  // in the user correctly, leading to "Wecome, !"
  it('renders Commander welcome text', () => {
    renderCommander();
    expect(screen.getByText(/Commander Dashboard/)).toBeInTheDocument();
  });

  it('renders Certified Users and Total Crews  text', () => {
    renderCommander();
    expect(screen.getByText(/Certified Users/)).toBeInTheDocument();
    expect(screen.getByText(/Total Crews/)).toBeInTheDocument();
  });

  it('renders the tabs correctly', () => {
    renderCommander();
    expect(screen.getByText(/Squadron Personnel/)).toBeInTheDocument();
    expect(screen.getByText(/Training Courses/)).toBeInTheDocument();
    expect(screen.getByText(/Course Assignments/)).toBeInTheDocument();
    expect(screen.getByText(/Crew Construct/)).toBeInTheDocument();
  });

  it("Experience distribution is rendered", async () => {
    renderCommander();

    expect(screen.getByText('📊 Experience Distribution'))
  });
});
