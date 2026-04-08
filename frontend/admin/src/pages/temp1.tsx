// import { useState } from "react";
// import {
//   Layout,
//   Menu,
//   Button,
//   Tag,
//   Space,
//   Typography,
//   Card,
//   Row,
//   Col,
//   Badge,
//   Avatar,
//   Tooltip,
//   Popconfirm,
//   ConfigProvider,
//   theme,
//   Breadcrumb,
//   Descriptions,
//   Tabs,
//   Table,
//   Rate,
//   Progress,
//   Statistic,
//   Timeline,
//   Image,
//   Divider,
//   Select,
//   InputNumber,
//   Switch,
// } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   AppstoreOutlined,
//   BarChartOutlined,
//   ShoppingOutlined,
//   SettingOutlined,
//   HomeOutlined,
//   ArrowLeftOutlined,
//   CheckCircleOutlined,
//   ClockCircleOutlined,
//   StarFilled,
//   TagOutlined,
//   InboxOutlined,
//   ShoppingCartOutlined,
//   EyeOutlined,
//   HeartOutlined,
//   GlobalOutlined,
// } from "@ant-design/icons";

// const { Sider, Content, Header } = Layout;
// const { Title, Text, Paragraph } = Typography;

// // ── Types ─────────────────────────────────────────────────────────────────────
// interface Review {
//   key: number;
//   customer: string;
//   avatar: string;
//   rating: number;
//   comment: string;
//   date: string;
//   verified: boolean;
// }

// interface StockVariant {
//   key: string;
//   size: string;
//   color: string;
//   colorHex: string;
//   stock: number;
//   sku: string;
// }

// // ── Mock product ──────────────────────────────────────────────────────────────
// const PRODUCT = {
//   id: 4,
//   name: "Wool Cocoon Coat",
//   category: "Outerwear",
//   sku: "OUT-004",
//   price: 198,
//   comparePrice: 245,
//   cost: 86,
//   stock: 12,
//   sold: 137,
//   views: 2841,
//   wishlist: 94,
//   status: "Active" as const,
//   rating: 4.6,
//   reviewCount: 38,
//   description:
//     "A luxuriously oversized cocoon silhouette crafted from a premium boiled wool blend. Features a collarless neckline, dropped shoulders, and clean-finished seams. Fully lined in cupro for effortless dressing. An investment piece designed to anchor any wardrobe for seasons to come.",
//   materials: "80% Merino Wool, 15% Recycled Polyester, 5% Nylon",
//   care: "Dry clean only. Store folded, not hung.",
//   origin: "Made in Portugal",
//   tags: ["Wool", "Outerwear", "Bestseller", "Sustainable"],
//   images: ["🧥", "🧥", "🧥", "🧥"],
//   colors: [
//     { name: "Espresso", hex: "#3d3530" },
//     { name: "Sand",     hex: "#c8b89a" },
//   ],
//   sizes: ["XS", "S", "M", "L", "XL"],
//   publishedAt: "12 Sep 2024",
//   updatedAt: "28 Mar 2025",
// };

// const VARIANTS: StockVariant[] = [
//   { key: "1", size: "XS", color: "Espresso", colorHex: "#3d3530", stock: 2,  sku: "OUT-004-XS-ESP" },
//   { key: "2", size: "S",  color: "Espresso", colorHex: "#3d3530", stock: 3,  sku: "OUT-004-S-ESP"  },
//   { key: "3", size: "M",  color: "Espresso", colorHex: "#3d3530", stock: 1,  sku: "OUT-004-M-ESP"  },
//   { key: "4", size: "L",  color: "Espresso", colorHex: "#3d3530", stock: 0,  sku: "OUT-004-L-ESP"  },
//   { key: "5", size: "XL", color: "Espresso", colorHex: "#3d3530", stock: 2,  sku: "OUT-004-XL-ESP" },
//   { key: "6", size: "XS", color: "Sand",     colorHex: "#c8b89a", stock: 1,  sku: "OUT-004-XS-SND" },
//   { key: "7", size: "S",  color: "Sand",     colorHex: "#c8b89a", stock: 2,  sku: "OUT-004-S-SND"  },
//   { key: "8", size: "M",  color: "Sand",     colorHex: "#c8b89a", stock: 0,  sku: "OUT-004-M-SND"  },
//   { key: "9", size: "L",  color: "Sand",     colorHex: "#c8b89a", stock: 1,  sku: "OUT-004-L-SND"  },
//   { key:"10", size: "XL", color: "Sand",     colorHex: "#c8b89a", stock: 0,  sku: "OUT-004-XL-SND" },
// ];

