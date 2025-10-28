// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authService';
import { setAuthData } from '../utils/auth';
import { Leaf } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await login(values.email, values.password);
            const { accessToken, refreshToken, ...userData } = response.data;
            const authToken = accessToken || response.data.token;
            if (!authToken) throw new Error('Không nhận được token từ server');

            const userInfo = {
                userId: userData.userId,
                email: userData.email,
                fullName: userData.fullName,
                phone: userData.phone || null,
                roles: [userData.role],
            };

            setAuthData(authToken, userInfo);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

            message.success('Đăng nhập thành công! Đang chuyển hướng...');
            setTimeout(() => { window.location.href = '/dashboard'; }, 500);
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Email hoặc mật khẩu không chính xác.';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-showcase">
                <div>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Leaf size={24} />
                        <Title level={4} style={{ color: 'white', margin: 0 }}>SmartFarm</Title>
                    </Link>
                </div>
                <div>
                    <Title level={2} style={{ color: 'white', fontWeight: 600 }}>"Nông nghiệp không chỉ là trồng trọt, mà là nghệ thuật và khoa học."</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.7)' }}>- Masanobu Fukuoka</Paragraph>
                </div>
            </div>
            <div className="auth-form-wrapper">
                <div className="auth-form-container">
                    <Title level={2}>Chào mừng trở lại</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                        Vui lòng nhập thông tin để truy cập hệ thống.
                    </Text>

                    <Form name="login" onFinish={onFinish} autoComplete="off" size="large" layout="vertical">
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
                            <Input prefix={<MailOutlined />} placeholder="your-email@example.com" />
                        </Form.Item>
                        <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block style={{ height: 48, fontSize: 16 }}>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                    <Divider>
                        <Text type="secondary">Chưa có tài khoản?</Text>
                    </Divider>
                    <Form.Item>
                        <Button block onClick={() => navigate('/register')} style={{ height: 48, fontSize: 16 }}>
                            Đăng ký ngay
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Link to="/">&larr; Quay về trang chủ</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;