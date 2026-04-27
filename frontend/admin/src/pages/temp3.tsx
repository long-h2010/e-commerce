import { useState } from "react";
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
  Tag,
  Steps,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload";
import {
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
  InboxOutlined,
  DragOutlined,
  CheckOutlined,
  SendOutlined,
} from "@ant-design/icons";

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

// ── Types ──────────────────────────────────────────────────────────────────────
interface Variant {
  key: string;
  color: string;
  colorHex: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const CATEGORIES = ["Tops","Bottoms","Outerwear","Dresses","Accessories","Footwear"];
const ALL_SIZES   = ["XS","S","M","L","XL","XXL","One Size","25","26","27","28","29","30","32","34","36","37","38","39","40","41"];
const ALL_TAGS    = ["Bestseller","New Arrival","Sustainable","Featured","Sale","Limited Edition"];
const NAV_ITEMS   = [
  { key: "home",     icon: <HomeOutlined />,     label: "Dashboard" },
  { key: "products", icon: <ShoppingOutlined />, label: "Products" },
  { key: "orders",   icon: <AppstoreOutlined />, label: "Orders" },
  { key: "stats",    icon: <BarChartOutlined />, label: "Analytics" },
  { key: "settings", icon: <SettingOutlined />,  label: "Settings" },
];

// ── Variant table columns ──────────────────────────────────────────────────────
function makeVariantColumns(
  onDelete: (key: string) => void,
  onChange: (key: string, field: keyof Variant, value: any) => void,
): ColumnsType<Variant> {
  return [
    {
      title: "", width: 28,
      render: () => <DragOutlined style={{ color: "#ccc", cursor: "grab" }} />,
    },
    {
      title: "Color", dataIndex: "color", width: 130,
      render: (color: string, r) => (
        <Space size={6}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", background: r.colorHex, display: "inline-block", border: "1px solid #e0e0e0" }} />
          <Text style={{ fontSize: 13 }}>{color}</Text>
        </Space>
      ),
    },
    {
      title: "Size", dataIndex: "size", width: 70,
      render: (s: string) => <Tag style={{ fontSize: 12 }}>{s}</Tag>,
    },
    {
      title: "SKU", dataIndex: "sku",
      render: (sku: string, r) => (
        <Input size="small" value={sku} onChange={e => onChange(r.key, "sku", e.target.value)}
          style={{ fontFamily: "monospace", fontSize: 12 }} />
      ),
    },
    {
      title: "Price ($)", dataIndex: "price", width: 110,
      render: (p: number, r) => (
        <InputNumber size="small" value={p} min={0} prefix="$" style={{ width: "100%" }}
          onChange={v => onChange(r.key, "price", v)} />
      ),
    },
    {
      title: "Stock", dataIndex: "stock", width: 90,
      render: (stock: number, r) => (
        <InputNumber size="small" value={stock} min={0} style={{ width: "100%" }}
          onChange={v => onChange(r.key, "stock", v)}
          status={stock === 0 ? "error" : stock <= 2 ? "warning" : undefined} />
      ),
    },
    {
      title: "", width: 40,
      render: (_, r) => (
        <Popconfirm title="Remove variant?" okText="Yes" cancelText="No" okButtonProps={{ danger: true }} onConfirm={() => onDelete(r.key)}>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Temp() {
  const [form] = Form.useForm();
  const [variants, setVariants]       = useState<Variant[]>([]);
  const [fileList, setFileList]       = useState<UploadFile[]>([]);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [newColor, setNewColor]       = useState("Color Name");
  const [newColorHex, setNewColorHex] = useState("#888888");
  const [newSizes, setNewSizes]       = useState<string[]>([]);
  const [newPrice, setNewPrice]       = useState<number>(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [messageApi, ctx]             = message.useMessage();

  // variant helpers
  const deleteVariant = (key: string) => setVariants(p => p.filter(v => v.key !== key));
  const changeVariant = (key: string, field: keyof Variant, value: any) =>
    setVariants(p => p.map(v => v.key === key ? { ...v, [field]: value } : v));

  const addVariants = () => {
    if (!newColor || newSizes.length === 0) return;
    const base = Date.now();
    const added: Variant[] = newSizes.map((size, i) => ({
      key: `${base}-${i}`,
      color: newColor,
      colorHex: newColorHex,
      size,
      sku: `SKU-${newColor.replace(/\s+/g, "").substring(0, 3).toUpperCase()}-${size}`,
      price: newPrice || 0,
      stock: 0,
    }));
    setVariants(p => [...p, ...added]);
    setDrawerOpen(false);
    setNewSizes([]);
    messageApi.success(`Added ${added.length} variant(s) for "${newColor}"`);
  };

  const handleSaveDraft = () => {
    messageApi.info("Draft saved.");
  };

  const handlePublish = () => {
    form.validateFields()
      .then(() => {
        messageApi.success({ content: "Product published successfully!", duration: 3 });
      })
      .catch(() => {
        messageApi.error("Please complete all required fields.");
      });
  };

  // step validation hint
  const stepStatus = [
    form.getFieldValue("name") ? "finish" : "process",
    fileList.length > 0 ? "finish" : "process",
    variants.length > 0 ? "finish" : "process",
  ];

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
      {ctx}
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
              <Button type="text" icon={<ArrowLeftOutlined />} style={{ color: "#888" }}>Products</Button>
              <Divider type="vertical" />
              <Breadcrumb items={[{ title: "Products" }, { title: "New Product" }]} />
            </Space>
            <Space>
              <Button icon={<SaveOutlined />} onClick={handleSaveDraft}>Save Draft</Button>
              <Button type="primary" icon={<SendOutlined />} onClick={handlePublish}
                style={{ background: "#1d1d1d", borderColor: "#1d1d1d" }}>
                Publish
              </Button>
            </Space>
          </Header>

          <Content style={{ padding: 24, background: "#f8f8f7" }}>

            {/* Progress steps */}
            <Card bordered={false} style={{ borderRadius: 10, marginBottom: 20 }}>
              <Steps
                current={currentStep}
                onChange={setCurrentStep}
                size="small"
                items={[
                  { title: "Basic Info",  description: "Name, description, category",  icon: variants.length > 0 || form.getFieldValue("name") ? <CheckOutlined /> : undefined },
                  { title: "Media",       description: "Upload product images" },
                  { title: "Pricing",     description: "Set price & cost" },
                  { title: "Variants",    description: "Colors & sizes",               icon: variants.length > 0 ? <CheckOutlined /> : undefined },
                  { title: "SEO",         description: "Meta & discoverability" },
                ]}
              />
            </Card>

            <Form
              form={form}
              layout="vertical"
              initialValues={{
                status: "Draft",
                featured: false,
                allowReviews: true,
                visible: false,
                taxable: true,
                taxRate: "vat10",
                weight: 0,
              }}
            >
              <Row gutter={20} align="top">

                {/* ── LEFT ── */}
                <Col span={9}>

                  {/* Upload images */}
                  <Card
                    bordered={false}
                    style={{ borderRadius: 10, marginBottom: 16 }}
                    title={
                      <Space>
                        <Text strong>Product Images</Text>
                        {fileList.length > 0 && <Tag color="green">{fileList.length} uploaded</Tag>}
                      </Space>
                    }
                  >
                    <Dragger
                      multiple
                      listType="picture"
                      fileList={fileList}
                      beforeUpload={() => false}
                      onChange={({ fileList: fl }) => setFileList(fl)}
                      style={{ borderRadius: 8 }}
                    >
                      <p style={{ fontSize: 36, marginBottom: 8 }}><InboxOutlined style={{ color: "#ccc" }} /></p>
                      <p style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>Drag & drop images here</p>
                      <p style={{ fontSize: 12, color: "#aaa" }}>PNG, JPG, WEBP — max 5 MB each</p>
                    </Dragger>
                    {fileList.length === 0 && (
                      <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 10, textAlign: "center" }}>
                        Recommended: at least 3 images, square ratio
                      </Text>
                    )}
                  </Card>

                  {/* Publishing */}
                  <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16 }} title={<Text strong>Publishing</Text>}>
                    <Space direction="vertical" style={{ width: "100%" }} size={14}>
                      <Form.Item name="status" label="Status" style={{ marginBottom: 0 }}>
                        <Select>
                          <Select.Option value="Draft"><Badge status="warning" text="Draft" /></Select.Option>
                          <Select.Option value="Active"><Badge status="success" text="Active" /></Select.Option>
                          <Select.Option value="Archived"><Badge status="default" text="Archived" /></Select.Option>
                        </Select>
                      </Form.Item>
                      <Divider style={{ margin: "4px 0" }} />
                      {[
                        { name: "featured",     label: "Featured Product" },
                        { name: "allowReviews", label: "Allow Reviews" },
                        { name: "visible",      label: "Visible on Store" },
                        { name: "taxable",      label: "Charge Tax" },
                      ].map(({ name, label }) => (
                        <Row key={name} justify="space-between" align="middle">
                          <Text style={{ fontSize: 13 }}>{label}</Text>
                          <Form.Item name={name} valuePropName="checked" style={{ marginBottom: 0 }}>
                            <Switch size="small" />
                          </Form.Item>
                        </Row>
                      ))}
                    </Space>
                  </Card>

                  {/* Organisation */}
                  <Card bordered={false} style={{ borderRadius: 10 }} title={<Text strong>Organisation</Text>}>
                    <Space direction="vertical" style={{ width: "100%" }} size={0}>
                      <Form.Item name="category" label="Category"
                        rules={[{ required: true, message: "Please select a category" }]}>
                        <Select placeholder="Select category…">
                          {CATEGORIES.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                        </Select>
                      </Form.Item>
                      <Form.Item name="tags" label="Tags">
                        <Select mode="multiple" placeholder="Add tags…">
                          {ALL_TAGS.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
                        </Select>
                      </Form.Item>
                      <Form.Item name="vendor" label="Vendor / Brand">
                        <Input placeholder="e.g. Éclat Studio" />
                      </Form.Item>
                    </Space>
                  </Card>
                </Col>

                {/* ── RIGHT ── */}
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
                                rules={[{ required: true, message: "Product name is required" }]}
                              >
                                <Input size="large" placeholder="e.g. Wool Cocoon Coat" maxLength={120} showCount />
                              </Form.Item>

                              <Form.Item name="description" label={<Text strong>Description</Text>}>
                                <TextArea rows={5} placeholder="Describe the product — materials, fit, styling notes…" />
                              </Form.Item>

                              <Row gutter={12}>
                                <Col span={8}>
                                  <Form.Item name="materials" label="Materials">
                                    <Input placeholder="e.g. 80% Cotton, 20% Polyester" />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item name="care" label="Care Instructions">
                                    <Input placeholder="e.g. Machine wash cold" />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item name="origin" label="Country of Origin">
                                    <Input placeholder="e.g. Made in Portugal" />
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
                                  <Form.Item name="price" label={<Text strong>Selling Price</Text>}
                                    rules={[{ required: true, message: "Required" }]}>
                                    <InputNumber prefix="$" min={0} style={{ width: "100%" }}
                                      onChange={v => setNewPrice(v || 0)} />
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
                                <Select style={{ width: 220 }}>
                                  <Select.Option value="vat10">VAT 10% — Included</Select.Option>
                                  <Select.Option value="vat5">VAT 5% — Included</Select.Option>
                                  <Select.Option value="exempt">Tax Exempt</Select.Option>
                                </Select>
                              </Form.Item>

                              {/* Live margin preview */}
                              <Form.Item shouldUpdate noStyle>
                                {({ getFieldValue }) => {
                                  const price = getFieldValue("price") || 0;
                                  const cost  = getFieldValue("cost")  || 0;
                                  const cmp   = getFieldValue("comparePrice") || 0;
                                  const margin = price > 0 ? (((price - cost) / price) * 100).toFixed(1) : "—";
                                  const profit = price > 0 ? `$${(price - cost).toFixed(2)}` : "—";
                                  const discount = price > 0 && cmp > 0 ? `${Math.round(((cmp - price) / cmp) * 100)}% off` : null;
                                  return (
                                    <Alert type="info" style={{ borderRadius: 8 }}
                                      message={
                                        <Space split={<Divider type="vertical" />}>
                                          <Text>Margin: <Text strong style={{ color: "#1677ff" }}>{margin}{margin !== "—" ? "%" : ""}</Text></Text>
                                          <Text>Profit/unit: <Text strong style={{ color: "#52c41a" }}>{profit}</Text></Text>
                                          {discount && <Text>Discount badge: <Text strong style={{ color: "#d4380d" }}>{discount}</Text></Text>}
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
                                  <Form.Item name="sku" label={<Text strong>Base SKU</Text>}
                                    rules={[{ required: true, message: "SKU is required" }]}>
                                    <Input style={{ fontFamily: "monospace" }} placeholder="e.g. OUT-001" />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item name="barcode" label="Barcode (EAN / ISBN)">
                                    <Input style={{ fontFamily: "monospace" }} placeholder="13-digit barcode" />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={12}>
                                <Col span={8}>
                                  <Form.Item name="weight" label="Weight (kg)">
                                    <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item name="stockGlobal" label="Initial Stock (global)">
                                    <InputNumber min={0} style={{ width: "100%" }}
                                      placeholder="0 if using variants" />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Alert type="info" style={{ borderRadius: 8, marginTop: 4 }}
                                message="If you set up variants below, per-variant stock will override the global stock field." />
                            </Space>
                          ),
                        },

                        /* ── Variants ── */
                        {
                          key: "variants",
                          label: (
                            <Space>
                              Variants
                              {variants.length > 0
                                ? <Tag color="green" style={{ fontSize: 11, marginLeft: 0 }}>{variants.length}</Tag>
                                : <Tag style={{ fontSize: 11, marginLeft: 0 }}>0</Tag>}
                            </Space>
                          ),
                          children: (
                            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                              <Row justify="space-between" align="middle">
                                <Text type="secondary" style={{ fontSize: 13 }}>
                                  Add color × size combinations. Stock can be set per variant.
                                </Text>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}
                                  style={{ background: "#1d1d1d", borderColor: "#1d1d1d" }}>
                                  Add Variants
                                </Button>
                              </Row>

                              {variants.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "48px 0", color: "#bbb", border: "2px dashed #f0f0f0", borderRadius: 8 }}>
                                  <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>
                                  <Text type="secondary">No variants yet. Click "Add Variants" to get started.</Text>
                                </div>
                              ) : (
                                <>
                                  <Table
                                    columns={makeVariantColumns(deleteVariant, changeVariant)}
                                    dataSource={variants}
                                    rowKey="key"
                                    pagination={false}
                                    size="small"
                                    scroll={{ y: 300 }}
                                    rowClassName={r => r.stock === 0 ? "variant-oos" : ""}
                                  />
                                  <style>{`.variant-oos td { background: #fff7f7 !important; }`}</style>
                                  <Row justify="end">
                                    <Popconfirm title="Clear all variants?" okText="Yes" cancelText="No" okButtonProps={{ danger: true }}
                                      onConfirm={() => setVariants([])}>
                                      <Button danger size="small" icon={<DeleteOutlined />}>Clear all</Button>
                                    </Popconfirm>
                                  </Row>
                                </>
                              )}
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
                                <Input showCount maxLength={70} placeholder="e.g. Wool Cocoon Coat — Éclat Studio" />
                              </Form.Item>
                              <Form.Item name="metaDesc" label={<Text strong>Meta Description</Text>}
                                extra={<Text type="secondary" style={{ fontSize: 12 }}>Recommended: 150–160 characters</Text>}>
                                <TextArea rows={3} showCount maxLength={200}
                                  placeholder="A brief description for search engines…" />
                              </Form.Item>
                              <Form.Item label="URL Handle">
                                <Input addonBefore="eclat.com/products/" placeholder="wool-cocoon-coat" />
                              </Form.Item>

                              {/* SERP preview */}
                              <Form.Item label="Search Preview" shouldUpdate>
                                {({ getFieldValue }) => {
                                  const title = getFieldValue("metaTitle");
                                  const desc  = getFieldValue("metaDesc");
                                  return (
                                    <div style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: "14px 16px", background: "#fafafa" }}>
                                      <div style={{ fontSize: 18, color: "#1a0dab", marginBottom: 2, fontFamily: "Arial, sans-serif" }}>
                                        {title || <span style={{ color: "#ccc" }}>Page title…</span>}
                                      </div>
                                      <div style={{ fontSize: 13, color: "#006621", marginBottom: 4, fontFamily: "Arial, sans-serif" }}>
                                        https://eclat.com/products/your-product-slug
                                      </div>
                                      <div style={{ fontSize: 14, color: "#545454", fontFamily: "Arial, sans-serif", lineHeight: 1.5 }}>
                                        {desc || <span style={{ color: "#ccc" }}>Meta description will appear here…</span>}
                                      </div>
                                    </div>
                                  );
                                }}
                              </Form.Item>
                            </Space>
                          ),
                        },
                      ]}
                    />
                  </Card>

                  {/* Bottom action bar */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                    <Button onClick={() => form.resetFields()}>Reset Form</Button>
                    <Space>
                      <Button icon={<SaveOutlined />} onClick={handleSaveDraft}>Save Draft</Button>
                      <Button type="primary" icon={<SendOutlined />} onClick={handlePublish}
                        style={{ background: "#1d1d1d", borderColor: "#1d1d1d" }}>
                        Publish Product
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
        width={400}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
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
            <Input
              value={newColor}
              onChange={e => setNewColor(e.target.value)}
              placeholder="e.g. Midnight Navy"
            />
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
              placeholder="Select sizes…"
              value={newSizes}
              onChange={setNewSizes}
            >
              {ALL_SIZES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
            </Select>
          </div>
          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>Price (per variant)</Text>
            <InputNumber
              prefix="$"
              min={0}
              style={{ width: "100%" }}
              value={newPrice}
              onChange={v => setNewPrice(v || 0)}
              placeholder="Inherits from Pricing tab if empty"
            />
          </div>

          {newSizes.length > 0 && (
            <Alert type="info" style={{ borderRadius: 8 }}
              message={
                <div>
                  <Text strong>{newSizes.length}</Text> variant{newSizes.length > 1 ? "s" : ""} will be created for{" "}
                  <Space size={4}>
                    <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: newColorHex, border: "1px solid #e0e0e0", verticalAlign: "middle" }} />
                    <Text strong>{newColor}</Text>
                  </Space>
                  : {newSizes.map(s => <Tag key={s} style={{ fontSize: 11 }}>{s}</Tag>)}
                </div>
              }
            />
          )}
        </Space>
      </Drawer>
    </ConfigProvider>
  );
}
