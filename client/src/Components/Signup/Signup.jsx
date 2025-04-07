// Signup incomplete, need to match with backend... 
// Fetch needs to be updated to match the api
// return information needs better user interface.. update the css
// Code written by Harman
 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://localhost:8081/signup', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(() =>
        alert('you are all signed up'),
        navigate('/login'))
      .catch(err => setError('Signup failed'));
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="last_name"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
