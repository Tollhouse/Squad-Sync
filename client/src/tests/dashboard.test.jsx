import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Dashboard from '../Components/Dashboard/Dashboard.jsx';
import { waitFor } from '@testing-library/react';

// creating a "mockNavigate" function that can be used as a spy for testing
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      // mocking the useNavigate function from react-router-dom do that it instead calls
      // our mockNavigate function that we want to use as a spy
      useNavigate: () => mockNavigate,
    }
  })

beforeEach(() => {
  localStorage.clear();
  mockNavigate.mockClear()
});

describe('Testing Dashboard component ("/dashboard" route)', () => {
    const renderDashboard = () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Dashboard />
            </MemoryRouter>
        );
    };

    it('calles /commander route if userPrivilege is commander', async () => {
        localStorage.setItem('userId', 2)
        // mocking the fetch so the useEffect in dashboard gets a value returned to it.
        global.fetch = vi.fn(() =>
            Promise.resolve({
              json: () =>
                Promise.resolve({
                  privilege: 'commander',
                }),
            })
          );
        renderDashboard()
        await waitFor(() => {
            // expects mockNavigate to have been called with the same arguments as in the dashboard component
            expect(mockNavigate).toHaveBeenCalledWith('/commander', {
                state: { user: { privilege: 'commander' } },
            });
        });
    });

    it('calles /scheduler route if userPrivilege is scheduler', async () => {
        localStorage.setItem('userId', 1)
        // mocking the fetch so the useEffect in dashboard gets a value returned to it.
        global.fetch = vi.fn(() =>
            Promise.resolve({
              json: () =>
                Promise.resolve({
                  privilege: 'scheduler',
                }),
            })
          );
        renderDashboard()
        await waitFor(() => {
            // expects mockNavigate to have been called with the same arguments as in the dashboard component
            expect(mockNavigate).toHaveBeenCalledWith('/scheduler', {
                state: { user: { privilege: 'scheduler' } },
            });
        });
    });

    it('calles /training-manager route if userPrivilege is training_manager', async () => {
        localStorage.setItem('userId', 3)
        // mocking the fetch so the useEffect in dashboard gets a value returned to it.
        global.fetch = vi.fn(() =>
            Promise.resolve({
              json: () =>
                Promise.resolve({
                  privilege: 'training_manager',
                }),
            })
          );
        renderDashboard()
        await waitFor(() => {
            // expects mockNavigate to have been called with the same arguments as in the dashboard component
            expect(mockNavigate).toHaveBeenCalledWith('/training-manager', {
                state: { user: { privilege: 'training_manager' } },
            });
        });
    });

    it('calles /not-authorized route if userPrivilege is not matched', async () => {
        localStorage.setItem('userId', -1)
        // mocking the fetch so the useEffect in dashboard gets a value returned to it.
        global.fetch = vi.fn(() =>
            Promise.resolve({
              json: () =>
                Promise.resolve({
                  privilege: 'no-privilege',
                }),
            })
          );
        renderDashboard()
        await waitFor(() => {
            // expects mockNavigate to have been called with the same arguments as in the dashboard component
            expect(mockNavigate).toHaveBeenCalledWith('/not-authorized');
        });
    });

});
