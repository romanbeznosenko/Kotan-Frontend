import { Button, Divider, Form, Input, Modal, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { CompetitionTypeEnum } from '../../types/competition';
import type { CompetitionType } from '../../types/competition';
import { colors } from '../../styles/colors';
import { createCompetition, deleteCompetition, editCompetition } from '../../services/competitionService';

interface FieldType {
    name: string;
    season: string;
    type: CompetitionType;
}

interface AdminCompetitionModalWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    id?: string;
    initialValues?: Partial<FieldType>;
}

const AdminCompetitionModalWindow = ({ isOpen, onClose, onSuccess, id, initialValues }: AdminCompetitionModalWindowProps) => {
    const [form] = Form.useForm<FieldType>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            form.setFieldsValue(initialValues ?? {});
        }
    }, [isOpen, initialValues]);

    const handleSave = async () => {
        const values = await form.validateFields();
        const body = { name: values.name, season: values.season, competitionType: values.type };
        setLoading(true);
        try {
            if (id) {
                await editCompetition(id, body);
            } else {
                await createCompetition(body);
            }
            onSuccess();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={isOpen} onCancel={onClose} footer={null}>
            <Typography.Title level={3}>Competition Details</Typography.Title>
            <Divider />
            <Form form={form} initialValues={initialValues}>
                <Form.Item<FieldType>
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input competition name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Season"
                    name="season"
                    rules={[{ required: true, message: 'Please select a season!' }]}
                >
                    <Select options={[
                        { value: '2025/2026', label: '2025/2026' },
                        { value: '2026/2027', label: '2026/2027' },
                    ]} />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: 'Please select a type!' }]}
                >
                    <Select options={[
                        { value: CompetitionTypeEnum.LEAGUE, label: 'LEAGUE' },
                        { value: CompetitionTypeEnum.CUP, label: 'CUP' },
                        { value: CompetitionTypeEnum.FRIENDLY, label: 'FRIENDLY' },
                    ]} />
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
                            await deleteCompetition(id);
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

export default AdminCompetitionModalWindow;
