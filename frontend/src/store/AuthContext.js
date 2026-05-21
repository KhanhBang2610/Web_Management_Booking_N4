// Lưu trạng thái user đang đăng nhập.

import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * AuthProvider Component
 * Cung cấp thông tin user authentication cho toàn bộ ứng dụng
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Khởi tạo: Kiểm tra localStorage để restore session
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(userData);
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Lỗi khi parse stored user:', err);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }

        setLoading(false);
    }, []);

    /**
     * Login function
     * @param {string} token - JWT token
     * @param {Object} userData - User information
     */
    const login = (token, userData) => {
        setToken(token);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Lưu vào localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    /**
     * Logout function
     */
    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        
        // Xóa localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    /**
     * Update user profile
     * @param {Object} updatedData - Updated user data
     */
    const updateUser = (updatedData) => {
        const newUserData = { ...user, ...updatedData };
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
    };

    /**
     * Check if user has specific role
     * @param {string} role - Role to check
     * @returns {boolean}
     */
    const hasRole = (role) => {
        return user?.role === role;
    };

    /**
     * Check if user has any of multiple roles
     * @param {Array<string>} roles - Roles to check
     * @returns {boolean}
     */
    const hasAnyRole = (roles) => {
        return user && roles.includes(user.role);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        hasRole,
        hasAnyRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;