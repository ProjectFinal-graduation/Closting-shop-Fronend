import { notification } from "antd";

const ShowNotification = (type, message, description) => {
    notification[type]({
        message: message,
        description: description,
    });
};

const Notification = {
    ShowSuccess: (message, description) => {
        notification["success"]({
            message: message,
            description: description,
        });
    },
    ShowError: (message, description) => {
        notification["error"]({
            message: message,
            description: description,
        });
    },
    ShowWarning: (message, description) => {
        notification["warning"]({
            message: message,
            description: description,
        });
    },
}



export { Notification, ShowNotification };