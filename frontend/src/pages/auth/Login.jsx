import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import authService from '../../services/uth.service';
import AuthContext from '../../store/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login(credentials.email, credentials.password);

      if (response.success && response.token) {
        login(response.token, response.user);
        navigate('/');
      } else {
        setError(response.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError(err.message || 'Không thể đăng nhập. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Đăng nhập</h1>
        <p>Đăng nhập để tiếp tục quản lý đặt phòng và thông tin cá nhân.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Nhập email"
            required
          />
          <label>Mật khẩu</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Nhập mật khẩu"
            required
            minLength={6}
          />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="auth-switch">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