// const REVIEWS: Review[] = [
//   { key: 1, customer: "Linh Nguyen",    avatar: "L", rating: 5, comment: "Absolutely stunning coat. The wool quality is exceptional and the cut is incredibly flattering.", date: "15 Mar 2025", verified: true },
//   { key: 2, customer: "Mai Tran",       avatar: "M", rating: 5, comment: "Worth every penny. I get compliments every time I wear it. Sizing is true to chart.", date: "02 Mar 2025", verified: true },
//   { key: 3, customer: "An Pham",        avatar: "A", rating: 4, comment: "Beautiful coat but shipping took longer than expected. The product itself is perfect.", date: "18 Feb 2025", verified: false },
//   { key: 4, customer: "Thu Hoang",      avatar: "T", rating: 5, comment: "Bought in both colors. Fit is immaculate. Sand color photographs beautifully.", date: "10 Feb 2025", verified: true },
//   { key: 5, customer: "Hoa Le",         avatar: "H", rating: 4, comment: "Great quality. Runs slightly large so size down if between sizes.", date: "28 Jan 2025", verified: true },
// ];

// const ACTIVITY = [
//   { label: "Stock updated — +5 units (Espresso/S)",  time: "2 days ago",   color: "green"  },
//   { label: "Price adjusted from $210 → $198",         time: "1 week ago",   color: "blue"   },
//   { label: "Featured in Spring Campaign",             time: "2 weeks ago",  color: "purple" },
//   { label: "Low stock alert triggered (≤3 units)",    time: "3 weeks ago",  color: "orange" },
//   { label: "Product published",                       time: "Sep 12, 2024", color: "gray"   },
// ];

// const RATING_BREAKDOWN = [5,4,3,2,1].map(star => ({
//   star,
//   count: [22, 10, 4, 1, 1][5 - star],
//   pct:   [58, 26, 11, 3, 3][5 - star],
// }));

// // ── Variant columns ───────────────────────────────────────────────────────────
// const variantColumns: ColumnsType<StockVariant> = [
//   {
//     title: "Color",
//     dataIndex: "color",
//     render: (color: string, r) => (
//       <Space>
//         <span style={{ width: 14, height: 14, borderRadius: "50%", background: r.colorHex, display: "inline-block", border: "1px solid #e8e8e8" }} />
//         {color}
//       </Space>
//     ),
//   },
//   { title: "Size", dataIndex: "size", render: (s: string) => <Tag>{s}</Tag> },
//   { title: "SKU", dataIndex: "sku", render: (s: string) => <Text type="secondary" style={{ fontSize: 12, fontFamily: "monospace" }}>{s}</Text> },
//   {
//     title: "Stock",
//     dataIndex: "stock",
//     render: (stock: number) => (
//       <Badge
//         status={stock === 0 ? "error" : stock <= 2 ? "warning" : "success"}
//         text={<Text style={{ color: stock === 0 ? "#ff4d4f" : stock <= 2 ? "#fa8c16" : "#52c41a", fontWeight: 600 }}>{stock}</Text>}
//       />
//     ),
//   },
//   {
//     title: "Manage",
//     render: (_, r) => (
//       <InputNumber min={0} defaultValue={r.stock} size="small" style={{ width: 72 }} />
//     ),
//   },
// ];

// // ── Review columns ────────────────────────────────────────────────────────────
// const reviewColumns: ColumnsType<Review> = [
//   {
//     title: "Customer",
//     render: (_, r) => (
//       <Space>
//         <Avatar style={{ background: "#1d1d1d", fontSize: 13 }}>{r.avatar}</Avatar>
//         <div>
//           <Text strong style={{ fontSize: 13 }}>{r.customer}</Text>
//           {r.verified && <Tag color="green" style={{ marginLeft: 6, fontSize: 10 }}>Verified</Tag>}
//         </div>
//       </Space>
//     ),
//   },
//   {
//     title: "Rating",
//     dataIndex: "rating",
//     render: (n: number) => <Rate disabled defaultValue={n} style={{ fontSize: 12 }} />,
//   },
//   { title: "Comment", dataIndex: "comment", render: (c: string) => <Text style={{ fontSize: 13 }}>{c}</Text> },
//   { title: "Date", dataIndex: "date", render: (d: string) => <Text type="secondary" style={{ fontSize: 12 }}>{d}</Text> },
//   {
//     title: "",
//     render: () => (
//       <Popconfirm title="Delete this review?" okText="Yes" cancelText="No" okButtonProps={{ danger: true }}>
//         <Button type="text" size="small" danger icon={<DeleteOutlined />} />
//       </Popconfirm>
//     ),
//   },
// ];

