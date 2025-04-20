import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Your existing login API call
      const response = await fetch('your-api-endpoint/login', {
        // ... your fetch configuration
      });
      const data = await response.json();
      
      if (response.ok) {
        // Use the login function from context
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle error appropriately
    }
  };

  // ... rest of your login component code
}

export default Login; 