--
-- PostgreSQL database dump
--

\restrict I9P8x7lvngiidn6Gq26zUu2YLkE1I2fVtFC8VHUi4eRoI1odHVOtb3uQRorWy3s

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: locan
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO locan;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: locan
--

COMMENT ON SCHEMA public IS '';


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: locan
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED'
);


ALTER TYPE public."OrderStatus" OWNER TO locan;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: locan
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'COD',
    'BANK_TRANSFER',
    'MOMO',
    'ZALOPAY',
    'VNPAY'
);


ALTER TYPE public."PaymentMethod" OWNER TO locan;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: locan
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'UNPAID',
    'PAID',
    'REFUNDED',
    'FAILED'
);


ALTER TYPE public."PaymentStatus" OWNER TO locan;

--
-- Name: ProductStatus; Type: TYPE; Schema: public; Owner: locan
--

CREATE TYPE public."ProductStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."ProductStatus" OWNER TO locan;

--
-- Name: RepairStatus; Type: TYPE; Schema: public; Owner: locan
--

CREATE TYPE public."RepairStatus" AS ENUM (
    'RECEIVED',
    'DIAGNOSING',
    'QUOTING',
    'APPROVED',
    'REPAIRING',
    'TESTING',
    'READY',
    'DELIVERED',
    'CANCELLED',
    'REJECTED'
);


ALTER TYPE public."RepairStatus" OWNER TO locan;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: locan
--

CREATE TYPE public."Role" AS ENUM (
    'CUSTOMER',
    'ADMIN',
    'SUPERADMIN'
);


ALTER TYPE public."Role" OWNER TO locan;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: locan
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'SUSPENDED',
    'DELETED'
);


