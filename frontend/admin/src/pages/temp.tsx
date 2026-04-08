import { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Tag,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  ConfigProvider,
  theme,
  Breadcrumb,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Divider,
  Upload,
  Table,
  Tooltip,
  Popconfirm,
  Badge,
  Alert,
  Tabs,
  message,
  ColorPicker,
  Drawer,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  SettingOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  SaveOutlined,
  EyeOutlined,
  UploadOutlined,
  DragOutlined,
  WarningOutlined,
  CheckOutlined,
} from "@ant-design/icons";

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

// ── Types ─────────────────────────────────────────────────────────────────────
interface Variant {
  key: string;
  color: string;
  colorHex: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
}

// ── Initial data ──────────────────────────────────────────────────────────────
const INITIAL_VARIANTS: Variant[] = [
  { key: "1",  color: "Espresso", colorHex: "#3d3530", size: "XS", sku: "OUT-004-XS-ESP", price: 198, stock: 2 },
  { key: "2",  color: "Espresso", colorHex: "#3d3530", size: "S",  sku: "OUT-004-S-ESP",  price: 198, stock: 3 },
  { key: "3",  color: "Espresso", colorHex: "#3d3530", size: "M",  sku: "OUT-004-M-ESP",  price: 198, stock: 1 },
  { key: "4",  color: "Espresso", colorHex: "#3d3530", size: "L",  sku: "OUT-004-L-ESP",  price: 198, stock: 0 },
  { key: "5",  color: "Espresso", colorHex: "#3d3530", size: "XL", sku: "OUT-004-XL-ESP", price: 198, stock: 2 },
  { key: "6",  color: "Sand",     colorHex: "#c8b89a", size: "XS", sku: "OUT-004-XS-SND", price: 198, stock: 1 },
  { key: "7",  color: "Sand",     colorHex: "#c8b89a", size: "S",  sku: "OUT-004-S-SND",  price: 198, stock: 2 },
  { key: "8",  color: "Sand",     colorHex: "#c8b89a", size: "M",  sku: "OUT-004-M-SND",  price: 198, stock: 0 },
  { key: "9",  color: "Sand",     colorHex: "#c8b89a", size: "L",  sku: "OUT-004-L-SND",  price: 198, stock: 1 },
  { key: "10", color: "Sand",     colorHex: "#c8b89a", size: "XL", sku: "OUT-004-XL-SND", price: 198, stock: 0 },
];

const CATEGORIES = ["Tops","Bottoms","Outerwear","Dresses","Accessories","Footwear"];
const ALL_SIZES   = ["XS","S","M","L","XL","XXL","One Size","25","26","27","28","29","30","32","34","36","37","38","39","40","41"];
const ALL_TAGS    = ["Bestseller","New Arrival","Sustainable","Featured","Sale","Limited Edition"];

// ── Sider nav ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "home",     icon: <HomeOutlined />,     label: "Dashboard" },
  { key: "products", icon: <ShoppingOutlined />, label: "Products" },
  { key: "orders",   icon: <AppstoreOutlined />, label: "Orders" },
  { key: "stats",    icon: <BarChartOutlined />, label: "Analytics" },
  { key: "settings", icon: <SettingOutlined />,  label: "Settings" },
];