// // ── Main ──────────────────────────────────────────────────────────────────────
// export default function Temp() {
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [featuredToggle, setFeaturedToggle] = useState(true);

//   const margin = (((PRODUCT.price - PRODUCT.cost) / PRODUCT.price) * 100).toFixed(0);

//   return (
//     <ConfigProvider
//       theme={{
//         algorithm: theme.defaultAlgorithm,
//         token: {
//           colorPrimary: "#1d1d1d",
//           borderRadius: 8,
//           fontFamily: "'DM Sans', sans-serif",
//         },
//         components: {
//           Menu:  { itemSelectedBg: "#f5f5f5", itemSelectedColor: "#1d1d1d" },
//           Table: { headerBg: "#fafafa" },
//           Tabs:  { inkBarColor: "#1d1d1d", itemSelectedColor: "#1d1d1d" },
//         },
//       }}
//     >
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

//       <Layout style={{ minHeight: "100vh" }}>
//         {/* ── Sider ── */}
//         <Sider width={220} style={{ background: "#fff", borderRight: "1px solid #f0f0f0" }}>
//           <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f5f5f5" }}>
//             <Space>
//               <Avatar size={32} style={{ background: "#1d1d1d", fontWeight: 700, fontSize: 13 }}>É</Avatar>
//               <Text strong style={{ fontSize: 15 }}>Éclat Studio</Text>
//             </Space>
//           </div>
//           <Menu
//             mode="inline"
//             defaultSelectedKeys={["products"]}
//             style={{ border: "none", marginTop: 8 }}
//             items={[
//               { key: "home",     icon: <HomeOutlined />,     label: "Dashboard" },
//               { key: "products", icon: <ShoppingOutlined />, label: "Products" },
//               { key: "orders",   icon: <AppstoreOutlined />, label: "Orders" },
//               { key: "stats",    icon: <BarChartOutlined />, label: "Analytics" },
//               { key: "settings", icon: <SettingOutlined />,  label: "Settings" },
//             ]}
//           />
//         </Sider>

//         <Layout>
//           {/* ── Header ── */}
//           <Header style={{ background: "#fff", padding: "0 24px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <Space>
//               <Button type="text" icon={<ArrowLeftOutlined />} style={{ color: "#888" }}>Back to Products</Button>
//               <Divider type="vertical" />
//               <Breadcrumb items={[{ title: "Products" }, { title: PRODUCT.name }]} />
//             </Space>
//             <Space>
//               <Popconfirm title="Delete this product?" okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
//                 <Button danger icon={<DeleteOutlined />}>Delete</Button>
//               </Popconfirm>
//               <Button type="primary" icon={<EditOutlined />} style={{ background: "#1d1d1d", borderColor: "#1d1d1d" }}>
//                 Edit Product
//               </Button>
//             </Space>
//           </Header>

//           <Content style={{ padding: 24, background: "#f8f8f7" }}>

//             {/* ── Top KPI strip ── */}
//             <Row gutter={16} style={{ marginBottom: 20 }}>
//               {[
//                 { icon: <ShoppingCartOutlined />, label: "Units Sold",   value: PRODUCT.sold,      color: "#1d1d1d" },
//                 { icon: <EyeOutlined />,          label: "Total Views",  value: PRODUCT.views,     color: "#1677ff" },
//                 { icon: <HeartOutlined />,        label: "Wishlisted",   value: PRODUCT.wishlist,  color: "#ff4d4f" },
//                 { icon: <StarFilled />,           label: "Avg Rating",   value: PRODUCT.rating,    color: "#fa8c16", precision: 1 },
//                 { icon: <TagOutlined />,          label: "Margin",       value: `${margin}%`,      color: "#52c41a", isStr: true },
//               ].map(s => (
//                 <Col span={24 / 5} key={s.label}>
//                   <Card bordered={false} style={{ borderRadius: 10, textAlign: "center" }}>
//                     <div style={{ fontSize: 20, color: s.color, marginBottom: 4 }}>{s.icon}</div>
//                     <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>
//                       {s.isStr ? s.value : Number(s.value).toLocaleString()}
//                     </div>
//                     <Text type="secondary" style={{ fontSize: 12 }}>{s.label}</Text>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>

