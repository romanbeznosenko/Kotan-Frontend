import { Button, Checkbox, Divider, Form, Input, Modal, Typography, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { colors } from '../../styles/colors';
import { createClubWithLogo, deleteClub, editClub, getClub, uploadClubLogo } from '../../services/clubService';

interface FieldType {
    name: string;
    shortName: string;
    city: string;
    country: string;
    isOurClub: boolean;
    logo?: any;
}

interface AdminClubModalWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    id?: string;
}

const AdminClubModalWindow = ({ isOpen, onClose, onSuccess, id }: AdminClubModalWindowProps) => {
    const [form] = Form.useForm<FieldType>();
    const [loading, setLoading] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen && id) {
            getClub(id).then((club) => {
                form.setFieldsValue({
                    name: club.name,
                    shortName: club.shortName,
                    city: club.city,
                    country: club.country,
                    isOurClub: club.isOurClub,
                });
            });
        } else if (isOpen) {
            form.resetFields();
        }
        setLogoFile(null);
    }, [isOpen, id]);

    const handleSave = async () => {
        const values = await form.validateFields();
        setLoading(true);
        try {
            if (id) {
                await editClub(id, { ...values, isOurClub: values.isOurClub ?? false });
                if (logoFile) {
                    await uploadClubLogo(id, logoFile);
                }
            } else {
                if (!logoFile) {
                    form.setFields([{ name: 'logo', errors: ['Please upload a logo!'] }]);
                    return;
                }
                await createClubWithLogo({ ...values, isOurClub: values.isOurClub ?? false }, logoFile);
            }
            onSuccess();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={isOpen} onCancel={onClose} footer={null}>
            <Typography.Title level={3}>Club Details</Typography.Title>
            <Divider />
            <Form form={form}>
                <Form.Item<FieldType> label="Name" name="name" rules={[{ required: true, message: 'Please input club name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item<FieldType> label="Short Name" name="shortName" rules={[{ required: true, message: 'Please input short name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item<FieldType> label="City" name="city" rules={[{ required: true, message: 'Please input city!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item<FieldType> label="Country" name="country" rules={[{ required: true, message: 'Please input country!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item<FieldType> label="Our Club" name="isOurClub" valuePropName="checked">
                    <Checkbox />
                </Form.Item>
                <Form.Item label="Logo" name="logo">
                    <Upload
                        beforeUpload={(file) => {
                            setLogoFile(file);
                            return false;
                        }}
                        maxCount={1}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Upload Logo</Button>
                    </Upload>
                </Form.Item>
            </Form>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Button type='primary' loading={loading} onClick={handleSave} style={{ backgroundColor: colors.success, marginRight: 16 }}>
                    Save
                </Button>
                {id && (
                    <Button type='primary' loading={loading} onClick={async () => {
                        setLoading(true);
                        try {
                            await deleteClub(id);
                            onSuccess();
                            onClose();
                        } finally {
                            setLoading(false);
                        }
                    }} style={{ backgroundColor: colors.error }}>
                        Delete
                    </Button>
                )}
            </div>
        </Modal>
    );
};

export default AdminClubModalWindow;
