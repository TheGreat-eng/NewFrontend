// src/pages/FarmsPage.tsx

import React, { useEffect, useState } from 'react'; // ✅ BỎ useCallback
import { Row, Col, Card, Button, Typography, Spin, message, Popconfirm, Empty, Space, Tag, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, PushpinOutlined } from '@ant-design/icons';
import { getFarms, createFarm, updateFarm, deleteFarm } from '../api/farmService';
import type { Farm, FarmFormData } from '../types/farm';
import FarmFormModal from '../components/FarmFormModal';
import { useFarm } from '../context/FarmContext';
import { useApiCall } from '../hooks/useApiCall';
import { SUCCESS_MESSAGES } from '../constants/messages';
import Paragraph from 'antd/es/typography/Paragraph';

const { Title, Text } = Typography;

const FarmsPage: React.FC = () => {
    const { farmId, setFarmId } = useFarm();
    const [farms, setFarms] = useState<Farm[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

    const { loading, execute: fetchFarmsApi } = useApiCall<Farm[]>({
        onSuccess: (data) => setFarms(data),
    });

    const { loading: formLoading, execute: saveFarmApi } = useApiCall({
        showSuccessMessage: true,
    });

    const { execute: deleteFarmApi } = useApiCall({
        successMessage: SUCCESS_MESSAGES.FARM_DELETED,
        showSuccessMessage: true,
    });

    // ✅ SỬA: Định nghĩa fetchFarms bình thường, KHÔNG dùng useCallback
    const fetchFarms = async () => {
        try {
            await fetchFarmsApi(async () => {
                const response = await getFarms();
                const farmData = response.data.data || response.data;
                return Array.isArray(farmData) ? farmData : [];
            });
        } catch (error) {
            console.error('Failed to fetch farms:', error);
        }
    };

    // ✅ SỬA: useEffect chỉ chạy 1 lần khi mount
    useEffect(() => {
        fetchFarms();
    }, []); // ✅ Empty dependency array

    const handleFormSubmit = async (values: FarmFormData) => {
        try {
            await saveFarmApi(async () => {
                if (editingFarm) {
                    await updateFarm(editingFarm.id, values);
                    message.success(SUCCESS_MESSAGES.FARM_UPDATED);
                } else {
                    await createFarm(values);
                    message.success(SUCCESS_MESSAGES.FARM_CREATED);
                }
            });
            setIsModalVisible(false);
            fetchFarms(); // ✅ Gọi lại để refresh
        } catch (error) {
            console.error('Failed to save farm:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteFarmApi(() => deleteFarm(id));
            fetchFarms(); // ✅ Gọi lại để refresh
        } catch (error) {
            console.error('Failed to delete farm:', error);
        }
    };

    const openCreateModal = () => {
        setEditingFarm(null);
        setIsModalVisible(true);
    };

    const openEditModal = (farm: Farm) => {
        setEditingFarm(farm);
        setIsModalVisible(true);
    };

    const handleSelectFarm = (farm: Farm) => {
        const previousFarmId = farmId; // ✅ Backup

        setFarmId(farm.id); // ✅ Optimistic update
        message.success(`Đã chuyển sang ${farm.name}`);

        // ✅ Validate phía backend (nếu cần)
        // Nếu backend reject, rollback:
        // setFarmId(previousFarmId);
        // message.error('Không thể chuyển farm');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>Quản lý Nông trại</Title>
                    <Text type="secondary">Tất cả nông trại của bạn ở cùng một nơi.</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                    Thêm nông trại mới
                </Button>
            </div>

            {farms.length > 0 ? (
                <Row gutter={[24, 24]}>
                    {farms.map(farm => (
                        <Col xs={24} sm={12} lg={8} key={farm.id}>
                            <Card
                                hoverable
                                style={{
                                    border: farmId === farm.id ? '1px solid var(--primary-light)' : '1px solid var(--border-light)',
                                    boxShadow: farmId === farm.id ? '0 0 0 3px rgba(79, 70, 229, 0.1)' : 'none',
                                    transition: 'all 0.2s ease-in-out',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                }}
                                bodyStyle={{ flexGrow: 1, padding: 20 }}
                            >
                                <div style={{ flexGrow: 1 }}>
                                    <Title level={4} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                                        {farm.name}
                                        {farmId === farm.id && (
                                            <Tag icon={<CheckCircleOutlined />} color="processing" style={{ marginLeft: 8 }}>
                                                Đang chọn
                                            </Tag>
                                        )}
                                    </Title>
                                    <Text type="secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                                        <PushpinOutlined /> {farm.location || 'Chưa có vị trí'}
                                    </Text>
                                    <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                                        {farm.description || 'Không có mô tả.'}
                                    </Paragraph>
                                </div>
                                <div style={{ borderTop: '1px solid var(--border-light)', margin: '20px -20px 0', paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
                                    <Row justify="space-between" align="middle">
                                        <Col>
                                            <Statistic title="Thiết bị" value={farm.onlineDevices ?? 0} suffix={`/ ${farm.totalDevices ?? 0} Online`} />
                                        </Col>
                                        <Col>
                                            <Space>
                                                <Button icon={<EditOutlined />} onClick={() => openEditModal(farm)} />
                                                <Popconfirm
                                                    key="delete"
                                                    title="Xóa nông trại này?"
                                                    onConfirm={() => handleDelete(farm.id)}
                                                    okText="Xóa"
                                                    cancelText="Hủy"
                                                >
                                                    <Button danger icon={<DeleteOutlined />} />
                                                </Popconfirm>
                                                <Button type="primary" onClick={() => handleSelectFarm(farm)} disabled={farmId === farm.id}>
                                                    Chọn
                                                </Button>
                                            </Space>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty
                    description="Bạn chưa có nông trại nào"
                    style={{ marginTop: 64 }}
                >
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                        Tạo nông trại đầu tiên
                    </Button>
                </Empty>
            )}

            <FarmFormModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleFormSubmit}
                initialData={editingFarm}
                loading={formLoading}
            />
        </div>
    );
};

export default FarmsPage;