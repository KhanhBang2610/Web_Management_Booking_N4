// Hàm xử lý định dạng ngày tháng check-in/out.

/**
 * Format ngày thành chuỗi theo định dạng DD/MM/YYYY
 * @param {Date|string} date - Ngày cần định dạng
 * @returns {string} - Ngày theo định dạng DD/MM/YYYY
 */
const formatDateDMY = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Format ngày thành chuỗi theo định dạng YYYY-MM-DD (cho database)
 * @param {Date|string} date - Ngày cần định dạng
 * @returns {string} - Ngày theo định dạng YYYY-MM-DD
 */
const formatDateYMD = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Format ngày và giờ theo định dạng DD/MM/YYYY HH:mm
 * @param {Date|string} date - Ngày cần định dạng
 * @returns {string} - Ngày giờ theo định dạng DD/MM/YYYY HH:mm
 */
const formatDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Parse chuỗi ngày từ input (DD/MM/YYYY) thành Date object
 * @param {string} dateString - Chuỗi ngày theo format DD/MM/YYYY
 * @returns {Date} - Date object
 */
const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
};

/**
 * Tính số ngày giữa hai mốc thời gian
 * @param {Date|string} checkIn - Ngày check-in
 * @param {Date|string} checkOut - Ngày check-out
 * @returns {number} - Số đêm lưu trú
 */
const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Kiểm tra ngày check-out có hợp lệ (lớn hơn check-in)
 * @param {Date|string} checkIn - Ngày check-in
 * @param {Date|string} checkOut - Ngày check-out
 * @returns {boolean} - true nếu hợp lệ, false nếu không
 */
const isValidCheckOutDate = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return end > start;
};

/**
 * Format ngày thành chuỗi tiếng Việt đầy đủ (ví dụ: "21 tháng 5, 2026")
 * @param {Date|string} date - Ngày cần định dạng
 * @returns {string} - Ngày theo định dạng tiếng Việt
 */
const formatDateVN = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const months = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 
                    'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
    
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const dayName = days[d.getDay()];
    
    return `${dayName}, ${day} ${month} ${year}`;
};

/**
 * Format khoảng thời gian (check-in đến check-out) cho hiển thị
 * @param {Date|string} checkIn - Ngày check-in
 * @param {Date|string} checkOut - Ngày check-out
 * @returns {string} - Chuỗi khoảng thời gian (ví dụ: "21/05 - 23/05/2026")
 */
const formatDateRange = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '';
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    
    const startDay = String(startDate.getDate()).padStart(2, '0');
    const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
    const endDay = String(endDate.getDate()).padStart(2, '0');
    const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
    const year = endDate.getFullYear();
    
    return `${startDay}/${startMonth} - ${endDay}/${endMonth}/${year}`;
};

module.exports = {
    formatDateDMY,
    formatDateYMD,
    formatDateTime,
    parseDate,
    calculateNights,
    isValidCheckOutDate,
    formatDateVN,
    formatDateRange
};