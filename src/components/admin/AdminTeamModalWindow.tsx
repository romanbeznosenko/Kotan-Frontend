import { Button, Divider, Form, Input, Modal, Select, Typography, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { colors } from '../../styles/colors';
import { createTeam, deleteTeam, editTeam, getTeam, uploadTeamCover } from '../../services/teamService';
import type { AgeGroupEnum, GenderEnum } from '../../services/teamService';

interface FieldType {
    name: string;
    ageGroup: AgeGroupEnum;
    gender: GenderEnum;
    coachName?: string;
}

interface AdminTeamModalWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    clubId: string;
    teamId?: string;
}

const AGE_GROUP_OPTIONS: { label: string; value: AgeGroupEnum }[] = [
    { label: 'U6/U7', value: 'U6_U7' },
    { label: 'U8/U9', value: 'U8_U9' },
    { label: 'U10/U11', value: 'U10_U11' },
    { label: 'U12/U13', value: 'U12_U13' },
    { label: 'U14/U15', value: 'U14_U15' },
    { label: 'U16/U17', value: 'U16_U17' },
    { label: 'U18/U19', value: 'U18_U19' },
    { label: 'Senior', value: 'SENIOR' },
];

const GENDER_OPTIONS: { label: string; value: GenderEnum }[] = [
    { label: 'Men', value: 'MEN' },
    { label: 'Women', value: 'WOMEN' },
];

const AdminTeamModalWindow = ({ isOpen, onClose, onSuccess, clubId, teamId }: AdminTeamModalWindowProps) => {
    const [form] = Form.useForm<FieldType>();
    const [loading, setLoading] = useState(false);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen && teamId) {
            getTeam(clubId, teamId).then((team) => {
                form.setFieldsValue({
                    name: team.name,
                    ageGroup: team.ageGroup,
                    gender: team.gender,
                    coachName: team.coachName,
                });
            });
        } else if (isOpen) {
            form.resetFields();
        }
        setCoverFile(null);
    }, [isOpen, teamId]);

    const handleSave = async () => {
        const values = await form.validateFields();
        setLoading(true);
        try {
            if (teamId) {
                await editTeam(clubId, teamId, values);
                if (coverFile) {
                    await uploadTeamCover(clubId, teamId, coverFile);
                }
            } else {
                await createTeam(clubId, values, coverFile ?? null);
            }
            onSuccess();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={isOpen} onCancel={onClose} footer={null}>
            <Typography.Title level={3}>Team Details</Typography.Title>
            <Divider />
            <Form form={form}>
                <Form.Item<FieldType> label="Name" name="name" rules={[{ required: true, message: 'Please input team name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item<FieldType> label="Age Group" name="ageGroup" rules={[{ required: true, message: 'Please select age group!' }]}>
                    <Select options={AGE_GROUP_OPTIONS} />
                </Form.Item>
                <Form.Item<FieldType> label="Gender" name="gender" rules={[{ required: true, message: 'Please select gender!' }]}>
                    <Select options={GENDER_OPTIONS} />
                </Form.Item>
                <Form.Item<FieldType> label="Coach Name" name="coachName">
                    <Input />
                </Form.Item>
                <Form.Item label="Cover Image" name="cover">
                    <Upload
                        beforeUpload={(file) => {
                            setCoverFile(file);
                            return false;
                        }}
                        maxCount={1}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Upload Cover</Button>
                    </Upload>
                </Form.Item>
            </Form>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Button type='primary' loading={loading} onClick={handleSave} style={{ backgroundColor: colors.success, marginRight: 16 }}>
                    Save
                </Button>
                {teamId && (
                    <Button type='primary' loading={loading} onClick={async () => {
                        setLoading(true);
                        try {
                            await deleteTeam(clubId, teamId);
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

export default AdminTeamModalWindow;
