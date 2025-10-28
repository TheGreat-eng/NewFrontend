// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { MailOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authService';
import { setAuthData, isAuthenticated, clearAuthData } from '../utils/auth';

const { Title, Text, Paragraph } = Typography;

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        clearAuthData();
        if (isAuthenticated()) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await login(values.email, values.password);
            const { accessToken, refreshToken, ...userData } = response.data;
            const authToken = accessToken || response.data.token;

            if (!authToken) throw new Error('Không nhận được token từ server');

            clearAuthData();

            const userInfo = {
                userId: userData.userId,
                username: userData.email.split('@')[0],
                email: userData.email,
                fullName: userData.fullName,
                phone: userData.phone || null,
                roles: [userData.role],
            };

            setAuthData(authToken, userInfo);

            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

            message.success('Đăng nhập thành công! Đang chuyển hướng...');

            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 500);

        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Email hoặc mật khẩu không chính xác.';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-showcase">
                <Title level={1} style={{ color: 'white', fontWeight: 800, marginBottom: '1rem' }}>
                    Nền tảng IoT cho Nông nghiệp Thông minh
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '500px' }}>
                    Giám sát, điều khiển và tối ưu hóa trang trại của bạn từ bất cứ đâu với dữ liệu thời gian thực và phân tích từ AI.
                </Paragraph>
            </div>
            <div className="login-form-wrapper">
                <div className="login-form">
                    <Title level={2} style={{ marginBottom: 8 }}>Chào mừng trở lại!</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                        Vui lòng nhập thông tin để truy cập hệ thống.
                    </Text>

                    <Form name="login" onFinish={onFinish} autoComplete="off" size="large" layout="vertical">
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="your-email@example.com" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                        </Form.Item>

                        <Form.Item style={{ marginTop: 24 }}>
                            <Button type="primary" htmlType="submit" loading={loading} block icon={<RocketOutlined />}>
                                Đăng nhập
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center' }}>
                            <Text type="secondary">
                                Chưa có tài khoản? <a onClick={() => navigate('/register')}>Đăng ký ngay</a>
                            </Text>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;