ALTER TYPE public."UserStatus" OWNER TO locan;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Banner; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."Banner" (
    id text NOT NULL,
    title text NOT NULL,
    subtitle text,
    image text NOT NULL,
    link text,
    "linkType" text,
    "position" text DEFAULT 'HERO'::text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Banner" OWNER TO locan;

--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."CartItem" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO locan;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    image text,
    "parentId" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO locan;

--
-- Name: News; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."News" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text NOT NULL,
    image text,
    author text,
    tags text[],
    "isPublished" boolean DEFAULT true NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."News" OWNER TO locan;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "userId" text,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "paymentMethod" public."PaymentMethod" NOT NULL,
    "paymentStatus" public."PaymentStatus" DEFAULT 'UNPAID'::public."PaymentStatus" NOT NULL,
    "paymentId" text,
    subtotal numeric(12,2) NOT NULL,
    "shippingFee" numeric(12,2) DEFAULT 0 NOT NULL,
    "discountAmount" numeric(12,2) DEFAULT 0 NOT NULL,
    "discountCode" text,
    total numeric(12,2) NOT NULL,
    "recipientName" text NOT NULL,
    "recipientPhone" text NOT NULL,
    "shippingAddress" text NOT NULL,
    "shippingCity" text,
    note text,
    "confirmedAt" timestamp(3) without time zone,
    "shippedAt" timestamp(3) without time zone,
    "deliveredAt" timestamp(3) without time zone,
    "cancelledAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO locan;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    "productName" text NOT NULL,
    "productSku" text NOT NULL,
    "productImage" text,
    price numeric(12,2) NOT NULL,
    quantity integer NOT NULL,
    total numeric(12,2) NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO locan;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    sku text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    "shortDesc" text,
    price numeric(12,2) NOT NULL,
    "comparePrice" numeric(12,2),
    quantity integer DEFAULT 0 NOT NULL,
    "soldCount" integer DEFAULT 0 NOT NULL,
    images text[],
    thumbnail text,
    brand text,
    warranty text,
    tags text[],
    specifications jsonb,
    status public."ProductStatus" DEFAULT 'DRAFT'::public."ProductStatus" NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "isBestSeller" boolean DEFAULT false NOT NULL,
    "categoryId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO locan;

--
-- Name: RefreshToken; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."RefreshToken" (
    id text NOT NULL,
    token text NOT NULL,
    "userId" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RefreshToken" OWNER TO locan;

--
-- Name: RepairRequest; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."RepairRequest" (
    id text NOT NULL,
    "ticketNumber" text NOT NULL,
    "userId" text NOT NULL,
    "productId" text,
    "deviceBrand" text NOT NULL,
    "deviceModel" text NOT NULL,
    "deviceImei" text,
    "faultDescription" text NOT NULL,
    "faultImages" text[],
    "estimatedCost" numeric(12,2),
    "actualCost" numeric(12,2),
    status public."RepairStatus" DEFAULT 'RECEIVED'::public."RepairStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RepairRequest" OWNER TO locan;

--
-- Name: RepairTimeline; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."RepairTimeline" (
    id text NOT NULL,
    "repairRequestId" text NOT NULL,
    status public."RepairStatus" NOT NULL,
    note text,
    "updatedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RepairTimeline" OWNER TO locan;

--
-- Name: Service; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."Service" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    icon text,
    image text,
    features text[],
    "priceFrom" numeric(12,2),
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Service" OWNER TO locan;

--
-- Name: SiteConfig; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."SiteConfig" (
    id text DEFAULT 'default'::text NOT NULL,
    "siteName" text NOT NULL,
    hotline text NOT NULL,
    email text NOT NULL,
    address text NOT NULL,
    "workingHours" text NOT NULL,
    facebook text,
    zalo text,
    "footerText" text,
    "seoTitle" text,
    "seoDescription" text,
    "metaImage" text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SiteConfig" OWNER TO locan;

--
-- Name: User; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    name text NOT NULL,
    phone text,
    role public."Role" DEFAULT 'CUSTOMER'::public."Role" NOT NULL,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    avatar text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO locan;

--
-- Name: WishlistItem; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public."WishlistItem" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WishlistItem" OWNER TO locan;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: locan
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO locan;

--
-- Data for Name: Banner; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."Banner" (id, title, subtitle, image, link, "linkType", "position", "sortOrder", "isActive", "startDate", "endDate", "createdAt", "updatedAt") FROM stdin;
b2	Laptop văn phòng từ 9.990.000đ	Hàng chính hãng, bảo hành toàn quốc	/uploads/banners/banner-laptop.jpg	/laptop	\N	HERO	2	t	\N	\N	2026-03-25 01:59:55.568	2026-03-26 03:57:32.187
b3	Dịch vụ sửa chữa máy tính tận nơi	Hotline: 0973131302 - Có mặt trong 60 phút	/uploads/banners/banner-repair.jpg	/dich-vu	\N	HERO	3	t	\N	\N	2026-03-25 01:59:55.575	2026-03-26 03:57:32.193
b4	Combo camera giám sát từ 3.990.000đ	Lắp đặt miễn phí tại Hà Đông	/uploads/banners/banner-camera.jpg	/camera	\N	SIDEBAR	1	t	\N	\N	2026-03-25 01:59:55.58	2026-03-26 03:57:32.197
b5	Nâng cấp SSD - Máy nhanh gấp 5 lần	Chỉ từ 590.000đ bao gồm công lắp	/uploads/banners/banner-ssd.jpg	/dich-vu/nang-cap-ssd-ram	\N	SIDEBAR	2	t	\N	\N	2026-03-25 01:59:55.586	2026-03-26 03:57:32.201
b1	PC Gaming Lộc An - Cấu hình mạnh, giá hợp lý	Tư vấn build PC theo ngân sách, bảo hành 36 tháng	/uploads/banners/banner-pc-gaming.jpg	/pc-gaming	\N	HERO	1	t	\N	\N	2026-03-25 01:59:55.56	2026-05-07 04:18:26.611
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."CartItem" (id, "userId", "productId", quantity, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."Category" (id, name, slug, image, "parentId", "sortOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
pc-gaming	Gaming	pc-gaming	\N	pc-theo-nhu-cau	2	t	2026-03-25 01:59:54.595	2026-03-25 15:01:35.871
pc-do-hoa	Đồ họa	pc-do-hoa	\N	pc-theo-nhu-cau	3	t	2026-03-25 01:59:54.762	2026-03-25 15:01:35.875
camera-ip	Camera IP	camera-ip	\N	camera	3	t	2026-03-25 01:59:54.909	2026-03-25 15:01:35.995
pc-hoc-tap	Học tập	pc-hoc-tap	\N	pc-theo-nhu-cau	4	t	2026-03-25 01:59:54.77	2026-03-25 15:01:35.878
pc-workstation	Workstation	pc-workstation	\N	pc	2	t	2026-03-25 01:59:54.775	2026-03-25 15:01:35.882
pc-gaming-pho-thong	Phổ thông	pc-gaming-pho-thong	\N	pc-gaming	1	t	2026-03-25 01:59:54.78	2026-03-25 15:01:35.886
laptop-theo-hang	Theo hãng	laptop-theo-hang	\N	laptop	2	t	2026-03-25 01:59:54.665	2026-03-25 15:01:35.822
mainboard	Mainboard	mainboard	\N	linh-kien	6	t	2026-03-25 01:59:54.822	2026-03-25 15:01:35.928
psu	Nguồn máy tính	psu	\N	linh-kien	7	t	2026-03-25 01:59:54.827	2026-03-25 15:01:35.934
case	Case máy tính	case	\N	linh-kien	8	t	2026-03-25 01:59:54.833	2026-03-25 15:01:35.94
tan-nhiet	Tản nhiệt	tan-nhiet	\N	linh-kien	9	t	2026-03-25 01:59:54.84	2026-03-25 15:01:35.947
man-hinh-van-phong	Văn phòng	man-hinh-van-phong	\N	man-hinh	1	t	2026-03-25 01:59:54.847	2026-03-25 15:01:35.954
man-hinh-gaming	Gaming	man-hinh-gaming	\N	man-hinh	2	t	2026-03-25 01:59:54.855	2026-03-25 15:01:35.96
laptop-apple	Apple	laptop-apple	\N	laptop-theo-hang	1	t	2026-03-25 01:59:54.671	2026-03-25 15:01:35.827
man-hinh-do-hoa	Đồ họa	man-hinh-do-hoa	\N	man-hinh	3	t	2026-03-25 01:59:54.864	2026-03-25 15:01:35.964
router-wifi	Router WiFi	router-wifi	\N	thiet-bi-mang	1	t	2026-03-25 01:59:54.873	2026-03-25 15:01:35.968
ban-phim	Bàn phím	ban-phim	\N	ngoai-vi	1	t	2026-03-25 01:59:54.918	2026-03-25 15:01:35.999
chuot	Chuột	chuot	\N	ngoai-vi	2	t	2026-03-25 01:59:54.925	2026-03-25 15:01:36.002
tai-nghe	Tai nghe	tai-nghe	\N	ngoai-vi	3	t	2026-03-25 01:59:54.933	2026-03-25 15:01:36.006
loa	Loa	loa	\N	ngoai-vi	4	t	2026-03-25 01:59:54.94	2026-03-25 15:01:36.012
laptop	Laptop	laptop	\N	\N	1	t	2026-03-25 01:59:54.584	2026-03-25 15:01:35.757
pc	PC đồng bộ	pc	\N	\N	2	t	2026-03-25 01:59:54.59	2026-03-25 15:01:35.764
mesh-wifi	Mesh WiFi	mesh-wifi	\N	thiet-bi-mang	2	t	2026-03-25 01:59:54.882	2026-03-25 15:01:35.973
linh-kien	Linh kiện	linh-kien	\N	\N	4	t	2026-03-25 01:59:54.6	2026-03-25 15:01:35.772
man-hinh	Màn hình	man-hinh	\N	\N	5	t	2026-03-25 01:59:54.605	2026-03-25 15:01:35.776
thiet-bi-mang	Thiết bị mạng	thiet-bi-mang	\N	\N	6	t	2026-03-25 01:59:54.611	2026-03-25 15:01:35.78
camera	Camera	camera	\N	\N	7	t	2026-03-25 01:59:54.617	2026-03-25 15:01:35.785
ngoai-vi	Ngoại vi	ngoai-vi	\N	\N	8	t	2026-03-25 01:59:54.623	2026-03-25 15:01:35.791
dich-vu	Dịch vụ	dich-vu	\N	\N	9	t	2026-03-25 01:59:54.629	2026-03-25 15:01:35.795
laptop-theo-nhu-cau	Theo nhu cầu	laptop-theo-nhu-cau	\N	laptop	1	t	2026-03-25 01:59:54.636	2026-03-25 15:01:35.801
laptop-van-phong	Văn phòng	laptop-van-phong	\N	laptop-theo-nhu-cau	1	t	2026-03-25 01:59:54.641	2026-03-25 15:01:35.805
laptop-gaming	Gaming	laptop-gaming	\N	laptop-theo-nhu-cau	2	t	2026-03-25 01:59:54.646	2026-03-25 15:01:35.809
laptop-do-hoa	Đồ họa	laptop-do-hoa	\N	laptop-theo-nhu-cau	3	t	2026-03-25 01:59:54.651	2026-03-25 15:01:35.813
laptop-mong-nhe	Mỏng nhẹ	laptop-mong-nhe	\N	laptop-theo-nhu-cau	4	t	2026-03-25 01:59:54.657	2026-03-25 15:01:35.817
laptop-dell	Dell	laptop-dell	\N	laptop-theo-hang	2	t	2026-03-25 01:59:54.678	2026-03-25 15:01:35.831
laptop-hp	HP	laptop-hp	\N	laptop-theo-hang	3	t	2026-03-25 01:59:54.685	2026-03-25 15:01:35.837
laptop-asus	ASUS	laptop-asus	\N	laptop-theo-hang	4	t	2026-03-25 01:59:54.692	2026-03-25 15:01:35.84
laptop-theo-gia	Theo giá	laptop-theo-gia	\N	laptop	3	t	2026-03-25 01:59:54.7	2026-03-25 15:01:35.844
laptop-duoi-10-trieu	Dưới 10 triệu	laptop-duoi-10-trieu	\N	laptop-theo-gia	1	t	2026-03-25 01:59:54.708	2026-03-25 15:01:35.847
laptop-10-20-trieu	10 - 20 triệu	laptop-10-20-trieu	\N	laptop-theo-gia	2	t	2026-03-25 01:59:54.716	2026-03-25 15:01:35.851
laptop-tren-20-trieu	Trên 20 triệu	laptop-tren-20-trieu	\N	laptop-theo-gia	3	t	2026-03-25 01:59:54.726	2026-03-25 15:01:35.856
pc-theo-nhu-cau	Theo nhu cầu	pc-theo-nhu-cau	\N	pc	1	t	2026-03-25 01:59:54.734	2026-03-25 15:01:35.861
pc-van-phong	Văn phòng	pc-van-phong	\N	pc-theo-nhu-cau	1	t	2026-03-25 01:59:54.743	2026-03-25 15:01:35.866
pc-gaming-tam-trung	Tầm trung	pc-gaming-tam-trung	\N	pc-gaming	2	t	2026-03-25 01:59:54.785	2026-03-25 15:01:35.891
pc-gaming-cao-cap	Cao cấp	pc-gaming-cao-cap	\N	pc-gaming	3	t	2026-03-25 01:59:54.789	2026-03-25 15:01:35.897
livestream	Livestream	pc-livestream	\N	pc-gaming	4	t	2026-03-25 01:59:54.794	2026-03-25 15:01:35.902
cpu	CPU - Bộ vi xử lý	cpu	\N	linh-kien	1	t	2026-03-25 01:59:54.797	2026-03-25 15:01:35.907
ram	RAM	ram	\N	linh-kien	2	t	2026-03-25 01:59:54.802	2026-03-25 15:01:35.911
ssd	SSD	ssd	\N	linh-kien	3	t	2026-03-25 01:59:54.807	2026-03-25 15:01:35.915
hdd	HDD	hdd	\N	linh-kien	4	t	2026-03-25 01:59:54.812	2026-03-25 15:01:35.918
switch	Switch	switch	\N	thiet-bi-mang	3	t	2026-03-25 01:59:54.891	2026-03-25 15:01:35.98
camera-trong-nha	Trong nhà	camera-trong-nha	\N	camera	1	t	2026-03-25 01:59:54.898	2026-03-25 15:01:35.986
camera-ngoai-troi	Ngoài trời	camera-ngoai-troi	\N	camera	2	t	2026-03-25 01:59:54.902	2026-03-25 15:01:35.991
vga	VGA - Card màn hình	vga	\N	linh-kien	5	t	2026-03-25 01:59:54.817	2026-03-25 15:01:35.922
\.


--
-- Data for Name: News; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."News" (id, title, slug, excerpt, content, image, author, tags, "isPublished", "viewCount", "publishedAt", "createdAt", "updatedAt") FROM stdin;
n3	Khi nào cần vệ sinh máy tính? Dấu hiệu và cách xử lý	khi-nao-can-ve-sinh-may-tinh	Máy tính chạy chậm, nóng bất thường? Có thể đã đến lúc vệ sinh. Lộc An chia sẻ dấu hiệu cần chú ý.	<p>Nội dung bài viết đang được cập nhật...</p>	https://placehold.co/800x400/059669/FFF?text=Maintenance	Lộc An Tech	{"Kinh nghiệm"}	t	0	2025-03-05 00:00:00	2026-03-25 01:59:55.622	2026-03-25 15:01:36.427
n4	So sánh SSD NVMe và SATA: Nên chọn loại nào?	so-sanh-ssd-nvme-sata	Tìm hiểu sự khác biệt giữa SSD NVMe và SATA để chọn ổ cứng phù hợp với nhu cầu sử dụng.	<p>Nội dung bài viết đang được cập nhật...</p>	https://placehold.co/800x400/dc2626/FFF?text=SSD+vs+SATA	Lộc An Tech	{"Kiến thức"}	t	0	2025-02-28 00:00:00	2026-03-25 01:59:55.629	2026-03-25 15:01:36.431
n5	Hướng dẫn lắp đặt camera giám sát tại nhà đơn giản	huong-dan-lap-camera-tai-nha	Lộc An hướng dẫn chi tiết các bước lắp đặt camera giám sát tại nhà, phù hợp cho người mới bắt đầu.	<p>Nội dung bài viết đang được cập nhật...</p>	https://placehold.co/800x400/1e40af/FFF?text=Camera+Setup	Lộc An Tech	{"Hướng dẫn",Camera}	t	0	2025-02-20 00:00:00	2026-03-25 01:59:55.635	2026-03-25 15:01:36.435
n6	Top 5 router WiFi 6 giá tốt nhất cho gia đình năm 2025	top-5-router-wifi-6-gia-tot	Danh sách 5 router WiFi 6 đáng mua nhất với mức giá hợp lý, phủ sóng tốt cho căn hộ và nhà phố.	<p>Nội dung bài viết đang được cập nhật...</p>	https://placehold.co/800x400/7c3aed/FFF?text=WiFi+6	Lộc An Tech	{"Tư vấn",WiFi}	t	0	2025-02-15 00:00:00	2026-03-25 01:59:55.642	2026-03-25 15:01:36.439
n1	Hướng dẫn chọn laptop văn phòng 2025 phù hợp ngân sách	huong-dan-chon-laptop-van-phong-2025	Bạn đang tìm laptop văn phòng giá tốt? Lộc An tổng hợp tiêu chí chọn laptop phù hợp với công việc và ngân sách của bạn.	<p>Nội dung bài viết đang được cập nhật...</p>	https://placehold.co/800x400/1e40af/FFF?text=Laptop+Guide	Lộc An Tech	{"Tư vấn",Laptop}	t	0	2025-03-15 00:00:00	2026-03-25 01:59:55.608	2026-03-25 15:01:36.416
n2	Build PC Gaming 15 triệu chơi mượt mọi tựa game 2025	build-pc-gaming-15-trieu	Với 15 triệu, bạn hoàn toàn có thể sở hữu một bộ PC Gaming mạnh mẽ. Xem cấu hình gợi ý từ Lộc An.	<p>Nội dung bài viết đang được cập nhật...</p>	https://placehold.co/800x400/7c3aed/FFF?text=Build+PC	Lộc An Tech	{"Tư vấn","PC Gaming"}	t	0	2025-03-10 00:00:00	2026-03-25 01:59:55.615	2026-03-25 15:01:36.423
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."Order" (id, "orderNumber", "userId", status, "paymentMethod", "paymentStatus", "paymentId", subtotal, "shippingFee", "discountAmount", "discountCode", total, "recipientName", "recipientPhone", "shippingAddress", "shippingCity", note, "confirmedAt", "shippedAt", "deliveredAt", "cancelledAt", "createdAt", "updatedAt") FROM stdin;
cmn77s6yk0001kgemyp2bygby	LA-20260326-001	\N	PENDING	COD	UNPAID	\N	12990000.00	30000.00	0.00	\N	13020000.00	Nguyen Van A	0912345678	123 Nguyen Trai, Ha Noi	\N	\N	\N	\N	\N	\N	2026-03-26 08:32:19.772	2026-03-26 08:32:19.772
cmn88gbig000fkgemir33k1fn	LA-20260327-001	\N	PENDING	COD	UNPAID	\N	18990000.00	0.00	0.00	\N	18990000.00	huy	09944991349	25 nguyễn quốc trị	\N	\N	\N	\N	\N	\N	2026-03-27 01:38:51.593	2026-03-27 01:38:51.593
cmn77u5s80007kgemy5rwv0l8	LA-20260326-002	\N	DELIVERED	COD	UNPAID	\N	56970000.00	0.00	0.00	\N	56970000.00	huy âf	09944991365	25 nguyễn quốc trị	\N	\N	\N	\N	2026-04-23 06:45:21.288	\N	2026-03-26 08:33:51.561	2026-04-23 06:45:21.288
cmob49rgv0001k7uk7xjtw47z	LA-20260423-001	\N	DELIVERED	COD	UNPAID	\N	6260000.00	0.00	0.00	\N	6260000.00	huy	09944991349	25 nguyễn quốc trị	\N	\N	\N	\N	2026-04-23 06:45:25.309	\N	2026-04-23 06:44:48.059	2026-04-23 06:45:25.311
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."OrderItem" (id, "orderId", "productId", "productName", "productSku", "productImage", price, quantity, total) FROM stdin;
cmn77s6yk0003kgemaoea5krl	cmn77s6yk0001kgemyp2bygby	l1	Laptop Acer Aspire 5	LA-LT-001	\N	12990000.00	1	12990000.00
cmn77u5s80009kgem8wahr296	cmn77u5s80007kgemy5rwv0l8	l4	Laptop HP Victus 15 Gaming	LA-LT-004	/src/assets/products/laptop-gaming.png	18990000.00	1	18990000.00
cmn77u5s8000akgemethwgzk1	cmn77u5s80007kgemy5rwv0l8	l5	Laptop MSI Katana 15 B13VFK	LA-LT-005	/src/assets/products/laptop-gaming.png	27990000.00	1	27990000.00
cmn77u5s8000bkgemkk744yp5	cmn77u5s80007kgemy5rwv0l8	l3	Laptop Lenovo IdeaPad Slim 3	LA-LT-003	/src/assets/products/laptop-3.png	9990000.00	1	9990000.00
cmn88gbig000hkgeme812h8rh	cmn88gbig000fkgemir33k1fn	l4	Laptop HP Victus 15 Gaming	LA-LT-004	/src/assets/products/laptop-gaming.png	18990000.00	1	18990000.00
cmob49rgv0003k7uk5myzq2y8	cmob49rgv0001k7uk7xjtw47z	lk8	Tản nhiệt DeepCool AK400	LA-LK-008	/src/assets/products/cpu.png	590000.00	1	590000.00
cmob49rgv0004k7ukmxyrqrwh	cmob49rgv0001k7uk7xjtw47z	mh3	Màn hình ASUS VG249Q1A 24" 165Hz	LA-MH-003	/src/assets/products/monitor-gaming.png	3990000.00	1	3990000.00
cmob49rgv0005k7uk71usups4	cmob49rgv0001k7uk7xjtw47z	nv2	Chuột Logitech G304 Wireless	LA-NV-002	/src/assets/products/mouse.png	690000.00	1	690000.00
cmob49rgv0006k7uk0r7rh7la	cmob49rgv0001k7uk7xjtw47z	nv3	Tai nghe HyperX Cloud Stinger 2	LA-NV-003	/src/assets/products/headset.png	990000.00	1	990000.00
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."Product" (id, sku, name, slug, description, "shortDesc", price, "comparePrice", quantity, "soldCount", images, thumbnail, brand, warranty, tags, specifications, status, "isFeatured", "isBestSeller", "categoryId", "createdAt", "updatedAt") FROM stdin;
lk5	LA-LK-005	Mainboard ASUS PRIME B660M-A D4	mainboard-asus-prime-b660m	\N	Intel B660, LGA 1700, DDR4, M.2, mATX	2490000.00	\N	15	0	{/uploads/products/sample-mainboard.png}	/uploads/products/sample-mainboard.png	ASUS	\N	{}	\N	PUBLISHED	f	f	mainboard	2026-03-25 01:59:55.256	2026-04-24 10:54:59.418
l3	LA-LT-003	Laptop Lenovo IdeaPad Slim 3	lenovo-ideapad-slim-3	\N	AMD Ryzen 5 7520U, 8GB RAM, 256GB SSD, 15.6" FHD	9990000.00	\N	19	0	{/uploads/products/sample-laptop-3.png}	/uploads/products/sample-laptop-3.png	Lenovo	\N	{}	\N	PUBLISHED	f	t	laptop	2026-03-25 01:59:54.98	2026-04-24 10:54:59.695
l4	LA-LT-004	Laptop HP Victus 15 Gaming	hp-victus-15-gaming	\N	Intel Core i5-13420H, RTX 3050, 8GB RAM, 512GB SSD	18990000.00	21990000.00	3	0	{/uploads/products/sample-laptop-gaming.png}	/uploads/products/sample-laptop-gaming.png	HP	\N	{"giảm giá","bán chạy"}	\N	PUBLISHED	t	t	laptop-gaming	2026-03-25 01:59:54.987	2026-04-24 10:54:59.725
l6	LA-LT-006	Laptop Dell Latitude 5540	dell-latitude-5540	\N	Intel Core i7-1365U, 16GB RAM, 512GB SSD, 15.6" FHD	22990000.00	\N	4	0	{/uploads/products/sample-laptop-1.png}	/uploads/products/sample-laptop-1.png	Dell	\N	{}	\N	PUBLISHED	f	f	laptop-van-phong	2026-03-25 01:59:55	2026-04-24 10:54:59.783
l7	LA-LT-007	MacBook Air M2 2024	macbook-air-m2-2024	\N	Apple M2, 8GB RAM, 256GB SSD, 13.6" Liquid Retina	24990000.00	27990000.00	6	0	{/uploads/products/sample-laptop-3.png}	/uploads/products/sample-laptop-3.png	Apple	\N	{"giảm giá"}	\N	PUBLISHED	t	t	laptop-apple	2026-03-25 01:59:55.005	2026-04-24 10:54:59.814
l8	LA-LT-008	Laptop ASUS TUF Gaming F15	asus-tuf-gaming-f15	\N	Intel Core i5-12500H, RTX 4050, 8GB RAM, 512GB SSD	21490000.00	23990000.00	7	0	{/uploads/products/sample-laptop-gaming.png}	/uploads/products/sample-laptop-gaming.png	ASUS	\N	{"bán chạy"}	\N	PUBLISHED	f	t	laptop-gaming	2026-03-25 01:59:55.01	2026-04-24 10:54:59.842
l10	LA-LT-010	Laptop Lenovo ThinkPad E16 Gen 1	lenovo-thinkpad-e16	\N	Intel Core i7-1355U, 16GB RAM, 512GB SSD, 16" WUXGA	19990000.00	22490000.00	4	0	{/uploads/products/sample-laptop-1.png}	/uploads/products/sample-laptop-1.png	Lenovo	\N	{mới}	\N	PUBLISHED	f	f	laptop-do-hoa	2026-03-25 01:59:55.019	2026-04-24 10:54:59.9
p1	LA-PC-001	PC Lộc An VP Core i3-12100	pc-loc-an-vp-i3	\N	Intel Core i3-12100, 8GB RAM, 256GB SSD	6990000.00	\N	20	0	{/uploads/products/sample-pc-office.png}	/uploads/products/sample-pc-office.png	Lộc An	\N	{"bán chạy"}	\N	PUBLISHED	t	t	pc-van-phong	2026-03-25 01:59:55.025	2026-04-24 10:55:00.258
p3	LA-PC-003	PC Lộc An VP Ryzen 5 5600G	pc-loc-an-vp-r5	\N	AMD Ryzen 5 5600G, 8GB RAM, 256GB SSD	7990000.00	\N	12	0	{/uploads/products/sample-pc-office.png}	/uploads/products/sample-pc-office.png	Lộc An	\N	{}	\N	PUBLISHED	f	f	pc-van-phong	2026-03-25 01:59:55.035	2026-04-24 10:55:00.317
p4	LA-PC-004	PC Lộc An Đồ Họa i7-12700	pc-loc-an-dh-i7	\N	Intel Core i7-12700, RTX 3060 12GB, 32GB RAM, 1TB SSD	18990000.00	20990000.00	5	0	{/uploads/products/sample-pc-office.png}	/uploads/products/sample-pc-office.png	Lộc An	\N	{mới}	\N	PUBLISHED	t	f	pc-do-hoa	2026-03-25 01:59:55.042	2026-04-24 10:55:00.347
p5	LA-PC-005	PC Lộc An Học Tập i3-10105	pc-loc-an-ht-i3	\N	Intel Core i3-10105, 4GB RAM, 128GB SSD	4990000.00	\N	25	0	{/uploads/products/sample-pc-office.png}	/uploads/products/sample-pc-office.png	Lộc An	\N	{}	\N	PUBLISHED	f	f	pc-hoc-tap	2026-03-25 01:59:55.049	2026-04-24 10:55:00.375
p7	LA-PC-007	PC Lộc An VP Ryzen 7 5700G	pc-loc-an-vp-r7	\N	AMD Ryzen 7 5700G, 16GB RAM, 512GB SSD	10990000.00	\N	6	0	{/uploads/products/sample-pc-office.png}	/uploads/products/sample-pc-office.png	Lộc An	\N	{}	\N	PUBLISHED	f	f	pc-van-phong	2026-03-25 01:59:55.066	2026-04-24 10:55:00.434
p8	LA-PC-008	PC Lộc An Workstation i9-13900	pc-loc-an-ws-i9	\N	Intel Core i9-13900, RTX 4070 12GB, 64GB DDR5, 2TB SSD	35990000.00	\N	2	0	{/uploads/products/sample-pc-office.png}	/uploads/products/sample-pc-office.png	Lộc An	\N	{mới}	\N	PUBLISHED	t	f	pc-workstation	2026-03-25 01:59:55.075	2026-04-24 10:55:00.464
p9	LA-PC-009	PC Lộc An Kế Toán i5-12400	pc-loc-an-kt-i5	\N	Intel Core i5-12400, 8GB RAM, 512GB SSD, Win 11 Pro	8490000.00	\N	10	0	{/uploads/products/sample-pc-office.png}	/uploads/products/sample-pc-office.png	Lộc An	\N	{}	\N	PUBLISHED	f	t	pc-van-phong	2026-03-25 01:59:55.086	2026-04-24 10:55:00.492
g1	LA-PG-001	PC Gaming Lộc An Storm i5-12400F/RTX 3060	pc-gaming-storm-i5-3060	\N	Intel Core i5-12400F, RTX 3060 12GB, 16GB DDR4, 512GB SSD	14990000.00	16990000.00	10	0	{/uploads/products/sample-pc-gaming.png}	/uploads/products/sample-pc-gaming.png	Lộc An	\N	{"bán chạy","giảm giá"}	\N	PUBLISHED	t	t	pc-gaming-pho-thong	2026-03-25 01:59:55.111	2026-04-24 10:55:00.551
g3	LA-PG-003	PC Gaming Lộc An Titan i7-13700F/RTX 4070	pc-gaming-titan-i7-4070	\N	Intel Core i7-13700F, RTX 4070 12GB, 32GB DDR5, 1TB SSD	29990000.00	32990000.00	4	0	{/uploads/products/sample-pc-gaming.png}	/uploads/products/sample-pc-gaming.png	Lộc An	\N	{mới}	\N	PUBLISHED	t	f	pc-gaming-cao-cap	2026-03-25 01:59:55.137	2026-04-24 10:55:00.617
g4	LA-PG-004	PC Gaming Lộc An R5/RX 7600	pc-gaming-r5-rx7600	\N	AMD Ryzen 5 5600, RX 7600 8GB, 16GB DDR4, 512GB SSD	13490000.00	\N	8	0	{/uploads/products/sample-pc-gaming.png}	/uploads/products/sample-pc-gaming.png	Lộc An	\N	{}	\N	PUBLISHED	f	f	pc-gaming-pho-thong	2026-03-25 01:59:55.15	2026-04-24 10:55:00.798
g5	LA-PG-005	PC Gaming Lộc An Ultra i7-14700F/RTX 4070 Ti	pc-gaming-ultra-i7-4070ti	\N	Intel Core i7-14700F, RTX 4070 Ti 12GB, 32GB DDR5, 1TB SSD	38990000.00	42990000.00	2	0	{/uploads/products/sample-pc-gaming.png}	/uploads/products/sample-pc-gaming.png	Lộc An	\N	{mới}	\N	PUBLISHED	t	f	pc-gaming-cao-cap	2026-03-25 01:59:55.16	2026-04-24 10:55:00.826
g6	LA-PG-006	PC Gaming Lộc An Flash i5/RTX 4050	pc-gaming-flash-i5-4050	\N	Intel Core i5-12400F, RTX 4050 6GB, 16GB DDR4, 512GB SSD	15990000.00	\N	6	0	{/uploads/products/sample-pc-gaming.png}	/uploads/products/sample-pc-gaming.png	Lộc An	\N	{}	\N	PUBLISHED	f	t	pc-gaming-pho-thong	2026-03-25 01:59:55.166	2026-04-24 10:55:00.847
g8	LA-PG-008	PC Gaming Lộc An Bolt i5-13400F/RTX 3060	pc-gaming-bolt-i5-3060	\N	Intel Core i5-13400F, RTX 3060 12GB, 16GB DDR4, 512GB SSD	13990000.00	15490000.00	12	0	{/uploads/products/sample-pc-gaming.png}	/uploads/products/sample-pc-gaming.png	Lộc An	\N	{"bán chạy"}	\N	PUBLISHED	f	t	pc-gaming-pho-thong	2026-03-25 01:59:55.179	2026-04-24 10:55:00.897
g9	LA-PG-009	PC Gaming Lộc An R5/RTX 4060 Ti	pc-gaming-r5-4060ti	\N	AMD Ryzen 5 7600, RTX 4060 Ti 8GB, 16GB DDR5, 1TB SSD	22490000.00	\N	5	0	{/uploads/products/sample-pc-gaming.png}	/uploads/products/sample-pc-gaming.png	Lộc An	\N	{mới}	\N	PUBLISHED	f	f	pc-gaming-tam-trung	2026-03-25 01:59:55.187	2026-04-24 10:55:00.925
g10	LA-PG-010	PC Gaming Lộc An Supreme i9/RTX 4080	pc-gaming-supreme-i9-4080	\N	Intel Core i9-14900K, RTX 4080 16GB, 64GB DDR5, 2TB SSD	55990000.00	\N	1	0	{/uploads/products/sample-pc-gaming.png}	/uploads/products/sample-pc-gaming.png	Lộc An	\N	{mới}	\N	PUBLISHED	t	f	pc-gaming-cao-cap	2026-03-25 01:59:55.198	2026-04-24 10:55:00.947
c1	LA-CAM-001	Camera IP Yoosee 3MP Full HD	camera-yoosee-3mp	\N	3MP, Full HD 1080p, Hồng ngoại 20m, Xoay 360°	690000.00	890000.00	30	0	{/uploads/products/sample-camera.png}	/uploads/products/sample-camera.png	Yoosee	\N	{"bán chạy","giảm giá"}	\N	PUBLISHED	f	t	camera-ip	2026-03-25 01:59:55.404	2026-04-24 10:54:59.196
c2	LA-CAM-002	Camera Hikvision DS-2CD1043G2-I 4MP	camera-hikvision-4mp	\N	4MP, IP67, Hồng ngoại 30m, SOEM	1290000.00	\N	20	0	{/uploads/products/sample-camera-outdoor.png}	/uploads/products/sample-camera-outdoor.png	Hikvision	\N	{}	\N	PUBLISHED	f	f	camera-ngoai-troi	2026-03-25 01:59:55.415	2026-04-24 10:54:59.234
lk1	LA-LK-001	CPU Intel Core i5-12400F	cpu-i5-12400f	\N	6 nhân 12 luồng, 2.5GHz - 4.4GHz, Socket LGA 1700	2990000.00	3490000.00	30	0	{/uploads/products/sample-cpu.png}	/uploads/products/sample-cpu.png	Intel	\N	{"bán chạy"}	\N	PUBLISHED	f	t	cpu	2026-03-25 01:59:55.208	2026-04-24 10:54:59.318
lk2	LA-LK-002	RAM Kingston Fury Beast 16GB DDR4 3200MHz	ram-kingston-fury-16gb	\N	16GB DDR4, Bus 3200MHz, Heatsink	890000.00	\N	50	0	{/uploads/products/sample-ram.png}	/uploads/products/sample-ram.png	Kingston	\N	{"bán chạy"}	\N	PUBLISHED	f	t	ram	2026-03-25 01:59:55.22	2026-04-24 10:54:59.342
lk3	LA-LK-003	SSD Samsung 980 Pro 1TB NVMe M.2	ssd-samsung-980-pro-1tb	\N	1TB, NVMe M.2 2280, Đọc 7000MB/s, Ghi 5000MB/s	2490000.00	2990000.00	20	0	{/uploads/products/sample-ssd.png}	/uploads/products/sample-ssd.png	Samsung	\N	{"giảm giá"}	\N	PUBLISHED	f	t	ssd	2026-03-25 01:59:55.231	2026-04-24 10:54:59.368
lk6	LA-LK-006	Nguồn Corsair CV650 650W 80+ Bronze	nguon-corsair-cv650	\N	650W, 80+ Bronze, Non-modular	1290000.00	\N	25	0	{/uploads/products/sample-psu.png}	/uploads/products/sample-psu.png	Corsair	\N	{"bán chạy"}	\N	PUBLISHED	f	t	psu	2026-03-25 01:59:55.271	2026-04-24 10:54:59.442
lk8	LA-LK-008	Tản nhiệt DeepCool AK400	tan-nhiet-deepcool-ak400	\N	Tower cooler, 4 ống đồng, TDP 220W, quạt 120mm	590000.00	\N	29	0	{/uploads/products/sample-cpu.png}	/uploads/products/sample-cpu.png	DeepCool	\N	{"bán chạy"}	\N	PUBLISHED	f	t	tan-nhiet	2026-03-25 01:59:55.298	2026-04-24 10:54:59.492
lk9	LA-LK-009	CPU AMD Ryzen 5 5600X	cpu-r5-5600x	\N	6 nhân 12 luồng, 3.7GHz - 4.6GHz, Socket AM4	3290000.00	3890000.00	18	0	{/uploads/products/sample-cpu.png}	/uploads/products/sample-cpu.png	AMD	\N	{"giảm giá"}	\N	PUBLISHED	f	f	cpu	2026-03-25 01:59:55.31	2026-04-24 10:54:59.518
lk10	LA-LK-010	RAM Corsair Vengeance 16GB DDR5 5600MHz	ram-corsair-ddr5-16gb	\N	16GB DDR5, Bus 5600MHz	1390000.00	\N	20	0	{/uploads/products/sample-ram.png}	/uploads/products/sample-ram.png	Corsair	\N	{mới}	\N	PUBLISHED	f	f	ram	2026-03-25 01:59:55.323	2026-04-24 10:54:59.551
lk12	LA-LK-012	VGA MSI RTX 4070 Ventus 2X OC 12GB	vga-msi-rtx-4070	\N	12GB GDDR6X, CUDA 5888, Boost Clock 2475MHz	13990000.00	15490000.00	4	0	{/uploads/products/sample-vga.png}	/uploads/products/sample-vga.png	MSI	\N	{"giảm giá"}	\N	PUBLISHED	t	f	vga	2026-03-25 01:59:55.345	2026-04-24 10:54:59.608
mh1	LA-MH-001	Màn hình LG 27GP850-B 27" 2K 180Hz	man-hinh-lg-27gp850	\N	27" Nano IPS, 2K, 180Hz, 1ms, G-Sync Compatible	8990000.00	9990000.00	8	0	{/uploads/products/sample-monitor-gaming.png}	/uploads/products/sample-monitor-gaming.png	LG	\N	{"bán chạy"}	\N	PUBLISHED	t	t	man-hinh-gaming	2026-03-25 01:59:55.503	2026-04-24 10:54:59.931
mh2	LA-MH-002	Màn hình Dell P2422H 24" FHD IPS	man-hinh-dell-p2422h	\N	24" IPS, FHD 60Hz, USB Hub, Chân xoay	4990000.00	\N	15	0	{/uploads/products/sample-monitor.png}	/uploads/products/sample-monitor.png	Dell	\N	{}	\N	PUBLISHED	f	f	man-hinh-van-phong	2026-03-25 01:59:55.511	2026-04-24 10:54:59.959
mh3	LA-MH-003	Màn hình Samsung Odyssey G7 32" 2K 240Hz	man-hinh-samsung-odyssey-g7	\N	32" VA Curved 1000R, 2K, 240Hz, 1ms	15990000.00	17990000.00	2	0	{/uploads/products/sample-monitor-gaming.png}	/uploads/products/sample-monitor-gaming.png	Samsung	\N	{mới}	\N	PUBLISHED	t	f	man-hinh-gaming	2026-03-25 01:59:55.521	2026-04-24 10:54:59.989
mh4	LA-MH-004	Màn hình ViewSonic VX2776-2K 27" 2K IPS	man-hinh-viewsonic-vx2776	\N	27" IPS, 2K, 75Hz, Viền mỏng	5490000.00	\N	10	0	{/uploads/products/sample-monitor.png}	/uploads/products/sample-monitor.png	ViewSonic	\N	{}	\N	PUBLISHED	f	f	man-hinh-van-phong	2026-03-25 10:11:19.869	2026-04-24 10:55:00.017
nv1	LA-NV-001	Bàn phím cơ AKKO 3098B Plus	ban-phim-akko-3098b	\N	Akko CS Lavender Purple, 98 phím, Wireless	1590000.00	1890000.00	20	0	{/uploads/products/sample-keyboard.png}	/uploads/products/sample-keyboard.png	AKKO	\N	{"bán chạy","giảm giá"}	\N	PUBLISHED	f	t	ban-phim	2026-03-25 01:59:55.438	2026-04-24 10:55:00.083
nv2	LA-NV-002	Chuột gaming Logitech G502 HERO	chuot-logitech-g502-hero	\N	HERO 25K sensor, 11 nút có thể lập trình	1290000.00	\N	24	0	{/uploads/products/sample-mouse.png}	/uploads/products/sample-mouse.png	Logitech	\N	{"bán chạy"}	\N	PUBLISHED	f	t	chuot	2026-03-25 01:59:55.451	2026-04-24 10:55:00.114
nv3	LA-NV-003	Tai nghe HyperX Cloud II	tai-nghe-hyperx-cloud-ii	\N	7.1 Surround, Mic có thể tháo, Memory foam	1990000.00	2490000.00	11	0	{/uploads/products/sample-headset.png}	/uploads/products/sample-headset.png	HyperX	\N	{"giảm giá"}	\N	PUBLISHED	f	f	tai-nghe	2026-03-25 01:59:55.465	2026-04-24 10:55:00.142
nv4	LA-NV-004	Bàn phím Corsair K70 RGB MK.2	ban-phim-corsair-k70	\N	Cherry MX Red, RGB per-key, USB passthrough	3990000.00	\N	8	0	{/uploads/products/sample-keyboard.png}	/uploads/products/sample-keyboard.png	Corsair	\N	{mới}	\N	PUBLISHED	f	f	ban-phim	2026-03-25 01:59:55.478	2026-04-24 10:55:00.172
nv5	LA-NV-005	Chuột Razer DeathAdder V3	chuot-razer-deathadder-v3	\N	Focus Pro 30K sensor, 59g, Wireless	1890000.00	\N	10	0	{/uploads/products/sample-mouse.png}	/uploads/products/sample-mouse.png	Razer	\N	{mới}	\N	PUBLISHED	f	f	chuot	2026-03-25 01:59:55.489	2026-04-24 10:55:00.2
nv6	LA-NV-006	Tai nghe SteelSeries Arctis 7+	tai-nghe-steelseries-arctis-7	\N	Wireless 2.4GHz, 32h pin, ChatMix dial	3990000.00	4490000.00	6	0	{/uploads/products/sample-headset.png}	/uploads/products/sample-headset.png	SteelSeries	\N	{"giảm giá"}	\N	PUBLISHED	f	f	tai-nghe	2026-03-25 01:59:55.495	2026-04-24 10:55:00.231
m2	LA-TBM-002	Mesh WiFi TP-Link Deco M4 (3-pack)	mesh-tplink-deco-m4	\N	Mesh WiFi AC1200, phủ 370m², 3 bộ	2490000.00	\N	10	0	{/uploads/products/sample-router.png}	/uploads/products/sample-router.png	TP-Link	\N	{}	\N	PUBLISHED	f	f	mesh-wifi	2026-03-25 01:59:55.368	2026-04-24 10:55:00.998
m3	LA-TBM-003	Switch TP-Link TL-SG108E 8 Port Gigabit	switch-tplink-sg108e	\N	8 Port Gigabit, Managed, VLAN	590000.00	\N	25	0	{/uploads/products/sample-switch.png}	/uploads/products/sample-switch.png	TP-Link	\N	{}	\N	PUBLISHED	f	f	switch	2026-03-25 01:59:55.38	2026-04-24 10:55:01.017
m4	LA-TBM-004	Router ASUS RT-AX1800S WiFi 6	router-asus-rt-ax1800s	\N	WiFi 6 AX1800, 4 ăng-ten, AiProtection	1090000.00	1290000.00	15	0	{/uploads/products/sample-router.png}	/uploads/products/sample-router.png	ASUS	\N	{"giảm giá"}	\N	PUBLISHED	f	f	router-wifi	2026-03-25 01:59:55.393	2026-04-24 10:55:01.039
c3	LA-CAM-003	Camera IMOU Ranger 2 3MP	camera-imou-ranger-2	\N	3MP, Xoay nghiêng, Theo dõi chuyển động	890000.00	1090000.00	15	0	{/uploads/products/sample-camera.png}	/uploads/products/sample-camera.png	IMOU	\N	{"giảm giá"}	\N	PUBLISHED	f	f	camera-trong-nha	2026-03-25 01:59:55.426	2026-04-24 10:54:59.26
lk4	LA-LK-004	VGA GIGABYTE RTX 4060 Eagle OC 8GB	vga-rtx-4060-eagle-oc	\N	8GB GDDR6, CUDA 3072, Boost Clock 2535MHz	7990000.00	8990000.00	8	0	{/uploads/products/sample-vga.png}	/uploads/products/sample-vga.png	Gigabyte	\N	{mới}	\N	PUBLISHED	t	f	vga	2026-03-25 01:59:55.243	2026-04-24 10:54:59.392
lk7	LA-LK-007	Case NZXT H5 Flow	case-nzxt-h5-flow	\N	Mid Tower, ATX, Tempered Glass, Airflow	2190000.00	\N	10	0	{/uploads/products/sample-case.png}	/uploads/products/sample-case.png	NZXT	\N	{mới}	\N	PUBLISHED	f	f	case	2026-03-25 01:59:55.284	2026-04-24 10:54:59.468
lk11	LA-LK-011	HDD Seagate BarraCuda 2TB	hdd-seagate-2tb	\N	2TB, 7200RPM, SATA3, 256MB Cache	1190000.00	\N	35	0	{/uploads/products/sample-ssd.png}	/uploads/products/sample-ssd.png	Seagate	\N	{}	\N	PUBLISHED	f	f	hdd	2026-03-25 01:59:55.335	2026-04-24 10:54:59.578
l1	LA-LT-001	Laptop Acer Aspire 5 A515-58M	acer-aspire-5-a515	\N	Intel Core i5-1335U, 8GB RAM, 512GB SSD, 15.6" FHD IPS	12990000.00	14990000.00	14	0	{/uploads/products/sample-laptop-1.png}	/uploads/products/sample-laptop-1.png	Acer	\N	{"bán chạy"}	{"CPU": "Intel Core i5-1335U", "RAM": "8GB DDR4", "Màn hình": "15.6\\" FHD IPS", "Ổ cứng": "512GB NVMe SSD"}	PUBLISHED	t	t	laptop-van-phong	2026-03-25 01:59:54.966	2026-04-24 10:54:59.636
l2	LA-LT-002	Laptop ASUS VivoBook 15 OLED	asus-vivobook-15-oled	\N	Intel Core i7-1355U, 16GB RAM, 512GB SSD, OLED 15.6"	15490000.00	17490000.00	8	0	{/uploads/products/sample-laptop-1.png}	/uploads/products/sample-laptop-1.png	ASUS	\N	{mới}	\N	PUBLISHED	t	f	laptop-van-phong	2026-03-25 01:59:54.974	2026-04-24 10:54:59.667
l5	LA-LT-005	Laptop MSI Katana 15 B13VFK	msi-katana-15	\N	Intel Core i7-13620H, RTX 4060, 16GB RAM, 512GB SSD	27990000.00	29990000.00	2	0	{/uploads/products/sample-laptop-gaming.png}	/uploads/products/sample-laptop-gaming.png	MSI	\N	{mới}	\N	PUBLISHED	t	f	laptop-gaming	2026-03-25 01:59:54.993	2026-04-24 10:54:59.756
l9	LA-LT-009	Laptop HP ProBook 450 G10	hp-probook-450	\N	Intel Core i5-1335U, 8GB RAM, 512GB SSD, 15.6" FHD	16990000.00	\N	10	0	{/uploads/products/sample-laptop-1.png}	/uploads/products/sample-laptop-1.png	HP	\N	{}	\N	PUBLISHED	f	f	laptop-van-phong	2026-03-25 01:59:55.015	2026-04-24 10:54:59.872
p2	LA-PC-002	PC Lộc An VP Core i5-12400	pc-loc-an-vp-i5	\N	Intel Core i5-12400, 16GB RAM, 512GB SSD	9490000.00	10490000.00	15	0	{/uploads/products/sample-pc-office.png}	/uploads/products/sample-pc-office.png	Lộc An	\N	{"bán chạy"}	\N	PUBLISHED	t	t	pc-van-phong	2026-03-25 01:59:55.03	2026-04-24 10:55:00.289
p6	LA-PC-006	PC Lộc An VP Core i5-13400	pc-loc-an-vp-i5-13	\N	Intel Core i5-13400, 16GB DDR5, 512GB SSD	11490000.00	12990000.00	8	0	{/uploads/products/sample-pc-office.png}	/uploads/products/sample-pc-office.png	Lộc An	\N	{mới}	\N	PUBLISHED	f	f	pc-van-phong	2026-03-25 01:59:55.057	2026-04-24 10:55:00.406
p10	LA-PC-010	PC Lộc An Đồ Họa R7-5800X	pc-loc-an-dh-r7	\N	AMD Ryzen 7 5800X, RTX 3070 8GB, 32GB RAM, 1TB SSD	22990000.00	24990000.00	3	0	{/uploads/products/sample-pc-office.png}	/uploads/products/sample-pc-office.png	Lộc An	\N	{"giảm giá"}	\N	PUBLISHED	f	f	pc-do-hoa	2026-03-25 01:59:55.097	2026-04-24 10:55:00.522
g2	LA-PG-002	PC Gaming Lộc An Thunder i5-13400F/RTX 4060	pc-gaming-thunder-i5-4060	\N	Intel Core i5-13400F, RTX 4060 8GB, 16GB DDR5, 512GB SSD	19990000.00	22490000.00	7	0	{/uploads/products/sample-pc-gaming.png}	/uploads/products/sample-pc-gaming.png	Lộc An	\N	{"bán chạy"}	\N	PUBLISHED	t	t	pc-gaming-tam-trung	2026-03-25 01:59:55.124	2026-04-24 10:55:00.581
g7	LA-PG-007	PC Gaming Lộc An Stream R7/RTX 4060	pc-gaming-stream-r7-4060	\N	AMD Ryzen 7 5800X3D, RTX 4060 8GB, 32GB DDR4, 1TB SSD	23990000.00	25990000.00	3	0	{/uploads/products/sample-pc-gaming.png}	/uploads/products/sample-pc-gaming.png	Lộc An	\N	{"giảm giá"}	\N	PUBLISHED	f	f	livestream	2026-03-25 01:59:55.172	2026-04-24 10:55:00.876
m1	LA-TBM-001	Router WiFi 6 TP-Link AX1500	router-tplink-ax1500	\N	WiFi 6 AX1500, 4 ăng-ten, Gigabit	890000.00	1090000.00	20	0	{/uploads/products/sample-router.png}	/uploads/products/sample-router.png	TP-Link	\N	{"bán chạy","giảm giá"}	\N	PUBLISHED	f	t	router-wifi	2026-03-25 01:59:55.357	2026-04-24 10:55:00.975
cmocl4an0000bsldsm21teyqe	LA-MZA-004	Laptop Acer Gaming Nitro ProPanel ANV16S-61-R9ZV NH.QXPSV.002	laptop-acer-gaming-nitro-propanel-anv16s-61-r9zv-nhqxpsv002	\N	\N	25000000.00	\N	10	0	{/uploads/products/1777015413256-53258-laptop-acer-gaming-nitro-v-16-ai-propanel-anv16s-61-r9.jpg}	/uploads/products/1777015413256-53258-laptop-acer-gaming-nitro-v-16-ai-propanel-anv16s-61-r9.jpg	Acer	\N	{mới}	{}	PUBLISHED	f	f	laptop	2026-04-24 07:24:12.636	2026-04-24 10:55:44.707
\.


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."RefreshToken" (id, token, "userId", "expiresAt", "createdAt") FROM stdin;
cmoclxbef000dslds53zbbd8h	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW9ja3NhNTEwMDAxc2xkczc2YWhhZ3I5IiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzcwMTY4MDYsImV4cCI6MTc3NzYyMTYwNn0.vtl-cD35jbK3KSD44mUWMJb_xZ6swFXafIfLk9n-aSE	cmocksa510001slds76ahagr9	2026-05-01 07:46:46.646	2026-04-24 07:46:46.647
cmocqumo8000fsldsjalegk57	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW9jbDEyMXUwMDA3c2xkc29lOXAxczlrIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzcwMjUwNzksImV4cCI6MTc3NzYyOTg3OX0.ttZ_67XaosEr7cytXtom-EPqk6WuKwLfvNeoatHrW_o	cmocl121u0007sldsoe9p1s9k	2026-05-01 10:04:39.368	2026-04-24 10:04:39.369
cmodq7yag0005jl3tlv04mfbw	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW9jbDEyMXUwMDA3c2xkc29lOXAxczlrIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzcwODQ0ODcsImV4cCI6MTc3NzY4OTI4N30.pkfkgv-W76xtbltuGb13MwM8R_-KdQbFPKLy5ntN-wc	cmocl121u0007sldsoe9p1s9k	2026-05-02 02:34:47.512	2026-04-25 02:34:47.513
cmodt43t00007jl3txzd9xybd	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW9jbDEyMXUwMDA3c2xkc29lOXAxczlrIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzcwODkzNDYsImV4cCI6MTc3NzY5NDE0Nn0.We49a9UHuwyXcUAnKtcmuJV9I-zWDCIldbyqpp4KWYk	cmocl121u0007sldsoe9p1s9k	2026-05-02 03:55:46.884	2026-04-25 03:55:46.885
cmos2ii180001v43fgauk9rzs	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW9jbDEyMXUwMDA3c2xkc29lOXAxczlrIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3Nzc5NTE2NjEsImV4cCI6MTc3ODU1NjQ2MX0.BIO5n12j0UyofmUjw_C8ZOuTCIoni8o_rRWppODsTLM	cmocl121u0007sldsoe9p1s9k	2026-05-12 03:27:41.493	2026-05-05 03:27:41.494
cmos2pwdv0005v43fit33e777	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW9zMm80azkwMDAwNmx4MmRvcjJhdmRnIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3Nzc5NTIwMDYsImV4cCI6MTc3ODU1NjgwNn0.G9B73UNIJRNvEKnDkpcwmB4aDCff6qlk3qQb2DOfoKM	cmos2o4k900006lx2dor2avdg	2026-05-12 03:33:26.707	2026-05-05 03:33:26.707
cmos2r6tm0007v43fb8tmuyfc	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW9zMm80azkwMDAwNmx4MmRvcjJhdmRnIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3Nzc5NTIwNjYsImV4cCI6MTc3ODU1Njg2Nn0.rfoKKbs_J1MHCiaiEvC-qlWaHgtpejp5Uyak2UmTr38	cmos2o4k900006lx2dor2avdg	2026-05-12 03:34:26.888	2026-05-05 03:34:26.89
cmosoa7ka000hv43fzm4q0rpl	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW9zMm80azkwMDAwNmx4MmRvcjJhdmRnIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3Nzc5ODgyMjYsImV4cCI6MTc3ODU5MzAyNn0.rkljbLcKhiPXSXi5dOKg1tEnx06AWGDq2wWfZDKDs-M	cmos2o4k900006lx2dor2avdg	2026-05-12 13:37:06.249	2026-05-05 13:37:06.25
cmov6glo7000xv43feyu09vzx	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW9zMm80azkwMDAwNmx4MmRvcjJhdmRnIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NzgxMzk2ODksImV4cCI6MTc3ODc0NDQ4OX0.YD7UExi6-sJtP3kufL46uULstvpCH7gzV6iPhBcYDLI	cmos2o4k900006lx2dor2avdg	2026-05-14 07:41:29.911	2026-05-07 07:41:29.912
\.


--
-- Data for Name: RepairRequest; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."RepairRequest" (id, "ticketNumber", "userId", "productId", "deviceBrand", "deviceModel", "deviceImei", "faultDescription", "faultImages", "estimatedCost", "actualCost", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: RepairTimeline; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."RepairTimeline" (id, "repairRequestId", status, note, "updatedBy", "createdAt") FROM stdin;
\.


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."Service" (id, name, slug, description, icon, image, features, "priceFrom", "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
s1	Sửa chữa laptop	sua-laptop	Sửa lỗi phần cứng, thay linh kiện, sửa bản lề, thay màn hình laptop các hãng	🔧	\N	{"Sửa lỗi phần cứng","Thay linh kiện","Sửa bản lề","Thay màn hình"}	200000.00	t	1	2026-03-25 01:59:55.664	2026-03-25 15:01:36.451
s2	Sửa chữa PC	sua-pc	Kiểm tra, sửa chữa máy tính bàn, thay thế linh kiện hỏng	🖥️	\N	{"Kiểm tra miễn phí","Sửa lỗi phần mềm","Thay thế linh kiện"}	150000.00	t	2	2026-03-25 01:59:55.67	2026-03-25 15:01:36.457
s3	Vệ sinh máy tính	ve-sinh-may-tinh	Vệ sinh bụi bẩn, thay keo tản nhiệt, giúp máy mát hơn và hoạt động ổn định	🧹	\N	{"Vệ sinh bụi bẩn","Thay keo tản nhiệt","Kiểm tra quạt"}	150000.00	t	3	2026-03-25 01:59:55.674	2026-03-25 15:01:36.464
s4	Cài Windows & phần mềm	cai-windows	Cài đặt hệ điều hành, driver, phần mềm bản quyền, diệt virus	💿	\N	{"Cài Windows bản quyền","Cài driver","Cài phần mềm văn phòng","Diệt virus"}	150000.00	t	4	2026-03-25 01:59:55.679	2026-03-25 15:01:36.469
s5	Nâng cấp SSD, RAM	nang-cap-ssd-ram	Nâng cấp RAM, SSD cho laptop và PC, giúp máy nhanh hơn đáng kể	💾	\N	{"Nâng cấp RAM","Nâng cấp SSD","Chuyển dữ liệu miễn phí"}	100000.00	t	5	2026-03-25 01:59:55.686	2026-03-25 15:01:36.474
s6	Lắp đặt camera	lap-dat-camera	Thi công lắp đặt hệ thống camera giám sát cho gia đình, cửa hàng, văn phòng	📷	\N	{"Tư vấn miễn phí","Thi công chuyên nghiệp","Bảo hành 12 tháng"}	3990000.00	t	6	2026-03-25 01:59:55.693	2026-03-25 15:01:36.478
s7	Thi công mạng nội bộ	thi-cong-mang	Thiết kế và thi công hệ thống mạng LAN, WiFi cho văn phòng, quán cafe	🌐	\N	{"Khảo sát miễn phí","Thiết kế mạng","Bảo hành 12 tháng"}	0.00	t	7	2026-03-25 01:59:55.701	2026-03-25 15:01:36.483
s8	Bảo trì máy tính văn phòng	bao-tri-van-phong	Dịch vụ bảo trì định kỳ cho doanh nghiệp, đảm bảo hệ thống luôn ổn định	🛡️	\N	{"Bảo trì định kỳ","Hỗ trợ từ xa","Ưu tiên xử lý"}	500000.00	t	8	2026-03-25 01:59:55.709	2026-03-25 15:01:36.487
\.


--
-- Data for Name: SiteConfig; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."SiteConfig" (id, "siteName", hotline, email, address, "workingHours", facebook, zalo, "footerText", "seoTitle", "seoDescription", "metaImage", "updatedAt") FROM stdin;
default	Lộc An - Máy tính & Dịch vụ IT	0989386219	info@locan.vn	7 La Dương, Hà Đông, Hà Nội	8:00 - 21:00 (Thứ 2 - Chủ nhật)	https://facebook.com/locantech	0989386219	© 2026 Lộc An. Chuyên máy tính, linh kiện, dịch vụ sửa chữa tại Hà Đông.	Lộc An - Máy tính, Linh kiện, Sửa chữa tại Hà Đông	Lộc An cung cấp laptop, PC, linh kiện máy tính chính hãng và dịch vụ sửa chữa uy tín tại Hà Đông, Hà Nội.	\N	2026-04-23 08:23:12.162
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."User" (id, email, "passwordHash", name, phone, role, status, avatar, "createdAt", "updatedAt") FROM stdin;
cmocksa510001slds76ahagr9	tranquanghuy0049@gmail.com	$2a$12$Nh7ayqoEKvh51lqxwuEm9OtgRw2HLDqKN24CNjv5MlMW.s7fxqYrC	Trần Quang Huy	0944991349	ADMIN	ACTIVE	\N	2026-04-24 07:14:52.117	2026-04-24 07:14:52.117
cmocl121u0007sldsoe9p1s9k	admin@locantech.com	$2a$12$ryXmOpfyV/6lMB93GvTbxu09ZmV21d4O18a.GELNEGqiXHFSXeQNW	Trần Văn Sỹ	0989386219	ADMIN	ACTIVE	\N	2026-04-24 07:21:41.537	2026-04-24 07:21:41.537
cmos2o4k900006lx2dor2avdg	admin@locan.vn	$2a$12$V7GIVklQiOISuTxLOhUxd./V166oEZ9sRomU5eiI5vIzafX7HDULi	LocAn Admin	0989386219	SUPERADMIN	ACTIVE	\N	2026-05-05 03:32:03.993	2026-05-05 03:32:03.993
\.


--
-- Data for Name: WishlistItem; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public."WishlistItem" (id, "userId", "productId", "createdAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: locan
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
be87827e-db34-4e4e-a1d2-6e0970323b1c	69bdfdc62c5e9c4d7ae0ac34499a2bd1e6de711694774a0e1d253780e172f0e5	2026-03-25 01:59:52.135432+00	20260324043207_init	\N	\N	2026-03-25 01:59:51.289783+00	1
54997761-05fd-46de-9361-3a6f67a89291	fcc373d3fc4026966666904b251b7700b86900a453f96d9b303a62cb2fd9d2f0	2026-03-25 01:59:52.176738+00	20260324102916_add_site_config	\N	\N	2026-03-25 01:59:52.141161+00	1
0c326d8e-4962-4944-9314-df293f24fc85	907e3f3fa89b379f4bf49388b746e521ec151dffbcb56c23e44d83c6015714c2	2026-03-26 06:42:25.710308+00	20260326064225_allow_guest_orders	\N	\N	2026-03-26 06:42:25.68908+00	1
\.


--
-- Name: Banner Banner_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."Banner"
    ADD CONSTRAINT "Banner_pkey" PRIMARY KEY (id);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: News News_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."News"
    ADD CONSTRAINT "News_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: RefreshToken RefreshToken_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY (id);


--
-- Name: RepairRequest RepairRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."RepairRequest"
    ADD CONSTRAINT "RepairRequest_pkey" PRIMARY KEY (id);


--
-- Name: RepairTimeline RepairTimeline_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."RepairTimeline"
    ADD CONSTRAINT "RepairTimeline_pkey" PRIMARY KEY (id);


--
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- Name: SiteConfig SiteConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."SiteConfig"
    ADD CONSTRAINT "SiteConfig_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: WishlistItem WishlistItem_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Banner_position_isActive_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Banner_position_isActive_idx" ON public."Banner" USING btree ("position", "isActive");


--
-- Name: CartItem_userId_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "CartItem_userId_idx" ON public."CartItem" USING btree ("userId");


--
-- Name: CartItem_userId_productId_key; Type: INDEX; Schema: public; Owner: locan
--

CREATE UNIQUE INDEX "CartItem_userId_productId_key" ON public."CartItem" USING btree ("userId", "productId");


--
-- Name: Category_parentId_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Category_parentId_idx" ON public."Category" USING btree ("parentId");


--
-- Name: Category_slug_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Category_slug_idx" ON public."Category" USING btree (slug);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: locan
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: News_isPublished_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "News_isPublished_idx" ON public."News" USING btree ("isPublished");


--
-- Name: News_slug_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "News_slug_idx" ON public."News" USING btree (slug);


--
-- Name: News_slug_key; Type: INDEX; Schema: public; Owner: locan
--

CREATE UNIQUE INDEX "News_slug_key" ON public."News" USING btree (slug);


--
-- Name: OrderItem_orderId_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "OrderItem_orderId_idx" ON public."OrderItem" USING btree ("orderId");


--
-- Name: Order_createdAt_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Order_createdAt_idx" ON public."Order" USING btree ("createdAt");


--
-- Name: Order_orderNumber_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Order_orderNumber_idx" ON public."Order" USING btree ("orderNumber");


--
-- Name: Order_orderNumber_key; Type: INDEX; Schema: public; Owner: locan
--

CREATE UNIQUE INDEX "Order_orderNumber_key" ON public."Order" USING btree ("orderNumber");


--
-- Name: Order_status_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Order_status_idx" ON public."Order" USING btree (status);


--
-- Name: Order_userId_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Order_userId_idx" ON public."Order" USING btree ("userId");


--
-- Name: Product_categoryId_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Product_categoryId_idx" ON public."Product" USING btree ("categoryId");


--
-- Name: Product_isFeatured_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Product_isFeatured_idx" ON public."Product" USING btree ("isFeatured");


--
-- Name: Product_price_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Product_price_idx" ON public."Product" USING btree (price);


--
-- Name: Product_sku_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Product_sku_idx" ON public."Product" USING btree (sku);


--
-- Name: Product_sku_key; Type: INDEX; Schema: public; Owner: locan
--

CREATE UNIQUE INDEX "Product_sku_key" ON public."Product" USING btree (sku);


--
-- Name: Product_slug_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Product_slug_idx" ON public."Product" USING btree (slug);


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: locan
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: Product_status_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Product_status_idx" ON public."Product" USING btree (status);


--
-- Name: RefreshToken_token_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "RefreshToken_token_idx" ON public."RefreshToken" USING btree (token);


--
-- Name: RefreshToken_token_key; Type: INDEX; Schema: public; Owner: locan
--

CREATE UNIQUE INDEX "RefreshToken_token_key" ON public."RefreshToken" USING btree (token);


--
-- Name: RefreshToken_userId_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "RefreshToken_userId_idx" ON public."RefreshToken" USING btree ("userId");


--
-- Name: RepairRequest_status_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "RepairRequest_status_idx" ON public."RepairRequest" USING btree (status);


--
-- Name: RepairRequest_ticketNumber_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "RepairRequest_ticketNumber_idx" ON public."RepairRequest" USING btree ("ticketNumber");


--
-- Name: RepairRequest_ticketNumber_key; Type: INDEX; Schema: public; Owner: locan
--

CREATE UNIQUE INDEX "RepairRequest_ticketNumber_key" ON public."RepairRequest" USING btree ("ticketNumber");


--
-- Name: RepairRequest_userId_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "RepairRequest_userId_idx" ON public."RepairRequest" USING btree ("userId");


--
-- Name: RepairTimeline_repairRequestId_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "RepairTimeline_repairRequestId_idx" ON public."RepairTimeline" USING btree ("repairRequestId");


--
-- Name: Service_isActive_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Service_isActive_idx" ON public."Service" USING btree ("isActive");


--
-- Name: Service_slug_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "Service_slug_idx" ON public."Service" USING btree (slug);


--
-- Name: Service_slug_key; Type: INDEX; Schema: public; Owner: locan
--

CREATE UNIQUE INDEX "Service_slug_key" ON public."Service" USING btree (slug);


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: locan
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: WishlistItem_userId_idx; Type: INDEX; Schema: public; Owner: locan
--

CREATE INDEX "WishlistItem_userId_idx" ON public."WishlistItem" USING btree ("userId");


--
-- Name: WishlistItem_userId_productId_key; Type: INDEX; Schema: public; Owner: locan
--

CREATE UNIQUE INDEX "WishlistItem_userId_productId_key" ON public."WishlistItem" USING btree ("userId", "productId");


--
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CartItem CartItem_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Category Category_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RefreshToken RefreshToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RepairRequest RepairRequest_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."RepairRequest"
    ADD CONSTRAINT "RepairRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RepairRequest RepairRequest_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."RepairRequest"
    ADD CONSTRAINT "RepairRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RepairTimeline RepairTimeline_repairRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."RepairTimeline"
    ADD CONSTRAINT "RepairTimeline_repairRequestId_fkey" FOREIGN KEY ("repairRequestId") REFERENCES public."RepairRequest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WishlistItem WishlistItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WishlistItem WishlistItem_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: locan
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: locan
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict I9P8x7lvngiidn6Gq26zUu2YLkE1I2fVtFC8VHUi4eRoI1odHVOtb3uQRorWy3s

