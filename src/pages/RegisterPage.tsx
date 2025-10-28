// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Divider } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Leaf } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const { confirm, ...registerData } = values;
            await api.post('/auth/register', registerData);
            message.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            message.error(errorMessage);
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
                    <Title level={2} style={{ color: 'white', fontWeight: 600 }}>"Đất không phải là một thứ hàng hóa, mà là một thực thể sống."</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.7)' }}>- Vandana Shiva</Paragraph>
                </div>
            </div>
            <div className="auth-form-wrapper">
                <div className="auth-form-container">
                    <Title level={2}>Tạo tài khoản mới</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                        Bắt đầu hành trình nông nghiệp thông minh của bạn ngay hôm nay.
                    </Text>

                    <Form name="register_form" onFinish={onFinish} size="large" layout="vertical">
                        <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                            <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email' }]}>
                            <Input prefix={<MailOutlined />} placeholder="your-email@example.com" />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                            <Input prefix={<PhoneOutlined />} placeholder="09xxxxxxxx" />
                        </Form.Item>
                        <Form.Item label="Mật khẩu" name="password" hasFeedback rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                        </Form.Item>
                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) return Promise.resolve();
                                        return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 48, fontSize: 16 }}>
                                Đăng ký
                            </Button>
                        </Form.Item>
                        <Divider>
                            <Text type="secondary">Đã có tài khoản?</Text>
                        </Divider>
                        <Form.Item>
                            <Button block onClick={() => navigate('/login')} style={{ height: 48, fontSize: 16 }}>
                                Đăng nhập ngay
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Link to="/">&larr; Quay về trang chủ</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;