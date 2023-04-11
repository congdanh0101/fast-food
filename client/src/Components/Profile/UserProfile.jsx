import { Avatar, Button, Divider, Form, Input, Radio, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function UserProfile(props) {
  const { name, email, avatar } = props;

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Avatar size={128} icon={<UserOutlined />} src={avatar} />
      <Title level={3}>{name}</Title>
      <Text>{email}</Text>
      <Divider />
      <Form
        name="profile"
        onFinish={onFinish}
        initialValues={{
          fullname: '',
          telephone: '',
          gender: '',
          dob: '',
          address: '',
        }}
      >
        <Form.Item
          label="Full Name"
          name="fullname"
          rules={[{ required: true, message: 'Please input your full name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Telephone"
          name="telephone"
          rules={[{ required: true, message: 'Please input your telephone number!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="other">Other</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={[{ required: true, message: 'Please input your date of birth!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please input your address!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UserProfile;
