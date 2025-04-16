import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Setting from '../Components/Setting/Setting.jsx';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true }),
      });
    vi.spyOn(window, 'alert').mockImplementation(() => {})
})

afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks()
})

describe('Testing Setting component ("/setting" route)', () => {
    const renderSetting = () => {
        render(
            <MemoryRouter initialEntries={['/setting']}>
                <Setting />
            </MemoryRouter>
        );
    };

    it('renders "change password" button', () => {
        renderSetting()
        expect(screen.getByText('Change Password')).toBeInTheDocument()
    })

    it('clicking the "change password" button does something', async () => {
        global.localStorage.setItem('userId', 1);
        // Mock the fetch function
        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ success: true }), // Simulate a successful response
            })
        );
        renderSetting()
        expect(screen.getByText('Change Password')).toBeInTheDocument()
        const button = screen.getByText('Change Password')
        userEvent.click(button)
        const confirm = await screen.findByText('Confirm')
        expect(confirm).toBeInTheDocument()
        const pass_input = await screen.findByTestId('test-passInput')
        const pass_input2 = await screen.findByTestId('test-passInput2')
        expect(pass_input).toBeInTheDocument()
        expect(pass_input2).toBeInTheDocument()

        await userEvent.type(pass_input, 'password')
        await userEvent.type(pass_input2, 'password')

        userEvent.click(confirm)
        await waitFor(() => {
            expect(fetch).toHaveBeenCalled()
        });
    })

});