//             {/* ── Main 2-col layout ── */}
//             <Row gutter={20} align="top">

//               {/* ── LEFT — image + info ── */}
//               <Col span={9}>

//                 {/* Image gallery */}
//                 <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16 }}>
//                   <div style={{ background: "#f9f8f6", borderRadius: 8, height: 280, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 110, marginBottom: 12 }}>
//                     {PRODUCT.images[selectedImage]}
//                   </div>
//                   <Space size={8}>
//                     {PRODUCT.images.map((img, i) => (
//                       <div
//                         key={i}
//                         onClick={() => setSelectedImage(i)}
//                         style={{
//                           width: 56, height: 56, borderRadius: 8, background: "#f5f5f5",
//                           display: "flex", alignItems: "center", justifyContent: "center",
//                           fontSize: 26, cursor: "pointer",
//                           border: selectedImage === i ? "2px solid #1d1d1d" : "2px solid transparent",
//                           transition: "border .15s",
//                         }}
//                       >
//                         {img}
//                       </div>
//                     ))}
//                   </Space>
//                 </Card>

//                 {/* Quick settings */}
//                 <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16 }} title={<Text strong>Quick Settings</Text>}>
//                   <Space direction="vertical" style={{ width: "100%" }} size={14}>
//                     <Row justify="space-between" align="middle">
//                       <Text>Featured Product</Text>
//                       <Switch checked={featuredToggle} onChange={setFeaturedToggle} style={{ background: featuredToggle ? "#1d1d1d" : undefined }} />
//                     </Row>
//                     <Row justify="space-between" align="middle">
//                       <Text>Allow Reviews</Text>
//                       <Switch defaultChecked style={{ background: "#1d1d1d" }} />
//                     </Row>
//                     <Row justify="space-between" align="middle">
//                       <Text>Visible on Store</Text>
//                       <Switch defaultChecked style={{ background: "#1d1d1d" }} />
//                     </Row>
//                     <Divider style={{ margin: "4px 0" }} />
//                     <Row justify="space-between" align="middle">
//                       <Text type="secondary" style={{ fontSize: 12 }}>Published</Text>
//                       <Text style={{ fontSize: 12 }}>{PRODUCT.publishedAt}</Text>
//                     </Row>
//                     <Row justify="space-between" align="middle">
//                       <Text type="secondary" style={{ fontSize: 12 }}>Last updated</Text>
//                       <Text style={{ fontSize: 12 }}>{PRODUCT.updatedAt}</Text>
//                     </Row>
//                   </Space>
//                 </Card>

//                 {/* Activity log */}
//                 <Card bordered={false} style={{ borderRadius: 10 }} title={<Text strong>Activity Log</Text>}>
//                   <Timeline
//                     items={ACTIVITY.map(a => ({
//                       color: a.color,
//                       children: (
//                         <div>
//                           <Text style={{ fontSize: 13 }}>{a.label}</Text>
//                           <br />
//                           <Text type="secondary" style={{ fontSize: 11 }}>{a.time}</Text>
//                         </div>
//                       ),
//                     }))}
//                   />
//                 </Card>
//               </Col>

//               {/* ── RIGHT — details tabs ── */}
//               <Col span={15}>

//                 {/* Product header */}
//                 <Card bordered={false} style={{ borderRadius: 10, marginBottom: 16 }}>
//                   <Row justify="space-between" align="top">
//                     <Col span={18}>
//                       <Space direction="vertical" size={6}>
//                         <Space wrap>
//                           <Tag color="default">{PRODUCT.category}</Tag>
//                           <Badge status="success" text={<Text style={{ fontSize: 12, color: "#52c41a", fontWeight: 600 }}>Active</Text>} />
//                           {PRODUCT.tags.map(t => <Tag key={t} style={{ fontSize: 11 }}>{t}</Tag>)}
//                         </Space>
//                         <Title level={3} style={{ margin: 0 }}>{PRODUCT.name}</Title>
//                         <Space size={4}>
//                           <Rate disabled allowHalf defaultValue={PRODUCT.rating} style={{ fontSize: 14 }} />
//                           <Text type="secondary" style={{ fontSize: 13 }}>
//                             {PRODUCT.rating} ({PRODUCT.reviewCount} reviews)
//                           </Text>
//                         </Space>
//                         <Text type="secondary" style={{ fontFamily: "monospace", fontSize: 12 }}>{PRODUCT.sku}</Text>
//                       </Space>
//                     </Col>
//                     <Col style={{ textAlign: "right" }}>
//                       <div style={{ fontSize: 28, fontWeight: 700, color: "#1d1d1d" }}>${PRODUCT.price}</div>
//                       <Text delete type="secondary" style={{ fontSize: 14 }}>${PRODUCT.comparePrice}</Text>
//                       <br />
//                       <Text type="secondary" style={{ fontSize: 12 }}>Cost: ${PRODUCT.cost}</Text>
//                     </Col>
//                   </Row>
//                 </Card>

