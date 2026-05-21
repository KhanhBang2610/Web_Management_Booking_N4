// Lưu trữ tạm thời ngày đi/về, địa điểm đang tìm kiếm.

import React, { createContext, useState } from 'react';

const SearchContext = createContext();

/**
 * SearchProvider Component
 * Cung cấp thông tin tìm kiếm cho toàn bộ ứng dụng
 * Giúp lưu trữ tạm thời dữ liệu tìm kiếm khi người dùng chuyển qua lại các trang
 */
export const SearchProvider = ({ children }) => {
    const [searchData, setSearchData] = useState({
        location: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        roomType: 'all',
        priceMin: 0,
        priceMax: 10000000
    });

    const [searchHistory, setSearchHistory] = useState([]);
    const [recentSearches, setRecentSearches] = useState(() => {
        // Lấy lịch sử tìm kiếm từ localStorage
        const stored = localStorage.getItem('recentSearches');
        return stored ? JSON.parse(stored) : [];
    });

    /**
     * Update search data
     * @param {Object} newData - New search data to merge
     */
    const updateSearchData = (newData) => {
        setSearchData(prev => ({
            ...prev,
            ...newData
        }));
    };

    /**
     * Save search to recent searches
     * @param {Object} searchParams - Search parameters to save
     */
    const saveSearch = (searchParams) => {
        const newSearch = {
            id: Date.now(),
            ...searchParams,
            timestamp: new Date().toISOString()
        };

        // Thêm vào đầu danh sách
        const updated = [newSearch, ...recentSearches].slice(0, 10); // Lưu tối đa 10 tìm kiếm gần đây
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    /**
     * Clear recent searches
     */
    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    /**
     * Reset search data to initial state
     */
    const resetSearchData = () => {
        setSearchData({
            location: '',
            checkIn: '',
            checkOut: '',
            guests: 1,
            roomType: 'all',
            priceMin: 0,
            priceMax: 10000000
        });
    };

    /**
     * Remove specific search from history
     * @param {number} searchId - Search ID to remove
     */
    const removeFromHistory = (searchId) => {
        const updated = recentSearches.filter(search => search.id !== searchId);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    /**
     * Get search by ID from history
     * @param {number} searchId - Search ID to retrieve
     * @returns {Object|null}
     */
    const getSearchById = (searchId) => {
        return recentSearches.find(search => search.id === searchId) || null;
    };

    const value = {
        searchData,
        updateSearchData,
        resetSearchData,
        recentSearches,
        saveSearch,
        clearRecentSearches,
        removeFromHistory,
        getSearchById
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchContext;