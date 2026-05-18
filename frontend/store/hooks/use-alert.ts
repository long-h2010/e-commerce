import { App } from 'antd';

export const useAlert = () => {
  const { notification, message } = App.useApp();

  return {
    alert: {
      success: (msg: string, title?: string) =>
        notification.success({
          title: title ?? 'Successful',
          description: msg,
        }),
      error: (msg: string, title?: string) =>
        notification.error({ title: title ?? 'Error', description: msg }),
      warning: (msg: string, title?: string) =>
        notification.warning({ title: title ?? 'Warning', description: msg }),
      info: (msg: string, title?: string) =>
        notification.info({ title: title ?? 'Notify', description: msg }),
    },

    toast: {
      success: (msg: string) => message.success(msg),
      error: (msg: string) => message.error(msg),
      warning: (msg: string) => message.warning(msg),
      loading: (msg: string) => message.loading(msg),
    },
  };
};
