// src/pages/LandingPage.tsx
import React, { useEffect } from 'react';
import { Button, Row, Col, Typography, Card } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, BarChart, Bot, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { isAuthenticated } from '../utils/auth';
import AppFooter from '../layout/AppFooter';

const { Title, Paragraph } = Typography;

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <motion.div whileHover={{ y: -10 }}>
        <Card bordered={false} style={{ background: 'var(--secondary-light)', height: '100%', borderRadius: 'var(--radius)' }}>
            <div style={{ color: 'var(--primary-light)', marginBottom: 24 }}>
                {icon}
            </div>
            <Title level={4} style={{ marginBottom: 16 }}>{title}</Title>
            <Paragraph type="secondary">{description}</Paragraph>
        </Card>
    </motion.div>
);

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
    };

    return (
        <div className="landing-page">
            <header className="landing-header">
                <Link to="/" className="landing-logo">
                    <span className="gradient-text">SmartFarm</span>
                </Link>
                <div className="landing-nav">
                    <Button type="text" size="large" onClick={() => navigate('/login')}>Đăng nhập</Button>
                    <Button type="primary" size="large" onClick={() => navigate('/register')}>Bắt đầu miễn phí</Button>
                </div>
            </header>

            <section className="landing-hero">
                <Row justify="center" align="middle" style={{ height: '100%' }}>
                    <Col xs={22} md={18} lg={14} style={{ textAlign: 'center' }}>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.h1 variants={itemVariants} style={{ fontSize: ' clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem', color: 'var(--foreground-light)' }}>
                                Nền Tảng IoT Cho Nông Trại Của Tương Lai
                            </motion.h1>
                            <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'var(--muted-foreground-light)', maxWidth: 700, margin: '0 auto' }}>
                                Giám sát, tự động hóa và tối ưu hóa trang trại của bạn với sức mạnh của dữ liệu thời gian thực và trí tuệ nhân tạo.
                            </motion.p>
                            <motion.div variants={itemVariants} style={{ marginTop: '2rem' }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    shape="round"
                                    onClick={() => navigate('/register')}
                                    style={{ height: 56, padding: '0 40px', fontSize: 18, fontWeight: 500 }}
                                >
                                    Khám phá ngay <ArrowRight size={20} style={{ marginLeft: 8 }} />
                                </Button>
                            </motion.div>
                        </motion.div>
                    </Col>
                </Row>
            </section>

            <section className="landing-features">
                <div className="landing-container">
                    <Title level={2} style={{ textAlign: 'center', marginBottom: 64 }}>Tất cả công cụ bạn cần, ở một nơi</Title>
                    <Row gutter={[32, 32]} justify="center">
                        <Col xs={24} md={8}>
                            <FeatureCard
                                icon={<BarChart size={32} />}
                                title="Giám sát Thời gian thực"
                                description="Theo dõi các chỉ số quan trọng như nhiệt độ, độ ẩm, pH từ bất cứ đâu, bất cứ lúc nào qua dashboard trực quan."
                            />
                        </Col>
                        <Col xs={24} md={8}>
                            <FeatureCard
                                icon={<Bot size={32} />}
                                title="Tự động hóa Thông minh"
                                description="Thiết lập các quy tắc để tự động bật/tắt máy bơm, quạt, đèn... tiết kiệm thời gian và công sức vận hành."
                            />
                        </Col>
                        <Col xs={24} md={8}>
                            <FeatureCard
                                icon={<BrainCircuit size={32} />}
                                title="Phân tích & Dự đoán AI"
                                description="Nhận các gợi ý tối ưu hóa, chẩn đoán bệnh cây và dự đoán về sức khỏe cây trồng từ mô hình AI của chúng tôi."
                            />
                        </Col>
                    </Row>
                </div>
            </section>

            <section className="landing-cta">
                <div className="landing-container" style={{ textAlign: 'center' }}>
                    <Title level={2}>Sẵn sàng để cách mạng hóa trang trại của bạn?</Title>
                    <Paragraph type="secondary" style={{ fontSize: '1.1rem', marginTop: 16 }}>Tham gia cùng hàng ngàn nông dân hiện đại khác và đưa nông trại của bạn lên một tầm cao mới.</Paragraph>
                    <Button
                        type="primary"
                        size="large"
                        shape="round"
                        onClick={() => navigate('/register')}
                        style={{ marginTop: 24, height: 50, padding: '0 30px', fontSize: 16 }}
                    >
                        Bắt đầu miễn phí
                    </Button>
                </div>
            </section>

            <AppFooter />
        </div>
    );
};

export default LandingPage;