// ── Variant table columns factory ─────────────────────────────────────────────
function makeVariantColumns(
  onDelete: (key: string) => void,
  onEdit:   (key: string, field: keyof Variant, value: any) => void,
): ColumnsType<Variant> {
  return [
    {
      title: "",
      width: 28,
      render: () => <DragOutlined style={{ color: "#ccc", cursor: "grab" }} />,
    },
    {
      title: "Color",
      dataIndex: "color",
      width: 130,
      render: (color: string, r) => (
        <Space size={6}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", background: r.colorHex, display: "inline-block", border: "1px solid #e0e0e0" }} />
          <Text style={{ fontSize: 13 }}>{color}</Text>
        </Space>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      width: 70,
      render: (s: string) => <Tag style={{ fontSize: 12 }}>{s}</Tag>,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      render: (sku: string, r) => (
        <Input
          size="small"
          value={sku}
          onChange={e => onEdit(r.key, "sku", e.target.value)}
          style={{ fontFamily: "monospace", fontSize: 12 }}
        />
      ),
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      width: 110,
      render: (p: number, r) => (
        <InputNumber
          size="small"
          value={p}
          min={0}
          prefix="$"
          style={{ width: "100%" }}
          onChange={v => onEdit(r.key, "price", v)}
        />
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      width: 90,
      render: (stock: number, r) => (
        <InputNumber
          size="small"
          value={stock}
          min={0}
          style={{ width: "100%" }}
          onChange={v => onEdit(r.key, "stock", v)}
          status={stock === 0 ? "error" : stock <= 2 ? "warning" : undefined}
        />
      ),
    },
    {
      title: "",
      width: 40,
      render: (_, r) => (
        <Popconfirm title="Remove this variant?" okText="Yes" cancelText="No" okButtonProps={{ danger: true }} onConfirm={() => onDelete(r.key)}>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];
}

// ── Image placeholder card ────────────────────────────────────────────────────
function ImageCard({ emoji, active, onClick }: { emoji: string; active?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "100%", aspectRatio: "1", borderRadius: 8,
        background: "#f9f8f6", border: active ? "2px solid #1d1d1d" : "2px dashed #e0e0e0",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 38, cursor: "pointer", transition: "border .15s",
      }}
    >
      {emoji}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProductEdit() {
  const [form] = Form.useForm();
  const [variants, setVariants]         = useState<Variant[]>(INITIAL_VARIANTS);
  const [activeImg, setActiveImg]       = useState(0);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [newColor, setNewColor]         = useState("New Color");
  const [newColorHex, setNewColorHex]   = useState("#888888");
  const [newSizes, setNewSizes]         = useState<string[]>([]);
  const [savedBadge, setSavedBadge]     = useState(false);
  const [messageApi, contextHolder]     = message.useMessage();

  const IMAGES = ["🧥", "🧥", "🧥", "🧥", "🧥"];

  // variant helpers
  const deleteVariant = (key: string) =>
    setVariants(prev => prev.filter(v => v.key !== key));

  const editVariant = (key: string, field: keyof Variant, value: any) =>
    setVariants(prev => prev.map(v => v.key === key ? { ...v, [field]: value } : v));

  const addVariants = () => {
    if (!newColor || newSizes.length === 0) return;
    const nextKey = Date.now();
    const added: Variant[] = newSizes.map((size, i) => ({
      key: `${nextKey}-${i}`,
      color: newColor,
      colorHex: newColorHex,
      size,
      sku: `SKU-${newColor.substring(0,3).toUpperCase()}-${size}`,
      price: 198,
      stock: 0,
    }));
    setVariants(prev => [...prev, ...added]);
    setDrawerOpen(false);
    setNewSizes([]);
    messageApi.success(`Added ${added.length} variant(s) for ${newColor}`);
  };

  const handleSave = () => {
    form.validateFields().then(() => {
      setSavedBadge(true);
      messageApi.success("Product saved successfully!");
      setTimeout(() => setSavedBadge(false), 3000);
    }).catch(() => {
      messageApi.error("Please fix the validation errors before saving.");
    });
  };

  const lowStockCount = variants.filter(v => v.stock === 0).length;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: { colorPrimary: "#1d1d1d", borderRadius: 8, fontFamily: "'DM Sans', sans-serif" },
        components: {
          Menu:  { itemSelectedBg: "#f5f5f5", itemSelectedColor: "#1d1d1d" },
          Tabs:  { inkBarColor: "#1d1d1d", itemSelectedColor: "#1d1d1d" },
          Table: { headerBg: "#fafafa" },
        },
      }}
    >
      {contextHolder}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <Layout style={{ minHeight: "100vh" }}>

        {/* ── Sider ── */}
        <Sider width={220} style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}>
          <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f5f5f5" }}>
            <Space>
              <Avatar size={32} style={{ background: "#1d1d1d", fontWeight: 700, fontSize: 13 }}>É</Avatar>
              <Text strong style={{ fontSize: 15 }}>Éclat Studio</Text>
            </Space>
          </div>
          <Menu mode="inline" defaultSelectedKeys={["products"]} style={{ border: "none", marginTop: 8 }} items={NAV_ITEMS} />
        </Sider>

        <Layout>
          {/* ── Header ── */}
          <Header style={{ background: "#fff", padding: "0 24px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Space>
              <Button type="text" icon={<ArrowLeftOutlined />} style={{ color: "#888" }}>Back</Button>
              <Divider type="vertical" />
              <Breadcrumb items={[{ title: "Products" }, { title: "Wool Cocoon Coat" }, { title: "Edit" }]} />
            </Space>
            <Space>
              <Button icon={<EyeOutlined />}>Preview</Button>
              <Button
                type="primary"
                icon={savedBadge ? <CheckOutlined /> : <SaveOutlined />}
                onClick={handleSave}
                style={{ background: savedBadge ? "#52c41a" : "#1d1d1d", borderColor: savedBadge ? "#52c41a" : "#1d1d1d", transition: "all .3s" }}
              >
                {savedBadge ? "Saved!" : "Save Changes"}
              </Button>
            </Space>
          </Header>

          <Content style={{ padding: 24, background: "#f8f8f7" }}>

            {/* Low stock alert */}
            {lowStockCount > 0 && (
              <Alert
                icon={<WarningOutlined />}
                message={`${lowStockCount} variant${lowStockCount > 1 ? "s" : ""} are out of stock. Update inventory in the Variants tab.`}
                type="warning"
                showIcon
                closable
                style={{ marginBottom: 16, borderRadius: 8 }}
              />
            )}

            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: "Wool Cocoon Coat",
                category: "Outerwear",
                status: "Active",
                price: 198,
                comparePrice: 245,
                cost: 86,
                sku: "OUT-004",
                barcode: "0123456789012",
                weight: 1.2,
                tags: ["Bestseller", "Sustainable"],
                featured: true,
                allowReviews: true,
                visible: true,
                taxable: true,
                description: "A luxuriously oversized cocoon silhouette crafted from a premium boiled wool blend. Features a collarless neckline, dropped shoulders, and clean-finished seams. Fully lined in cupro for effortless dressing.",
                materials: "80% Merino Wool, 15% Recycled Polyester, 5% Nylon",
                care: "Dry clean only. Store folded, not hung.",
                origin: "Made in Portugal",
                metaTitle: "Wool Cocoon Coat — Éclat Studio",
                metaDesc: "Luxuriously oversized cocoon coat in boiled wool blend. Free shipping on orders over $150.",
              }}
            >
              <Row gutter={20} align="top">

                {/* ── LEFT column ── */}
                <Col span={9}>

                  {/* Images */}
                  <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16 }}>
                    <Text strong style={{ display: "block", marginBottom: 12 }}>Product Images</Text>
                    <div style={{ marginBottom: 10 }}>
                      <ImageCard emoji={IMAGES[activeImg]} active />
                    </div>
                    <Row gutter={8}>
                      {IMAGES.map((img, i) => (
                        <Col span={Math.floor(24 / IMAGES.length)} key={i}>
                          <ImageCard emoji={img} active={i === activeImg} onClick={() => setActiveImg(i)} />
                        </Col>
                      ))}
                    </Row>
                    <Upload showUploadList={false} beforeUpload={() => false} style={{ display: "block", marginTop: 12 }}>
                      <Button icon={<UploadOutlined />} block style={{ marginTop: 12 }}>Upload Images</Button>
                    </Upload>
                  </Card>

                  {/* Publishing */}
                  <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16 }} title={<Text strong>Publishing</Text>}>
                    <Space direction="vertical" style={{ width: "100%" }} size={14}>
                      <Form.Item name="status" label="Status" style={{ marginBottom: 0 }}>
                        <Select>
                          <Select.Option value="Active"><Badge status="success" text="Active" /></Select.Option>
                          <Select.Option value="Draft"><Badge status="warning" text="Draft" /></Select.Option>
                          <Select.Option value="Archived"><Badge status="default" text="Archived" /></Select.Option>
                        </Select>
                      </Form.Item>
                      <Divider style={{ margin: "4px 0" }} />
                      <Row justify="space-between" align="middle">
                        <Text style={{ fontSize: 13 }}>Featured</Text>
                        <Form.Item name="featured" valuePropName="checked" style={{ marginBottom: 0 }}>
                          <Switch size="small" style={{ background: "#1d1d1d" }} />
                        </Form.Item>
                      </Row>
                      <Row justify="space-between" align="middle">
                        <Text style={{ fontSize: 13 }}>Allow Reviews</Text>
                        <Form.Item name="allowReviews" valuePropName="checked" style={{ marginBottom: 0 }}>
                          <Switch size="small" style={{ background: "#1d1d1d" }} />
                        </Form.Item>
                      </Row>
                      <Row justify="space-between" align="middle">
                        <Text style={{ fontSize: 13 }}>Visible on Store</Text>
                        <Form.Item name="visible" valuePropName="checked" style={{ marginBottom: 0 }}>
                          <Switch size="small" style={{ background: "#1d1d1d" }} />
                        </Form.Item>
                      </Row>
                      <Row justify="space-between" align="middle">
                        <Text style={{ fontSize: 13 }}>Charge Tax</Text>
                        <Form.Item name="taxable" valuePropName="checked" style={{ marginBottom: 0 }}>
                          <Switch size="small" style={{ background: "#1d1d1d" }} />
                        </Form.Item>
                      </Row>
                    </Space>
                  </Card>

                  {/* Organisation */}
                  <Card bordered={false} style={{ borderRadius: 10 }} title={<Text strong>Organisation</Text>}>
                    <Space direction="vertical" style={{ width: "100%" }} size={0}>
                      <Form.Item name="category" label="Category">
                        <Select>
                          {CATEGORIES.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                        </Select>
                      </Form.Item>
                      <Form.Item name="tags" label="Tags">
                        <Select mode="multiple" placeholder="Add tags…">
                          {ALL_TAGS.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
                        </Select>
                      </Form.Item>
                    </Space>
                  </Card>

                </Col>

                {/* ── RIGHT column ── */}
                <Col span={15}>
                  <Card bordered={false} style={{ borderRadius: 10 }}>
                    <Tabs
                      defaultActiveKey="general"
                      items={[

                        /* ── General ── */
                        {
                          key: "general",
                          label: "General",
                          children: (
                            <Space direction="vertical" size={0} style={{ width: "100%" }}>
                              <Form.Item
                                name="name"
                                label={<Text strong>Product Name</Text>}
                                rules={[{ required: true, message: "Name is required" }]}
                              >
                                <Input size="large" placeholder="Product name" />
                              </Form.Item>

                              <Form.Item name="description" label={<Text strong>Description</Text>}>
                                <TextArea rows={4} placeholder="Describe the product…" />
                              </Form.Item>

                              <Row gutter={12}>
                                <Col span={8}>
                                  <Form.Item name="materials" label="Materials">
                                    <Input placeholder="e.g. 80% Cotton" />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item name="care" label="Care Instructions">
                                    <Input placeholder="e.g. Dry clean only" />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item name="origin" label="Country of Origin">
                                    <Input placeholder="e.g. Made in Italy" />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Space>
                          ),
                        },

                        /* ── Pricing ── */
                        {
                          key: "pricing",
                          label: "Pricing",
                          children: (
                            <Space direction="vertical" size={0} style={{ width: "100%" }}>
                              <Row gutter={12}>
                                <Col span={8}>
                                  <Form.Item
                                    name="price"
                                    label={<Text strong>Selling Price</Text>}
                                    rules={[{ required: true, message: "Required" }]}
                                  >
                                    <InputNumber prefix="$" min={0} style={{ width: "100%" }} />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item name="comparePrice" label="Compare-at Price">
                                    <InputNumber prefix="$" min={0} style={{ width: "100%" }} />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item name="cost" label="Cost per Unit">
                                    <InputNumber prefix="$" min={0} style={{ width: "100%" }} />
                                  </Form.Item>
                                </Col>
                              </Row>

                              <Form.Item name="taxRate" label="Tax Rate">
                                <Select defaultValue="vat10" style={{ width: 220 }}>
                                  <Select.Option value="vat10">VAT 10% — Included</Select.Option>
                                  <Select.Option value="vat5">VAT 5% — Included</Select.Option>
                                  <Select.Option value="exempt">Tax Exempt</Select.Option>
                                </Select>
                              </Form.Item>

                              {/* Margin preview */}
                              <Form.Item shouldUpdate noStyle>
                                {({ getFieldValue }) => {
                                  const price = getFieldValue("price") || 0;
                                  const cost  = getFieldValue("cost")  || 0;
                                  const margin = price > 0 ? (((price - cost) / price) * 100).toFixed(1) : "0.0";
                                  const profit = (price - cost).toFixed(2);
                                  return (
                                    <Alert
                                      type="info"
                                      style={{ borderRadius: 8 }}
                                      message={
                                        <Space split={<Divider type="vertical" />}>
                                          <Text>Gross Margin: <Text strong style={{ color: "#1677ff" }}>{margin}%</Text></Text>
                                          <Text>Profit per unit: <Text strong style={{ color: "#52c41a" }}>${profit}</Text></Text>
                                        </Space>
                                      }
                                    />
                                  );
                                }}
                              </Form.Item>
                            </Space>
                          ),
                        },

                        /* ── Inventory ── */
                        {
                          key: "inventory",
                          label: "Inventory",
                          children: (
                            <Space direction="vertical" size={0} style={{ width: "100%" }}>
                              <Row gutter={12}>
                                <Col span={12}>
                                  <Form.Item
                                    name="sku"
                                    label={<Text strong>Base SKU</Text>}
                                    rules={[{ required: true, message: "Required" }]}
                                  >
                                    <Input style={{ fontFamily: "monospace" }} />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item name="barcode" label="Barcode (ISBN / EAN)">
                                    <Input style={{ fontFamily: "monospace" }} />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Form.Item name="weight" label="Weight (kg)">
                                <InputNumber min={0} step={0.1} style={{ width: 140 }} />
                              </Form.Item>
                            </Space>
                          ),
                        },

                        /* ── Variants ── */
                        {
                          key: "variants",
                          label: (
                            <Space>
                              Variants
                              <Tag style={{ fontSize: 11, marginLeft: 0 }}>{variants.length}</Tag>
                              {lowStockCount > 0 && <Badge count={lowStockCount} size="small" />}
                            </Space>
                          ),
                          children: (
                            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                              <Row justify="space-between" align="middle">
                                <Text type="secondary" style={{ fontSize: 13 }}>
                                  Manage stock per color × size combination
                                </Text>
                                <Button
                                  type="dashed"
                                  icon={<PlusOutlined />}
                                  onClick={() => setDrawerOpen(true)}
                                >
                                  Add Variants
                                </Button>
                              </Row>
                              <Table
                                columns={makeVariantColumns(deleteVariant, editVariant)}
                                dataSource={variants}
                                rowKey="key"
                                pagination={false}
                                size="small"
                                scroll={{ y: 340 }}
                                rowClassName={r => r.stock === 0 ? "variant-row-oos" : ""}
                              />
                              <style>{`.variant-row-oos td { background: #fff7f7 !important; }`}</style>
                            </Space>
                          ),
                        },

                        /* ── SEO ── */
                        {
                          key: "seo",
                          label: "SEO",
                          children: (
                            <Space direction="vertical" size={0} style={{ width: "100%" }}>
                              <Form.Item name="metaTitle" label={<Text strong>Meta Title</Text>}
                                extra={<Text type="secondary" style={{ fontSize: 12 }}>Recommended: 50–60 characters</Text>}>
                                <Input showCount maxLength={70} />
                              </Form.Item>
                              <Form.Item name="metaDesc" label={<Text strong>Meta Description</Text>}
                                extra={<Text type="secondary" style={{ fontSize: 12 }}>Recommended: 150–160 characters</Text>}>
                                <TextArea rows={3} showCount maxLength={200} />
                              </Form.Item>
                              <Form.Item label="URL Handle">
                                <Input addonBefore="eclat.com/products/" defaultValue="wool-cocoon-coat" />
                              </Form.Item>

                              {/* SERP preview */}
                              <Form.Item label="Search Preview" shouldUpdate>
                                {({ getFieldValue }) => (
                                  <div style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "14px 16px", background: "#fafafa" }}>
                                    <div style={{ fontSize: 18, color: "#1a0dab", marginBottom: 2, fontFamily: "Arial, sans-serif" }}>
                                      {getFieldValue("metaTitle") || "Page Title"}
                                    </div>
                                    <div style={{ fontSize: 13, color: "#006621", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>
                                      https://eclat.com/products/wool-cocoon-coat
                                    </div>
                                    <div style={{ fontSize: 14, color: "#545454", fontFamily: "Arial, sans-serif", lineHeight: 1.5 }}>
                                      {getFieldValue("metaDesc") || "Meta description will appear here…"}
                                    </div>
                                  </div>
                                )}
                              </Form.Item>
                            </Space>
                          ),
                        },
                      ]}
                    />
                  </Card>

                  {/* Bottom action bar */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                    <Popconfirm title="Delete this product permanently?" okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
                      <Button danger icon={<DeleteOutlined />}>Delete Product</Button>
                    </Popconfirm>
                    <Space>
                      <Button>Discard Changes</Button>
                      <Button
                        type="primary"
                        icon={savedBadge ? <CheckOutlined /> : <SaveOutlined />}
                        onClick={handleSave}
                        style={{ background: savedBadge ? "#52c41a" : "#1d1d1d", borderColor: savedBadge ? "#52c41a" : "#1d1d1d", transition: "all .3s" }}
                      >
                        {savedBadge ? "Saved!" : "Save Changes"}
                      </Button>
                    </Space>
                  </div>
                </Col>
              </Row>
            </Form>
          </Content>
        </Layout>
      </Layout>

      {/* ── Add Variants Drawer ── */}
      <Drawer
        title="Add Variants"
        placement="right"
        width={380}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <Space style={{ justifyContent: "flex-end", display: "flex" }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              style={{ background: "#1d1d1d", borderColor: "#1d1d1d" }}
              disabled={!newColor || newSizes.length === 0}
              onClick={addVariants}
            >
              Add {newSizes.length > 0 ? `${newSizes.length} Variant${newSizes.length > 1 ? "s" : ""}` : "Variants"}
            </Button>
          </Space>
        }
      >
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>Color Name</Text>
            <Input value={newColor} onChange={e => setNewColor(e.target.value)} placeholder="e.g. Midnight Navy" />
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>Color Swatch</Text>
            <Space>
              <ColorPicker value={newColorHex} onChange={(_, hex) => setNewColorHex(hex)} />
              <Text type="secondary" style={{ fontFamily: "monospace", fontSize: 13 }}>{newColorHex}</Text>
            </Space>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>Sizes</Text>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select sizes to add…"
              value={newSizes}
              onChange={setNewSizes}
            >
              {ALL_SIZES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
            </Select>
          </div>

          {newSizes.length > 0 && (
            <Alert
              type="info"
              style={{ borderRadius: 8 }}
              message={
                <div>
                  <Text strong>{newSizes.length}</Text> variant{newSizes.length > 1 ? "s" : ""} will be added for{" "}
                  <Space size={4}>
                    <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: newColorHex, border: "1px solid #e0e0e0", verticalAlign: "middle" }} />
                    <Text strong>{newColor}</Text>
                  </Space>
                </div>
              }
            />
          )}
        </Space>
      </Drawer>
    </ConfigProvider>
  );
}
