import React, { useEffect, useState } from 'react';
import {
    DesktopOutlined,
    PieChartOutlined,
    UserOutlined,
    SettingOutlined,
    BuildOutlined,
    RobotOutlined,
    HeartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // ✅ THÊM
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
// ... imports
import { CrownOutlined } from '@ant-design/icons'; // Thêm icon
import { hasRole, getUserFromStorage } from '../utils/auth'; // Thêm util
import PageBreadcrumb from '../components/PageBreadcrumb'; // ✅ THÊM



import { notification } from 'antd'; // ✅ Import notification
import { BellOutlined } from '@ant-design/icons';
import { useStomp } from '../hooks/useStomp';

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return { key, icon, children, label } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Dashboard', '/dashboard', <PieChartOutlined />),
    getItem('Dự đoán AI', '/ai', <RobotOutlined />),
    getItem('Quy tắc Tự động', '/rules', <BuildOutlined />),
    getItem('Quản lý Nông trại', '/farms', <DesktopOutlined />),
    getItem('Quản lý Thiết bị', '/devices', <SettingOutlined />),
    getItem('Tài khoản', 'sub_user', <UserOutlined />, [
        getItem('Thông tin cá nhân', '/profile'),
        getItem('Đổi mật khẩu', '/change-password'),
    ]),
];

const AppLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark } = useTheme(); // ✅ THÊM
    const { token: { colorBgContainer, colorBgLayout } } = theme.useToken(); // Lấy thêm màu nền layout

    // VVVV--- LOGIC TẠO MENU ĐỘNG ---VVVV
    const user = getUserFromStorage();
    const isAdmin = user && user.roles && user.roles.includes('ADMIN');

    const { stompClient, isConnected } = useStomp(user ? user.userId : null); // ✅ Sử dụng userId để kết nối

    // ✅ Lắng nghe thông báo
    useEffect(() => {
        if (isConnected && stompClient && user) {
            const subscription = stompClient.subscribe(
                `/topic/user/${user.userId}/notifications`,
                (message) => {
                    try {
                        const notificationData = JSON.parse(message.body);
                        notification.open({
                            message: notificationData.title,
                            description: notificationData.message,
                            icon: <BellOutlined style={{ color: '#108ee9' }} />,
                            placement: 'bottomRight',
                        });
                    } catch (error) {
                        console.error('Failed to parse notification message:', error);
                    }
                }
            );
            return () => subscription.unsubscribe();
        }
    }, [isConnected, stompClient, user]);

    const menuItems: MenuItem[] = [
        getItem('Dashboard', '/dashboard', <PieChartOutlined />),
        getItem('Dự đoán AI', '/ai', <RobotOutlined />),
        // Thêm trang Plant Health sẽ ở đây
        getItem('Quy tắc Tự động', '/rules', <BuildOutlined />),
        getItem('Quản lý Nông trại', '/farms', <DesktopOutlined />),
        getItem('Quản lý Thiết bị', '/devices', <SettingOutlined />),
        getItem('Sức khỏe Cây trồng', '/plant-health', <HeartOutlined />), // <-- THÊM DÒNG NÀY
        // Chỉ hiển thị menu Admin nếu là Admin
        isAdmin && getItem('Admin Panel', 'sub_admin', <CrownOutlined />, [
            // SỬA LẠI ĐÂY
            getItem('Dashboard', '/admin/dashboard'),
            getItem('Quản lý Người dùng', '/admin/users'),
        ]),
        getItem('Tài khoản', 'sub_user', <UserOutlined />, [
            getItem('Thông tin cá nhân', '/profile'),
            getItem('Đổi mật khẩu', '/change-password'),
        ]),
        getItem('Cài đặt', '/settings', <SettingOutlined />),
    ].filter(Boolean) as MenuItem[]; // .filter(Boolean) để loại bỏ giá trị false (khi user không phải admin)
    // ^^^^------------------------------------^^^^

    return (
        // Layout chính sử dụng màu nền từ theme
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                theme={isDark ? 'dark' : 'light'}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 100,
                    borderRight: isDark ? '1px solid #303030' : '1px solid #f0f0f0'
                }}
            >
                <div
                    style={{
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                    }}
                >
                    {/* Logo cách điệu với gradient */}
                    <div
                        className="gradient-text"
                        style={{
                            fontWeight: 'bold',
                            fontSize: collapsed ? '24px' : '20px',
                            transition: 'all 0.3s',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {collapsed ? 'SF' : 'Smart Farm'}
                    </div>
                </div>
                <Menu
                    theme={isDark ? 'dark' : 'light'}
                    selectedKeys={[location.pathname]}
                    mode="inline"
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>

            <Layout style={{
                marginLeft: collapsed ? 80 : 200,
                transition: 'margin-left 0.2s',
            }}>
                <div style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 99,
                    width: '100%'
                }}>
                    <AppHeader colorBgContainer={colorBgContainer} />
                </div>

                {/* ✅ THAY ĐỔI: Bỏ padding ở đây để các trang con tự quản lý */}
                <Content style={{ margin: '24px 16px', overflow: 'initial' }}>
                    {/* ✅ THÊM BREADCRUMB Ở ĐÂY */}
                    <PageBreadcrumb />
                    <div className="app-content" key={location.pathname}>
                        <Outlet />
                    </div>
                </Content>

                <AppFooter />
            </Layout>
        </Layout>
    );
};

export default AppLayout;