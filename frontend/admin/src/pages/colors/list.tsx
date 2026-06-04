import { useHeaderStore } from '@/stores';
import { Color } from '@/types';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { DeleteButton, useTable } from '@refinedev/antd';
import { Button, ColorPicker, Input, Space, Table } from 'antd';
import { useEffect, useState, useMemo, useRef } from 'react';
import { formatDate } from '@/lib/utils';
import { useCreate, useUpdate } from '@refinedev/core';
import { PageTemplate } from '@/components/templates';

export const ColorList = () => {
  const { setState } = useHeaderStore();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const timeoutRef = useRef<any>(null);

  const [mode, setMode] = useState<'create' | 'edit' | null>(null);
  const [changing, setChanging] = useState<Color | null>(null);

  const { tableProps, setFilters } = useTable({
    filters: {
      permanent: [],
    },
    syncWithLocation: false,
  });

  const dataSource = useMemo(() => {
    const original = tableProps?.dataSource || [];

    if (!changing || mode !== 'create') return original;

    return [changing, ...original];
  }, [tableProps?.dataSource, changing]);

  const { mutate: createColor } = useCreate();
  const { mutate: updateColor } = useUpdate();

  const handleInputChange = (value: string) => {
    setSearchText(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const trimmed = value.trim();

      if (!trimmed) {
        setFilters([], 'replace');
        return;
      }

      setFilters(
        [{ field: 'keyword', operator: 'contains', value: trimmed }],
        'replace',
      );
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCreate = () => {
    if (!changing) return;

    createColor(
      {
        resource: import.meta.env.VITE_COLORS_ENDPOINT,
        values: {
          name: changing.name,
          hex: changing.hex,
        },
      },
      {
        onSuccess: () => setChanging(null),
      },
    );
  };

  const handleUpdate = () => {
    if (!changing) return;

    updateColor(
      {
        resource: import.meta.env.VITE_COLORS_ENDPOINT,
        id: changing.id,
        values: {
          name: changing.name,
          hex: changing.hex,
        },
      },
      {
        onSuccess: () => setChanging(null),
      },
    );
  };

  useEffect(() => {
    setState('Create', 'plus', () => {
      setMode('create');

      setChanging({
        id: 'new',
        name: '',
        hex: '#000000',
      });
    });
  }, []);

  return (
    <PageTemplate>
      <div className='flex justify-end'>
        <Input
          placeholder='Search by name or hex code'
          size='large'
          prefix={<SearchOutlined />}
          style={{ width: 340 }}
          allowClear
          value={searchText}
          onChange={(e) => {
            const value = e.target.value;
            handleInputChange(value);
          }}
        />
      </div>
      <Table
        {...tableProps}
        dataSource={dataSource}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        rowKey='id'
      >
        <Table.Column
          title='Name'
          dataIndex='name'
          sorter={{ multiple: 1 }}
          sortDirections={['ascend', 'descend']}
          render={(value, record) => {
            if (changing?.id === record.id && mode !== null) {
              return (
                <Input
                  defaultValue={value}
                  autoFocus
                  onChange={(e) =>
                    setChanging((prev) => ({
                      ...prev!,
                      name: e.target.value,
                    }))
                  }
                />
              );
            } else return value;
          }}
        />
        <Table.Column
          title='Hex code'
          dataIndex='hex'
          sorter={{ multiple: 1 }}
          sortDirections={['ascend', 'descend']}
          render={(value, record) => {
            if (changing?.id === record.id && mode !== null) {
              return (
                <ColorPicker
                  defaultValue={value}
                  showText
                  onChange={(value) =>
                    setChanging((prev) => ({
                      ...prev!,
                      hex: value.toHexString(),
                    }))
                  }
                />
              );
            } else return <span className='uppercase'>{value}</span>;
          }}
        />
        <Table.Column
          title='Color'
          dataIndex='hex'
          render={(value, record) => {
            if (changing?.id !== record.id) {
              return <ColorPicker value={value} disabled />;
            } else return <ColorPicker disabled />;
          }}
        />
        <Table.Column
          title='Created'
          dataIndex='createdAt'
          sorter={{ multiple: 1 }}
          sortDirections={['ascend', 'descend']}
          render={(value: string) => formatDate(value)}
        />
        <Table.Column
          align='center'
          render={(_, record: Color) => {
            if (changing?.id === record.id && mode !== null) {
              return (
                <Space>
                  <Button
                    size='small'
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => setChanging(null)}
                  />
                  <Button
                    size='small'
                    type='primary'
                    icon={<CheckOutlined />}
                    onClick={() => {
                      if (mode == 'create') return handleCreate();
                      if (mode == 'edit') return handleUpdate();

                      setMode(null);
                    }}
                  />
                </Space>
              );
            } else
              return (
                <Space>
                  <Button
                    size='small'
                    icon={<EditOutlined />}
                    onClick={() => {
                      setMode('edit');
                      setChanging(record);
                    }}
                  />
                  <DeleteButton
                    hideText
                    size='small'
                    recordItemId={record.id}
                  />
                </Space>
              );
          }}
        />
      </Table>
    </PageTemplate>
  );
};
