import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { colors } from "../../styles/colors";

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await login({ email: values.email, password: values.password });
            console.log('Login response:', response);
            localStorage.setItem('jwt', response.jwt);
            localStorage.setItem('refreshToken', response.refreshToken);
            navigate('/admin');
        } catch {
            message.error('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                style={{
                    backgroundColor: colors.backgroundColor,
                    paddingTop: '20px',
                    borderRadius: '8px',
                    width: '300px',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    style={{ maxWidth: 360 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your Email!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button block type="primary" htmlType="submit" loading={loading}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default Login;