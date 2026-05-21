// Hook tự viết để gọi dữ liệu và quản lý loading/error state.

import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Custom Hook: useFetch
 * Giúp gọi API một cách dễ dàng với quản lý loading, error, và data
 * 
 * @param {string} url - API endpoint
 * @param {Array} dependencies - Dependencies array để re-fetch
 * @param {Object} options - Các tùy chọn bổ sung (method, headers, params, etc)
 * @returns {Object} - { data, loading, error, refetch }
 */
const useFetch = (url, dependencies = [], options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const config = {
                method: options.method || 'GET',
                ...options
            };

            const response = await api.request({
                url: url,
                ...config
            });

            setData(response.data.data || response.data);
            setError(null);
        } catch (err) {
            console.error('Lỗi useFetch:', err);
            setError(
                err.response?.data?.message || 
                err.message || 
                'Lỗi khi tải dữ liệu'
            );
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi component mount hoặc dependencies thay đổi
    useEffect(() => {
        if (url) {
            fetchData();
        }
    }, dependencies);

    /**
     * Refetch data manually
     */
    const refetch = () => {
        fetchData();
    };

    return {
        data,
        loading,
        error,
        refetch
    };
};

export default useFetch;