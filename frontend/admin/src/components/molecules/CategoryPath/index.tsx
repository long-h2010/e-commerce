import { Category } from '@/types';
import { RightOutlined } from '@ant-design/icons';
import { Space } from 'antd';

export const CategoryPath = ({
  item,
  all,
}: {
  item: Category;
  all: Category[];
}) => {
  const path: string[] = [];
  let cur: Category | undefined = item;

  while (cur) {
    path.unshift(cur.category);
    cur = all.find((c) => c.id === cur!.parentId);
  }

  return (
    <div className='flex items-center gap-1'>
      {path.map((p, i) => (
        <Space key={i} size={4}>
          {i > 0 && <RightOutlined style={{ fontSize: 9, color: '#bbb' }} />}
          <span
            style={{
              fontSize: 12,
              color: i === path.length - 1 ? '' : '#aaa',
              fontWeight: i === path.length - 1 ? 500 : 400,
            }}
          >
            {p}
          </span>
        </Space>
      ))}
    </div>
  );
};
