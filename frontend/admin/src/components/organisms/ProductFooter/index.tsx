import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { FormInstance } from 'antd';

export const ProductFooter = ({ form }: { form: FormInstance }) => {
  return (
    <div className='flex justify-end gap-4'>
      <Button icon={<ReloadOutlined />} onClick={() => form.resetFields()}>
        Reset
      </Button>
    </div>
  );
};
