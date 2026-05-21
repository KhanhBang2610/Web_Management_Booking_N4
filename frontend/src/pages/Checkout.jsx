// Nhập thông tin thanh toán, xác nhận đơn.

import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css'; // Thêm file CSS để style
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AuthContext from '../store/AuthContext';
import api from '../services/api';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Lấy thông tin booking từ location state
    const bookingData = location.state || {};

    // State cho form thông tin khách
    const [guestInfo, setGuestInfo] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '',
        specialRequests: ''
    });

    // State cho thanh toán
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });

    // State cho UI
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderSummary, setOrderSummary] = useState(null);

    // Tính toán order summary
    useEffect(() => {
        const summary = {
            propertyName: bookingData.propertyName || 'N/A',
            roomType: bookingData.roomType || 'N/A',
            checkIn: bookingData.checkIn || '',
            checkOut: bookingData.checkOut || '',
            nights: bookingData.nights || 0,
            roomPrice: bookingData.roomPrice || 0,
            quantity: bookingData.quantity || 1,
            subtotal: bookingData.totalPrice || 0,
            tax: Math.round((bookingData.totalPrice || 0) * 0.1), // Thuế 10%
            serviceFee: 50000, // Phí dịch vụ cố định
            total: (bookingData.totalPrice || 0) + Math.round((bookingData.totalPrice || 0) * 0.1) + 50000
        };
        setOrderSummary(summary);
    }, [bookingData]);

    // Xử lý thay đổi thông tin khách
    const handleGuestInfoChange = (field, value) => {
        setGuestInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Xử lý thay đổi thông tin thẻ
    const handleCardInfoChange = (field, value) => {
        let formattedValue = value;

        // Format card number (thêm khoảng cách mỗi 4 chữ số)
        if (field === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
        }

        // Format expiry date (MM/YY)
        if (field === 'expiryDate') {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length >= 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
            }
        }

        // Chỉ cho phép số cho CVV
        if (field === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 3);
        }

        setCardInfo(prev => ({
            ...prev,
            [field]: formattedValue
        }));
    };

    // Validate thông tin form
    const validateForm = () => {
        if (!guestInfo.fullName.trim()) {
            setError('Vui lòng nhập họ tên');
            return false;
        }
        if (!guestInfo.email.trim()) {
            setError('Vui lòng nhập email');
            return false;
        }
        if (!guestInfo.phone.trim()) {
            setError('Vui lòng nhập số điện thoại');
            return false;
        }

        if (paymentMethod === 'credit_card') {
            if (!cardInfo.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
                setError('Số thẻ không hợp lệ (phải có 16 chữ số)');
                return false;
            }
            if (!cardInfo.cardHolder.trim()) {
                setError('Vui lòng nhập tên chủ thẻ');
                return false;
            }
            if (!cardInfo.expiryDate.match(/^\d{2}\/\d{2}$/)) {
                setError('Ngày hết hạn không hợp lệ (MM/YY)');
                return false;
            }
            if (!cardInfo.cvv.match(/^\d{3}$/)) {
                setError('CVV không hợp lệ (phải có 3 chữ số)');
                return false;
            }
        }

        if (!termsAccepted) {
            setError('Vui lòng chấp nhận điều khoản dịch vụ');
            return false;
        }

        return true;
    };

    // Xử lý thanh toán
    const handlePayment = async () => {
        setError(null);

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Chuẩn bị dữ liệu booking
            const bookingPayload = {
                propertyId: bookingData.propertyId,
                roomType: bookingData.roomType,
                checkInDate: bookingData.checkIn,
                checkOutDate: bookingData.checkOut,
                quantity: bookingData.quantity,
                totalPrice: orderSummary.total,
                guestName: guestInfo.fullName,
                guestEmail: guestInfo.email,
                guestPhone: guestInfo.phone,
                specialRequests: guestInfo.specialRequests,
                paymentMethod: paymentMethod,
                status: 'Pending'
            };

            // Gọi API tạo booking
            const response = await api.post('/bookings/create', bookingPayload);

            if (response.data.success || response.status === 201) {
                // Booking thành công
                navigate('/booking-confirmation', {
                    state: {
                        bookingId: response.data.data?.id,
                        orderId: response.data.data?.orderId,
                        bookingData: bookingPayload,
                        orderSummary: orderSummary
                    }
                });
            }
        } catch (err) {
            console.error('Lỗi thanh toán:', err);
            setError(err.response?.data?.message || 'Lỗi thanh toán. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    if (!bookingData.propertyName) {
        return (
            <>
                <Navbar />
                <div className="error-page">
                    <p>Không có thông tin đơn đặt phòng. Vui lòng quay lại trang trước.</p>
                    <button onClick={() => navigate('/')} className="btn-back">
                        Quay lại trang chủ
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="checkout-container">
                <h1>Xác nhận đơn đặt phòng</h1>

                <div className="checkout-content">
                    {/* Bên trái: Form thanh toán */}
                    <main className="checkout-form">
                        {/* Thông tin khách */}
                        <section className="form-section">
                            <h2>Thông tin khách hàng</h2>
                            <div className="form-group">
                                <label>Họ và tên *</label>
                                <input 
                                    type="text"
                                    value={guestInfo.fullName}
                                    onChange={(e) => handleGuestInfoChange('fullName', e.target.value)}
                                    placeholder="Nhập họ tên đầy đủ"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input 
                                        type="email"
                                        value={guestInfo.email}
                                        onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                                        placeholder="Nhập email"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số điện thoại *</label>
                                    <input 
                                        type="tel"
                                        value={guestInfo.phone}
                                        onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Yêu cầu đặc biệt (tuỳ chọn)</label>
                                <textarea 
                                    value={guestInfo.specialRequests}
                                    onChange={(e) => handleGuestInfoChange('specialRequests', e.target.value)}
                                    placeholder="Ví dụ: cần phòng tầng cao, gần cửa sổ..."
                                    className="form-textarea"
                                    rows="3"
                                />
                            </div>
                        </section>

                        {/* Phương thức thanh toán */}
                        <section className="form-section">
                            <h2>Phương thức thanh toán</h2>
                            
                            <div className="payment-methods">
                                <label className="payment-option">
                                    <input 
                                        type="radio"
                                        name="paymentMethod"
                                        value="credit_card"
                                        checked={paymentMethod === 'credit_card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>💳 Thẻ tín dụng / Thẻ ghi nợ</span>
                                </label>

                                <label className="payment-option">
                                    <input 
                                        type="radio"
                                        name="paymentMethod"
                                        value="bank_transfer"
                                        checked={paymentMethod === 'bank_transfer'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>🏦 Chuyển khoản ngân hàng</span>
                                </label>

                                <label className="payment-option">
                                    <input 
                                        type="radio"
                                        name="paymentMethod"
                                        value="e_wallet"
                                        checked={paymentMethod === 'e_wallet'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>📱 Ví điện tử (Momo, ZaloPay)</span>
                                </label>

                                <label className="payment-option">
                                    <input 
                                        type="radio"
                                        name="paymentMethod"
                                        value="pay_later"
                                        checked={paymentMethod === 'pay_later'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>⏰ Thanh toán khi nhận phòng</span>
                                </label>
                            </div>

                            {/* Thông tin thẻ tín dụng */}
                            {paymentMethod === 'credit_card' && (
                                <div className="card-info-form">
                                    <div className="form-group">
                                        <label>Số thẻ *</label>
                                        <input 
                                            type="text"
                                            value={cardInfo.cardNumber}
                                            onChange={(e) => handleCardInfoChange('cardNumber', e.target.value)}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Tên chủ thẻ *</label>
                                        <input 
                                            type="text"
                                            value={cardInfo.cardHolder}
                                            onChange={(e) => handleCardInfoChange('cardHolder', e.target.value)}
                                            placeholder="NGUYEN VAN A"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Ngày hết hạn (MM/YY) *</label>
                                            <input 
                                                type="text"
                                                value={cardInfo.expiryDate}
                                                onChange={(e) => handleCardInfoChange('expiryDate', e.target.value)}
                                                placeholder="12/25"
                                                maxLength="5"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV *</label>
                                            <input 
                                                type="text"
                                                value={cardInfo.cvv}
                                                onChange={(e) => handleCardInfoChange('cvv', e.target.value)}
                                                placeholder="123"
                                                maxLength="3"
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Điều khoản */}
                        <section className="form-section">
                            <label className="terms-checkbox">
                                <input 
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                />
                                <span>Tôi đồng ý với <a href="#terms">Điều khoản dịch vụ</a> và <a href="#privacy">Chính sách bảo mật</a></span>
                            </label>
                        </section>

                        {/* Thông báo lỗi */}
                        {error && (
                            <div className="error-message">
                                <p>❌ {error}</p>
                            </div>
                        )}

                        {/* Nút thanh toán */}
                        <button 
                            className="btn-payment"
                            onClick={handlePayment}
                            disabled={loading || !termsAccepted}
                        >
                            {loading ? 'Đang xử lý...' : `Thanh toán ${orderSummary?.total.toLocaleString()} VNĐ`}
                        </button>
                    </main>

                    {/* Bên phải: Tóm tắt đơn */}
                    <aside className="order-summary">
                        <h2>Tóm tắt đơn hàng</h2>

                        <div className="summary-section">
                            <h3>Chi tiết phòng</h3>
                            <div className="summary-item">
                                <span>Khách sạn:</span>
                                <strong>{orderSummary?.propertyName}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Loại phòng:</span>
                                <strong>{orderSummary?.roomType}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Nhận phòng:</span>
                                <strong>{orderSummary?.checkIn}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Trả phòng:</span>
                                <strong>{orderSummary?.checkOut}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Số đêm:</span>
                                <strong>{orderSummary?.nights}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Số phòng:</span>
                                <strong>{orderSummary?.quantity}</strong>
                            </div>
                        </div>

                        <div className="summary-section pricing">
                            <h3>Chi phí</h3>
                            <div className="summary-item">
                                <span>Giá phòng ({orderSummary?.nights} đêm × {orderSummary?.quantity} phòng):</span>
                                <strong>{orderSummary?.subtotal.toLocaleString()} VNĐ</strong>
                            </div>
                            <div className="summary-item">
                                <span>Thuế (10%):</span>
                                <strong>{orderSummary?.tax.toLocaleString()} VNĐ</strong>
                            </div>
                            <div className="summary-item">
                                <span>Phí dịch vụ:</span>
                                <strong>{orderSummary?.serviceFee.toLocaleString()} VNĐ</strong>
                            </div>
                            <div className="summary-item total">
                                <span>Tổng cộng:</span>
                                <strong className="total-price">{orderSummary?.total.toLocaleString()} VNĐ</strong>
                            </div>
                        </div>

                        <div className="summary-section info">
                            <p>ℹ️ Bạn sẽ nhận xác nhận qua email trong vòng 5 phút</p>
                            <p>ℹ️ Hủy miễn phí trước 48 giờ nhận phòng</p>
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;