//                 {/* Tabs */}
//                 <Card bordered={false} style={{ borderRadius: 10 }}>
//                   <Tabs
//                     defaultActiveKey="details"
//                     items={[
//                       {
//                         key: "details",
//                         label: "Details",
//                         children: (
//                           <Space direction="vertical" size={16} style={{ width: "100%" }}>
//                             <div>
//                               <Text strong style={{ display: "block", marginBottom: 6 }}>Description</Text>
//                               <Paragraph style={{ color: "#555", lineHeight: 1.8, margin: 0 }}>{PRODUCT.description}</Paragraph>
//                             </div>
//                             <Descriptions column={2} bordered size="small">
//                               <Descriptions.Item label="Materials" span={2}>{PRODUCT.materials}</Descriptions.Item>
//                               <Descriptions.Item label="Care">{PRODUCT.care}</Descriptions.Item>
//                               <Descriptions.Item label={<><GlobalOutlined /> Origin</>}>{PRODUCT.origin}</Descriptions.Item>
//                               <Descriptions.Item label="Colors" span={2}>
//                                 <Space>
//                                   {PRODUCT.colors.map(c => (
//                                     <Space key={c.name} size={6}>
//                                       <span style={{ width: 18, height: 18, borderRadius: "50%", background: c.hex, display: "inline-block", border: "1px solid #e8e8e8" }} />
//                                       <Text style={{ fontSize: 13 }}>{c.name}</Text>
//                                     </Space>
//                                   ))}
//                                 </Space>
//                               </Descriptions.Item>
//                               <Descriptions.Item label="Sizes" span={2}>
//                                 <Space>{PRODUCT.sizes.map(s => <Tag key={s}>{s}</Tag>)}</Space>
//                               </Descriptions.Item>
//                             </Descriptions>
//                           </Space>
//                         ),
//                       },
//                       {
//                         key: "inventory",
//                         label: (
//                           <Space>
//                             <InboxOutlined />
//                             Inventory
//                             <Tag color={PRODUCT.stock < 5 ? "red" : "default"} style={{ marginLeft: 0, fontSize: 11 }}>{PRODUCT.stock}</Tag>
//                           </Space>
//                         ),
//                         children: (
//                           <Space direction="vertical" size={16} style={{ width: "100%" }}>
//                             {/* Stock progress */}
//                             <Row gutter={16}>
//                               <Col span={8}>
//                                 <Statistic title="Total Stock" value={PRODUCT.stock} valueStyle={{ fontWeight: 700, color: PRODUCT.stock < 5 ? "#ff4d4f" : "#1d1d1d" }} />
//                               </Col>
//                               <Col span={8}>
//                                 <Statistic title="Units Sold" value={PRODUCT.sold} valueStyle={{ fontWeight: 700 }} />
//                               </Col>
//                               <Col span={8}>
//                                 <div>
//                                   <Text type="secondary" style={{ fontSize: 13 }}>Sell-through Rate</Text>
//                                   <div style={{ marginTop: 4 }}>
//                                     <Progress
//                                       percent={Math.round((PRODUCT.sold / (PRODUCT.sold + PRODUCT.stock)) * 100)}
//                                       strokeColor="#1d1d1d"
//                                       size="small"
//                                     />
//                                   </div>
//                                 </div>
//                               </Col>
//                             </Row>
//                             <Divider style={{ margin: "4px 0" }} />
//                             <Table
//                               columns={variantColumns}
//                               dataSource={VARIANTS}
//                               pagination={false}
//                               size="small"
//                               rowKey="key"
//                             />
//                             <Button type="default" style={{ marginTop: 4 }}>Save Stock Changes</Button>
//                           </Space>
//                         ),
//                       },
//                       {
//                         key: "pricing",
//                         label: "Pricing",
//                         children: (
//                           <Space direction="vertical" size={16} style={{ width: "100%" }}>
//                             <Row gutter={16}>
//                               {[
//                                 { label: "Selling Price",   value: `$${PRODUCT.price}`,        color: "#1d1d1d" },
//                                 { label: "Compare-at Price",value: `$${PRODUCT.comparePrice}`,  color: "#888" },
//                                 { label: "Cost per Unit",   value: `$${PRODUCT.cost}`,          color: "#555" },
//                                 { label: "Gross Margin",    value: `${margin}%`,                color: "#52c41a" },
//                               ].map(s => (
//                                 <Col span={6} key={s.label}>
//                                   <Card style={{ borderRadius: 8, textAlign: "center", background: "#fafafa" }} bordered={false}>
//                                     <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
//                                     <Text type="secondary" style={{ fontSize: 12 }}>{s.label}</Text>
//                                   </Card>
//                                 </Col>
//                               ))}
//                             </Row>
//                             <Descriptions bordered size="small" column={1}>
//                               <Descriptions.Item label="Revenue generated">
//                                 <Text strong>${(PRODUCT.price * PRODUCT.sold).toLocaleString()}</Text>
//                               </Descriptions.Item>
//                               <Descriptions.Item label="Profit generated">
//                                 <Text strong style={{ color: "#52c41a" }}>
//                                   ${((PRODUCT.price - PRODUCT.cost) * PRODUCT.sold).toLocaleString()}
//                                 </Text>
//                               </Descriptions.Item>
//                               <Descriptions.Item label="Tax">
//                                 <Select defaultValue="vat10" size="small" style={{ width: 180 }}>
//                                   <Select.Option value="vat10">VAT 10% — Included</Select.Option>
//                                   <Select.Option value="vat5">VAT 5% — Included</Select.Option>
//                                   <Select.Option value="exempt">Tax Exempt</Select.Option>
//                                 </Select>
//                               </Descriptions.Item>
//                             </Descriptions>
//                           </Space>
//                         ),
//                       },
//                       {
//                         key: "reviews",
//                         label: (
//                           <Space>
//                             <StarFilled style={{ color: "#fa8c16" }} />
//                             Reviews
//                             <Tag style={{ marginLeft: 0, fontSize: 11 }}>{PRODUCT.reviewCount}</Tag>
//                           </Space>
//                         ),
//                         children: (
//                           <Space direction="vertical" size={16} style={{ width: "100%" }}>
//                             <Row gutter={24} align="middle">
//                               {/* Big rating */}
//                               <Col style={{ textAlign: "center", paddingRight: 24, borderRight: "1px solid #f0f0f0" }}>
//                                 <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, color: "#1d1d1d" }}>{PRODUCT.rating}</div>
//                                 <Rate disabled allowHalf defaultValue={PRODUCT.rating} style={{ fontSize: 16 }} />
//                                 <div><Text type="secondary" style={{ fontSize: 12 }}>{PRODUCT.reviewCount} reviews</Text></div>
//                               </Col>
//                               {/* Breakdown bars */}
//                               <Col flex="1">
//                                 {RATING_BREAKDOWN.map(b => (
//                                   <Row key={b.star} gutter={8} align="middle" style={{ marginBottom: 4 }}>
//                                     <Col style={{ width: 18, textAlign: "right" }}>
//                                       <Text style={{ fontSize: 12 }}>{b.star}</Text>
//                                     </Col>
//                                     <Col style={{ width: 14, textAlign: "center" }}>
//                                       <StarFilled style={{ color: "#fa8c16", fontSize: 11 }} />
//                                     </Col>
//                                     <Col flex="1">
//                                       <Progress percent={b.pct} showInfo={false} strokeColor="#fa8c16" trailColor="#f0f0f0" size="small" />
//                                     </Col>
//                                     <Col style={{ width: 28 }}>
//                                       <Text type="secondary" style={{ fontSize: 12 }}>{b.count}</Text>
//                                     </Col>
//                                   </Row>
//                                 ))}
//                               </Col>
//                             </Row>
//                             <Divider style={{ margin: "4px 0" }} />
//                             <Table
//                               columns={reviewColumns}
//                               dataSource={REVIEWS}
//                               pagination={false}
//                               size="small"
//                               rowKey="key"
//                             />
//                           </Space>
//                         ),
//                       },
//                     ]}
//                   />
//                 </Card>

//               </Col>
//             </Row>
//           </Content>
//         </Layout>
//       </Layout>
//     </ConfigProvider>
//   );
// }
