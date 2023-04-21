import { Button, notification, Space } from 'antd'
const Notification = ({ type, message, description }) => {
    const [api, contextHolder] = notification.useNotification()
    const openNotificationWithIcon = () => {
        api[type]({
            message: message,
            description: description,
        })
    }
    return (
        <>
            {contextHolder}
            <Space>{openNotificationWithIcon()}</Space>
        </>
    )
}
export default Notification
