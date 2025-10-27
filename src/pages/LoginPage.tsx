// src/pages/LoginPage.tsx

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authService';
import { setAuthData, isAuthenticated, clearAuthData } from '../utils/auth';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        clearAuthData();
        if (isAuthenticated()) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    const onFinish = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            const response = await login(values.username, values.password);
            console.log('🔍 Full response:', response.data);

            const {
                token,
                accessToken,
                refreshToken,
                userId,
                email,
                fullName,
                role,
                phone
            } = response.data;

            const authToken = accessToken || token;

            if (!authToken) {
                throw new Error('Không nhận được token từ server');
            }

            clearAuthData();
            console.log('🧹 Cleared old auth data');

            // ✅ Chuẩn hóa user object - ĐẢM BẢO userId là số
            const userInfo = {
                userId: typeof userId === 'number' ? userId : parseInt(userId, 10),
                username: email.split('@')[0],
                email: email,
                fullName: fullName,
                phone: phone || null,
                roles: [role],
            };

            console.log('✅ Saving user:', userInfo);

            setAuthData(authToken, userInfo);

            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }

            message.success('Đăng nhập thành công!');

            setTimeout(() => {
                console.log('🚀 Navigating to dashboard...');
                window.location.href = '/dashboard';
            }, 500);

        } catch (error: any) {
            console.error('❌ Login failed:', error);
            const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-background" style={{ // Sử dụng class từ index.css
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
        }}>
            <Card style={{
                width: 400,
                borderRadius: '12px',
                // Hiệu ứng glassmorphism
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Title level={2} style={{ color: '#fff', marginBottom: '8px' }}>
                        Smart Farm IoT
                    </Title>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Đăng nhập để tiếp tục</Text>
                </div>

                <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #e6e9ff 100%)',
                                border: 'none',
                                height: '40px',
                                color: '#667eea', // Màu chữ
                                fontWeight: '600'
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>


                    <div style={{ textAlign: 'center' }}>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            Chưa có tài khoản? <a onClick={() => navigate('/register')} style={{ color: '#fff', fontWeight: 'bold' }}>Đăng ký ngay</a>
                        </Text>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;