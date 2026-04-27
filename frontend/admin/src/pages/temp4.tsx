import { useState, useMemo } from "react";
import {
  Layout,
  Menu,
  Button,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  ConfigProvider,
  theme,
  Breadcrumb,
  Table,
  Input,
  Popconfirm,
  Tag,
  Tooltip,
  message,
  Badge,
  Empty,
  Select,
  Drawer,
  Form,
  Switch,
  Divider,
  TreeSelect,
  Alert,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  AppstoreOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  SettingOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  TagsOutlined,
  RightOutlined,
  HolderOutlined,
} from "@ant-design/icons";

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

// ── Types ──────────────────────────────────────────────────────────────────────
interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  productCount: number;
  visible: boolean;
  order: number;
  createdAt: string;
  // tree helpers (set at render time)
  children?: CategoryItem[];
  level?: number;
  parentName?: string;
}

interface EditState {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  visible: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
let nextId = 20;
const toSlug = (s: string) =>
  s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

// Build flat list with level + parentName injected, sorted for display
function flattenTree(
  items: CategoryItem[],
  parentId: number | null = null,
  level = 0,
  parentName = ""
): CategoryItem[] {
  return items
    .filter(i => i.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .flatMap(item => {
      const node = { ...item, level, parentName };
      const children = flattenTree(items, item.id, level + 1, item.name);
      return [node, ...children];
    });
}

// Build TreeSelect options
function buildTreeOptions(items: CategoryItem[], excludeId?: number): any[] {
  const build = (parentId: number | null): any[] =>
    items
      .filter(i => i.parentId === parentId && i.id !== excludeId)
      .sort((a, b) => a.order - b.order)
      .map(i => ({
        title: i.name,
        value: i.id,
        children: build(i.id),
      }));
  return build(null);
}

// Count including children
function countWithChildren(items: CategoryItem[], id: number): number {
  const children = items.filter(i => i.parentId === id);
  return children.reduce((s, c) => s + countWithChildren(items, c.id), children.length);
}

// ── Seed data ──────────────────────────────────────────────────────────────────
const SEED: CategoryItem[] = [
  // L0
  { id: 1,  name: "Men",         slug: "men",           parentId: null, productCount: 0,  visible: true,  order: 1, createdAt: "01 Jan 2025" },
  { id: 2,  name: "Women",       slug: "women",         parentId: null, productCount: 0,  visible: true,  order: 2, createdAt: "01 Jan 2025" },
  { id: 3,  name: "Accessories", slug: "accessories",   parentId: null, productCount: 18, visible: true,  order: 3, createdAt: "01 Jan 2025" },
  // L1 under Men
  { id: 4,  name: "Tops",        slug: "men-tops",      parentId: 1,    productCount: 0,  visible: true,  order: 1, createdAt: "05 Jan 2025" },
  { id: 5,  name: "Bottoms",     slug: "men-bottoms",   parentId: 1,    productCount: 0,  visible: true,  order: 2, createdAt: "05 Jan 2025" },
  { id: 6,  name: "Outerwear",   slug: "men-outerwear", parentId: 1,    productCount: 12, visible: true,  order: 3, createdAt: "05 Jan 2025" },
  // L2 under Men > Tops
  { id: 7,  name: "T-Shirts",    slug: "men-t-shirts",  parentId: 4,    productCount: 24, visible: true,  order: 1, createdAt: "10 Jan 2025" },
  { id: 8,  name: "Shirts",      slug: "men-shirts",    parentId: 4,    productCount: 16, visible: true,  order: 2, createdAt: "10 Jan 2025" },
  { id: 9,  name: "Knitwear",    slug: "men-knitwear",  parentId: 4,    productCount: 9,  visible: false, order: 3, createdAt: "10 Jan 2025" },
  // L2 under Men > Bottoms
  { id: 10, name: "Jeans",       slug: "men-jeans",     parentId: 5,    productCount: 19, visible: true,  order: 1, createdAt: "12 Jan 2025" },
  { id: 11, name: "Chinos",      slug: "men-chinos",    parentId: 5,    productCount: 11, visible: true,  order: 2, createdAt: "12 Jan 2025" },
  { id: 12, name: "Shorts",      slug: "men-shorts",    parentId: 5,    productCount: 7,  visible: true,  order: 3, createdAt: "12 Jan 2025" },
  // L1 under Women
  { id: 13, name: "Tops",        slug: "women-tops",    parentId: 2,    productCount: 0,  visible: true,  order: 1, createdAt: "05 Jan 2025" },
  { id: 14, name: "Dresses",     slug: "women-dresses", parentId: 2,    productCount: 0,  visible: true,  order: 2, createdAt: "05 Jan 2025" },
  { id: 15, name: "Outerwear",   slug: "women-outer",   parentId: 2,    productCount: 14, visible: true,  order: 3, createdAt: "05 Jan 2025" },
  // L2 under Women > Tops
  { id: 16, name: "T-Shirts",    slug: "women-t-shirts",parentId: 13,   productCount: 21, visible: true,  order: 1, createdAt: "15 Jan 2025" },
  { id: 17, name: "Blouses",     slug: "women-blouses", parentId: 13,   productCount: 13, visible: true,  order: 2, createdAt: "15 Jan 2025" },
  // L2 under Women > Dresses
  { id: 18, name: "Midi",        slug: "women-midi",    parentId: 14,   productCount: 8,  visible: true,  order: 1, createdAt: "18 Jan 2025" },
  { id: 19, name: "Maxi",        slug: "women-maxi",    parentId: 14,   productCount: 6,  visible: false, order: 2, createdAt: "18 Jan 2025" },
];

const NAV_ITEMS = [
  { key: "home",       icon: <HomeOutlined />,     label: "Dashboard" },
  { key: "products",   icon: <ShoppingOutlined />, label: "Products" },
  { key: "categories", icon: <TagsOutlined />,     label: "Categories" },
  { key: "orders",     icon: <AppstoreOutlined />, label: "Orders" },
  { key: "stats",      icon: <BarChartOutlined />, label: "Analytics" },
  { key: "settings",   icon: <SettingOutlined />,  label: "Settings" },
];

// ── Breadcrumb path renderer ───────────────────────────────────────────────────
function CategoryPath({ item, all }: { item: CategoryItem; all: CategoryItem[] }) {
  const path: string[] = [];
  let cur: CategoryItem | undefined = item;
  while (cur) {
    path.unshift(cur.name);
    cur = all.find(c => c.id === cur!.parentId);
  }
  return (
    <Space size={4} wrap={false} style={{ flexWrap: "nowrap" }}>
      {path.map((p, i) => (
        <Space key={i} size={4}>
          {i > 0 && <RightOutlined style={{ fontSize: 9, color: "#bbb" }} />}
          <Text
            style={{
              fontSize: 12,
              color: i === path.length - 1 ? "#1d1d1d" : "#aaa",
              fontWeight: i === path.length - 1 ? 500 : 400,
            }}
          >
            {p}
          </Text>
        </Space>
      ))}
    </Space>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Temp() {
  const [categories, setCategories] = useState<CategoryItem[]>(SEED);
  const [editState, setEditState]   = useState<EditState | null>(null);
  const [search, setSearch]         = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form]                      = Form.useForm();
  const [messageApi, ctx]           = message.useMessage();
  const [expandAll, setExpandAll]   = useState(true);

  // ── Flat tree for table ──
  const flatList = useMemo(() => flattenTree(categories), [categories]);

  const filtered = useMemo(() => {
    if (!search) return flatList;
    const q = search.toLowerCase();
    // When searching, show all matches (flatten, no tree indent)
    return categories
      .filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
      .map(c => ({ ...c, level: 0 }));
  }, [flatList, categories, search]);

  // ── CRUD ──
  const startEdit = (c: CategoryItem) => {
    setEditState({ id: c.id, name: c.name, slug: c.slug, parentId: c.parentId, visible: c.visible });
  };
  const cancelEdit = () => setEditState(null);

  const saveEdit = () => {
    if (!editState?.name.trim()) return;
    setCategories(prev =>
      prev.map(c =>
        c.id === editState.id
          ? { ...c, name: editState.name.trim(), slug: editState.slug || toSlug(editState.name), parentId: editState.parentId, visible: editState.visible }
          : c
      )
    );
    messageApi.success("Category updated.");
    setEditState(null);
  };

  const deleteCategory = (id: number) => {
    // Also delete all descendants
    const toDelete = new Set<number>();
    const collect = (pid: number) => {
      toDelete.add(pid);
      categories.filter(c => c.parentId === pid).forEach(c => collect(c.id));
    };
    collect(id);
    setCategories(prev => prev.filter(c => !toDelete.has(c.id)));
    messageApi.success("Category deleted.");
    if (editState?.id && toDelete.has(editState.id)) setEditState(null);
  };

  const createCategory = () => {
    form.validateFields().then(values => {
      const now = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      const newCat: CategoryItem = {
        id: nextId++,
        name: values.name.trim(),
        slug: values.slug || toSlug(values.name),
        parentId: values.parentId ?? null,
        productCount: 0,
        visible: values.visible ?? true,
        order: 99,
        createdAt: now,
      };
      setCategories(prev => [...prev, newCat]);
      messageApi.success(`Category "${newCat.name}" created.`);
      setDrawerOpen(false);
      form.resetFields();
    });
  };

  // ── Columns ──
  const treeOptions = useMemo(() => buildTreeOptions(categories, editState?.id), [categories, editState]);

  const columns: ColumnsType<CategoryItem> = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_: string, record) => {
        const indent = (record.level ?? 0) * 24;
        const isEditing = editState?.id === record.id;
        const hasChildren = categories.some(c => c.parentId === record.id);

        return (
          <div style={{ paddingLeft: indent, display: "flex", alignItems: "center", gap: 8 }}>
            {/* Tree line indicator */}
            {(record.level ?? 0) > 0 && (
              <span style={{ color: "#d0d0d0", fontSize: 12, marginRight: 2, userSelect: "none" }}>└</span>
            )}
            {hasChildren
              ? <FolderOpenOutlined style={{ color: "#fa8c16", fontSize: 15 }} />
              : <FolderOutlined style={{ color: "#aaa", fontSize: 14 }} />
            }

            {isEditing ? (
              <Input
                size="small"
                value={editState.name}
                autoFocus
                onChange={e => setEditState(s => s ? { ...s, name: e.target.value, slug: toSlug(e.target.value) } : s)}
                onPressEnter={saveEdit}
                style={{ width: 180 }}
              />
            ) : (
              <Text strong={record.level === 0} style={{ fontSize: 14 }}>{record.name}</Text>
            )}

            {hasChildren && !isEditing && (
              <Tag style={{ fontSize: 10, padding: "0 5px", marginLeft: 2 }}>
                {countWithChildren(categories, record.id)} sub
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Path",
      render: (_: any, record) =>
        editState?.id === record.id ? (
          <TreeSelect
            size="small"
            style={{ width: 200 }}
            value={editState.parentId ?? undefined}
            treeData={treeOptions}
            placeholder="None (top level)"
            allowClear
            onChange={v => setEditState(s => s ? { ...s, parentId: v ?? null } : s)}
            treeDefaultExpandAll
          />
        ) : (
          <CategoryPath item={record} all={categories} />
        ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      render: (slug: string, record) =>
        editState?.id === record.id ? (
          <Input
            size="small"
            value={editState.slug}
            onChange={e => setEditState(s => s ? { ...s, slug: e.target.value } : s)}
            style={{ fontFamily: "monospace", fontSize: 12, width: 180 }}
          />
        ) : (
          <Text style={{ fontFamily: "monospace", fontSize: 12, color: "#aaa" }}>{slug}</Text>
        ),
    },
    {
      title: "Products",
      dataIndex: "productCount",
      width: 90,
      sorter: (a, b) => a.productCount - b.productCount,
      render: (n: number) => (
        <Badge count={n} showZero style={{ backgroundColor: n === 0 ? "#e8e8e8" : "#1d1d1d", color: n === 0 ? "#999" : "#fff" }} />
      ),
    },
    {
      title: "Visible",
      dataIndex: "visible",
      width: 80,
      render: (v: boolean, record) =>
        editState?.id === record.id ? (
          <Switch
            size="small"
            checked={editState.visible}
            onChange={val => setEditState(s => s ? { ...s, visible: val } : s)}
          />
        ) : (
          <Badge status={v ? "success" : "default"} text={v ? "On" : "Off"} />
        ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      width: 120,
      render: (d: string) => <Text type="secondary" style={{ fontSize: 12 }}>{d}</Text>,
    },
    {
      title: "Action",
      width: 110,
      render: (_: any, record) =>
        editState?.id === record.id ? (
          <Space>
            <Tooltip title="Save (Enter)">
              <Button size="small" type="primary" icon={<CheckOutlined />} onClick={saveEdit}
                disabled={!editState.name.trim()}
                style={{ background: "#1d1d1d", borderColor: "#1d1d1d" }} />
            </Tooltip>
            <Tooltip title="Cancel">
              <Button size="small" icon={<CloseOutlined />} onClick={cancelEdit} />
            </Tooltip>
          </Space>
        ) : (
          <Space>
            <Tooltip title="Edit">
              <Button type="text" size="small" icon={<EditOutlined />}
                onClick={() => startEdit(record)} disabled={!!editState} />
            </Tooltip>
            <Tooltip title="Add child">
              <Button type="text" size="small" icon={<PlusOutlined />} disabled={!!editState}
                onClick={() => {
                  form.setFieldsValue({ parentId: record.id });
                  setDrawerOpen(true);
                }}
              />
            </Tooltip>
            <Popconfirm
              title={`Delete "${record.name}"?`}
              description={
                categories.some(c => c.parentId === record.id)
                  ? "All child categories will also be deleted."
                  : undefined
              }
              okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}
              onConfirm={() => deleteCategory(record.id)}
            >
              <Button type="text" size="small" danger icon={<DeleteOutlined />} disabled={!!editState} />
            </Popconfirm>
          </Space>
        ),
    },
  ];

  // Stats
  const totalProducts = categories.reduce((s, c) => s + c.productCount, 0);
  const roots = categories.filter(c => c.parentId === null).length;
  const hidden = categories.filter(c => !c.visible).length;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: { colorPrimary: "#1d1d1d", borderRadius: 8, fontFamily: "'DM Sans', sans-serif" },
        components: {
          Menu:  { itemSelectedBg: "#f5f5f5", itemSelectedColor: "#1d1d1d" },
          Table: { headerBg: "#fafafa" },
        },
      }}
    >
      {ctx}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .editing-row td { background: #fffbf0 !important; }
        .level-0 td:first-child { font-weight: 600; }
        .level-1 td { background: #fafafa; }
        .level-2 td { background: #f7f7f7; }
      `}</style>

      <Layout style={{ minHeight: "100vh" }}>

        {/* ── Sider ── */}
        <Sider width={220} style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}>
          <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f5f5f5" }}>
            <Space>
              <Avatar size={32} style={{ background: "#1d1d1d", fontWeight: 700, fontSize: 13 }}>É</Avatar>
              <Text strong style={{ fontSize: 15 }}>Éclat Studio</Text>
            </Space>
          </div>
          <Menu mode="inline" defaultSelectedKeys={["categories"]} style={{ border: "none", marginTop: 8 }} items={NAV_ITEMS} />
        </Sider>

        <Layout>
          {/* ── Header ── */}
          <Header style={{ background: "#fff", padding: "0 24px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Space>
              <TagsOutlined style={{ fontSize: 18, color: "#888" }} />
              <Breadcrumb items={[{ title: "Catalogue" }, { title: "Categories" }]} />
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setDrawerOpen(true); }}
              style={{ background: "#1d1d1d", borderColor: "#1d1d1d" }}>
              New Category
            </Button>
          </Header>

          <Content style={{ padding: 24, background: "#f8f8f7" }}>

            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
              {[
                { label: "Total Categories", value: categories.length },
                { label: "Top-level",         value: roots },
                { label: "Hidden",            value: hidden },
                { label: "Products Tagged",   value: totalProducts },
              ].map(s => (
                <Col span={6} key={s.label}>
                  <Card bordered={false} style={{ borderRadius: 10 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "#1d1d1d" }}>{s.value}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{s.label}</Text>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Tree visual overview */}
            <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16 }}
              title={<Text strong>Tree Overview</Text>}
              extra={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Click a category name in the table to edit inline
                </Text>
              }
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {categories.filter(c => c.parentId === null).map(root => {
                  const l1 = categories.filter(c => c.parentId === root.id);
                  return (
                    <div key={root.id} style={{ minWidth: 160, background: "#f8f8f7", borderRadius: 8, padding: "12px 14px", border: "1px solid #f0f0f0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                        <FolderOpenOutlined style={{ color: "#fa8c16" }} />
                        <Text strong style={{ fontSize: 13 }}>{root.name}</Text>
                      </div>
                      {l1.map(child => {
                        const l2 = categories.filter(c => c.parentId === child.id);
                        return (
                          <div key={child.id} style={{ paddingLeft: 14, marginBottom: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: l2.length ? 4 : 0 }}>
                              <RightOutlined style={{ fontSize: 8, color: "#ccc" }} />
                              <FolderOutlined style={{ color: "#aaa", fontSize: 12 }} />
                              <Text style={{ fontSize: 12, color: "#555" }}>{child.name}</Text>
                            </div>
                            {l2.map(leaf => (
                              <div key={leaf.id} style={{ paddingLeft: 20, display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                                <RightOutlined style={{ fontSize: 7, color: "#ddd" }} />
                                <Text style={{ fontSize: 11, color: "#aaa" }}>{leaf.name}</Text>
                                {!leaf.visible && <Tag style={{ fontSize: 9, padding: "0 4px", marginLeft: 0 }}>hidden</Tag>}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Table */}
            <Card
              bordered={false}
              style={{ borderRadius: 10 }}
              title={
                <Row justify="space-between" align="middle" style={{ width: "100%" }}>
                  <Text strong>All Categories</Text>
                  <Input
                    prefix={<SearchOutlined style={{ color: "#ccc" }} />}
                    placeholder="Search name or slug…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    allowClear
                    style={{ width: 240 }}
                    size="small"
                  />
                </Row>
              }
            >
              {editState && (
                <Alert
                  type="warning"
                  showIcon
                  style={{ marginBottom: 12, borderRadius: 8 }}
                  message={
                    <Space>
                      <Text>Editing <Text strong>"{editState.name}"</Text></Text>
                      <Divider type="vertical" />
                      <kbd style={{ background: "#f0f0f0", padding: "1px 6px", borderRadius: 3, fontSize: 12 }}>Enter</kbd>
                      <Text style={{ fontSize: 12 }}>to save</Text>
                      <Button size="small" onClick={cancelEdit}>Cancel</Button>
                      <Button size="small" type="primary" onClick={saveEdit}
                        style={{ background: "#1d1d1d", borderColor: "#1d1d1d" }}>Save</Button>
                    </Space>
                  }
                />
              )}

              <Table
                columns={columns}
                dataSource={filtered}
                rowKey="id"
                size="middle"
                pagination={{ pageSize: 15, showTotal: t => `${t} categories`, showSizeChanger: false }}
                rowClassName={record => {
                  if (editState?.id === record.id) return "editing-row";
                  if (record.level === 0) return "level-0";
                  if (record.level === 1) return "level-1";
                  return "level-2";
                }}
                locale={{
                  emptyText: <Empty description={<Text type="secondary">No categories found</Text>} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
                }}
              />
            </Card>
          </Content>
        </Layout>
      </Layout>

      {/* ── Create Drawer ── */}
      <Drawer
        title={
          <Space>
            <TagsOutlined />
            New Category
          </Space>
        }
        placement="right"
        width={420}
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); form.resetFields(); }}
        footer={
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => { setDrawerOpen(false); form.resetFields(); }}>Cancel</Button>
            <Button type="primary" icon={<CheckOutlined />} onClick={createCategory}
              style={{ background: "#1d1d1d", borderColor: "#1d1d1d" }}>
              Create Category
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" initialValues={{ visible: true }}>
          <Form.Item name="name" label={<Text strong>Name</Text>}
            rules={[{ required: true, message: "Category name is required" }]}>
            <Input
              placeholder="e.g. T-Shirts"
              onChange={e => form.setFieldValue("slug", toSlug(e.target.value))}
            />
          </Form.Item>

          <Form.Item name="slug" label="Slug"
            extra={<Text type="secondary" style={{ fontSize: 12 }}>Auto-generated from name. Editable.</Text>}>
            <Input style={{ fontFamily: "monospace" }} placeholder="e.g. t-shirts" />
          </Form.Item>

          <Form.Item name="parentId" label="Parent Category"
            extra={<Text type="secondary" style={{ fontSize: 12 }}>Leave empty to create a top-level category.</Text>}>
            <TreeSelect
              treeData={buildTreeOptions(categories)}
              placeholder="None (top level)"
              allowClear
              treeDefaultExpandAll
              style={{ width: "100%" }}
            />
          </Form.Item>

          {/* Path preview */}
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => {
              const parentId = getFieldValue("parentId");
              const name     = getFieldValue("name") || "…";
              const buildPath = (pid: number | null): string[] => {
                if (!pid) return [];
                const p = categories.find(c => c.id === pid);
                if (!p) return [];
                return [...buildPath(p.parentId), p.name];
              };
              const path = [...buildPath(parentId), name];
              return (
                <div style={{ background: "#f8f8f7", borderRadius: 8, padding: "10px 14px", marginBottom: 16, border: "1px solid #f0f0f0" }}>
                  <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 6, letterSpacing: ".1em", textTransform: "uppercase" }}>
                    Path Preview
                  </Text>
                  <Space size={4} wrap>
                    {path.map((p, i) => (
                      <Space key={i} size={4}>
                        {i > 0 && <RightOutlined style={{ fontSize: 9, color: "#bbb" }} />}
                        <Text style={{ fontSize: 13, color: i === path.length - 1 ? "#1d1d1d" : "#aaa", fontWeight: i === path.length - 1 ? 600 : 400 }}>
                          {p}
                        </Text>
                      </Space>
                    ))}
                  </Space>
                </div>
              );
            }}
          </Form.Item>

          <Form.Item name="visible" label="Visible on Store" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Divider />

          <Alert type="info" style={{ borderRadius: 8 }}
            message="You can add products to this category after it's created from the Products page." />
        </Form>
      </Drawer>
    </ConfigProvider>
  );
}
