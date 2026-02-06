import 'dotenv/config';
import { PrismaClient, ProductStatus, Condition } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    const now = new Date();
    const days = (n: number) => 1000 * 60 * 60 * 24 * n;

    const saleWindow = {
        saleStart: new Date(now.getTime() - days(5)),
        saleEnd: new Date(now.getTime() + days(9)),
    };

    const categories = [
        'Ultra-Portable',
        'Creator',
        'Business',
        'Gaming',
        'Workstation',
        'Student',
        'Sustainable',
        '2-in-1',
        'Deals',
        'One-of-a-kind',
    ];

    const categoryBySlug = new Map<string, { id: string; slug: string; name: string }>();
    for (const name of categories) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const cat = await prisma.category.upsert({
            where: { slug },
            update: { name },
            create: { name, slug },
        });
        categoryBySlug.set(slug, cat);
    }

    // Using reliable Unsplash laptop images
    const laptopImages = {
        macbookPro: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        macbookAir: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
        dellXps: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
        thinkpad: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
        surface: 'https://images.unsplash.com/photo-1617004906421-c98df9717f0e?w=800&q=80',
        gaming: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
        generic1: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
        generic2: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80',
        generic3: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
        generic4: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80',
        generic5: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&q=80',
    };

    const products: Array<{
        slug: string;
        title: string;
        brand: string;
        model: string;
        description: string;
        condition: Condition;
        status: ProductStatus;
        priceAmount: number;
        salePriceAmount?: number;
        saleStart?: Date;
        saleEnd?: Date;
        warrantyMonths: number;
        returnPolicyDays: number;
        stockRemaining: number;
        specsJson: Record<string, string | number | boolean>;
        highlightsJson: string[];
        categories: string[];
        images?: Array<{ url: string; alt?: string; sortOrder?: number }>;
    }> = [
            {
                slug: 'asus-zenbook-17-fold-oled',
                title: 'ASUS Zenbook 17 Fold OLED',
                brand: 'ASUS',
                model: 'UX9702',
                description: 'A foldable 17.3-inch OLED that shifts between compact carry and a full desktop-scale workspace.',
                condition: Condition.NEW,
                status: ProductStatus.ACTIVE,
                priceAmount: 450000,
                warrantyMonths: 24,
                returnPolicyDays: 14,
                stockRemaining: 3,
                specsJson: {
                    cpu: 'Intel Core i7-1250U',
                    gpu: 'Intel Iris Xe',
                    ram_gb: 16,
                    storage_gb: 1000,
                    storage_type: 'SSD',
                    screen_size_in: 17.3,
                    resolution: '2560 × 1920 FOLED',
                    os: 'Windows 11',
                    touch: true,
                    foldable: true,
                },
                highlightsJson: ['17.3" foldable OLED touch display', 'Multi-mode hinge design', 'Bluetooth keyboard included'],
                categories: ['one-of-a-kind', 'creator'],
                images: [
                    {
                        url: laptopImages.generic3,
                        alt: 'ASUS Zenbook 17 Fold OLED',
                        sortOrder: 0,
                    },
                ],
            },
            {
                slug: 'macbook-pro-16',
                title: 'MacBook Pro 16"',
                brand: 'Apple',
                model: 'MacBook Pro 16',
                description: 'Sustained Apple silicon power for pro workflows with a studio-grade display and quiet thermals.',
                condition: Condition.NEW,
                status: ProductStatus.ACTIVE,
                priceAmount: 395000,
                salePriceAmount: 369000,
                saleStart: saleWindow.saleStart,
                saleEnd: saleWindow.saleEnd,
                warrantyMonths: 12,
                returnPolicyDays: 7,
                stockRemaining: 10,
                specsJson: {
                    cpu: 'Apple Silicon',
                    ram_gb: 32,
                    storage_gb: 1000,
                    storage_type: 'SSD',
                    screen_size_in: 16.2,
                    resolution: '3456 × 2234',
                    os: 'macOS',
                    color: 'Space Gray',
                },
                highlightsJson: ['Liquid Retina XDR display', 'Six-speaker sound system', 'All-day battery life'],
                categories: ['creator', 'business', 'deals'],
                images: [
                    {
                        url: laptopImages.macbookPro,
                        alt: 'MacBook Pro 16"',
                        sortOrder: 0,
                    },
                ],
            },
            {
                slug: 'dell-xps-13',
                title: 'Dell XPS 13',
                brand: 'Dell',
                model: 'XPS 13',
                description: 'Compact craftsmanship with an InfinityEdge display and a premium aluminum build.',
                condition: Condition.REFURBISHED,
                status: ProductStatus.ACTIVE,
                priceAmount: 275000,
                warrantyMonths: 12,
                returnPolicyDays: 14,
                stockRemaining: 6,
                specsJson: {
                    cpu: 'Intel Core i7',
                    gpu: 'Intel Iris Xe',
                    ram_gb: 16,
                    storage_gb: 512,
                    storage_type: 'SSD',
                    screen_size_in: 13.4,
                    resolution: '1920 × 1200',
                    os: 'Windows 11',
                },
                highlightsJson: ['InfinityEdge display', 'CNC aluminum build', 'Ultra-light footprint'],
                categories: ['ultra-portable', 'business', 'deals'],
                images: [
                    {
                        url: laptopImages.dellXps,
                        alt: 'Dell XPS 13',
                        sortOrder: 0,
                    },
                ],
            },
            {
                slug: 'surface-laptop-studio',
                title: 'Surface Laptop Studio',
                brand: 'Microsoft',
                model: 'Surface Laptop Studio',
                description: 'A dynamic woven hinge that glides from laptop mode to a creative studio canvas.',
                condition: Condition.NEW,
                status: ProductStatus.ACTIVE,
                priceAmount: 420000,
                warrantyMonths: 12,
                returnPolicyDays: 14,
                stockRemaining: 8,
                specsJson: {
                    cpu: 'Intel Core i7',
                    gpu: 'NVIDIA RTX',
                    ram_gb: 32,
                    storage_gb: 1000,
                    storage_type: 'SSD',
                    screen_size_in: 14.4,
                    resolution: '2400 × 1600',
                    os: 'Windows 11',
                    touch: true,
                },
                highlightsJson: ['Dynamic woven hinge', 'Studio-mode touch display', 'Creator-focused chassis'],
                categories: ['2-in-1', 'creator'],
                images: [
                    {
                        url: laptopImages.surface,
                        alt: 'Surface Laptop Studio',
                        sortOrder: 0,
                    },
                ],
            },
            {
                slug: 'framework-laptop-13',
                title: 'Framework Laptop 13',
                brand: 'Framework',
                model: 'Laptop 13',
                description: 'Built for longevity with modular ports, user-serviceable parts, and easy upgrades.',
                condition: Condition.NEW,
                status: ProductStatus.ACTIVE,
                priceAmount: 240000,
                warrantyMonths: 24,
                returnPolicyDays: 14,
                stockRemaining: 12,
                specsJson: {
                    cpu: 'AMD Ryzen',
                    gpu: 'Integrated Radeon',
                    ram_gb: 16,
                    storage_gb: 512,
                    storage_type: 'SSD',
                    screen_size_in: 13.5,
                    resolution: '2256 × 1504',
                    os: 'Windows 11',
                    repairable: true,
                },
                highlightsJson: ['Modular expansion ports', 'User-repairable design', 'Upgrade-friendly internals'],
                categories: ['sustainable', 'business', 'student'],
                images: [
                    {
                        url: laptopImages.generic1,
                        alt: 'Framework Laptop 13',
                        sortOrder: 0,
                    },
                ],
            },
            {
                slug: 'lenovo-thinkpad-x1-carbon',
                title: 'ThinkPad X1 Carbon',
                brand: 'Lenovo',
                model: 'X1 Carbon',
                description: 'A business-class featherweight with legendary keyboard feel and travel-ready durability.',
                condition: Condition.REFURBISHED,
                status: ProductStatus.ACTIVE,
                priceAmount: 210000,
                warrantyMonths: 6,
                returnPolicyDays: 14,
                stockRemaining: 14,
                specsJson: {
                    cpu: 'Intel Core i7',
                    gpu: 'Intel Integrated',
                    ram_gb: 16,
                    storage_gb: 512,
                    storage_type: 'SSD',
                    screen_size_in: 14,
                    os: 'Windows 11',
                    weight_kg: 1.12,
                },
                highlightsJson: ['Military-grade durability', 'Excellent keyboard', 'All-day battery'],
                categories: ['business', 'ultra-portable', 'deals'],
                images: [
                    {
                        url: laptopImages.thinkpad,
                        alt: 'ThinkPad X1 Carbon',
                        sortOrder: 0,
                    },
                ],
            },
            {
                slug: 'hp-spectre-x360-14',
                title: 'HP Spectre x360 14',
                brand: 'HP',
                model: 'Spectre x360 14',
                description: 'Premium 2-in-1 flexibility with a vivid display and pen-ready responsiveness.',
                condition: Condition.NEW,
                status: ProductStatus.ACTIVE,
                priceAmount: 260000,
                warrantyMonths: 12,
                returnPolicyDays: 14,
                stockRemaining: 9,
                specsJson: {
                    cpu: 'Intel Core i7',
                    gpu: 'Intel Iris Xe',
                    ram_gb: 16,
                    storage_gb: 1000,
                    storage_type: 'SSD',
                    screen_size_in: 14,
                    os: 'Windows 11',
                    touch: true,
                    convertible: true,
                },
                highlightsJson: ['2-in-1 hinge', 'Touch + pen support', 'Premium build'],
                categories: ['2-in-1', 'student', 'creator'],
                images: [
                    {
                        url: laptopImages.generic2,
                        alt: 'HP Spectre x360 14',
                        sortOrder: 0,
                    },
                ],
            },
            {
                slug: 'asus-rog-zephyrus-g14',
                title: 'ASUS ROG Zephyrus G14',
                brand: 'ASUS',
                model: 'Zephyrus G14',
                description: 'Compact gaming power tuned for high refresh play and creator workloads on the go.',
                condition: Condition.NEW,
                status: ProductStatus.ACTIVE,
                priceAmount: 315000,
                warrantyMonths: 12,
                returnPolicyDays: 7,
                stockRemaining: 7,
                specsJson: {
                    cpu: 'AMD Ryzen 9',
                    gpu: 'NVIDIA RTX',
                    ram_gb: 16,
                    storage_gb: 1000,
                    storage_type: 'SSD',
                    screen_size_in: 14,
                    refresh_hz: 120,
                    os: 'Windows 11',
                },
                highlightsJson: ['High-refresh display', 'Punchy performance', 'Portable chassis'],
                categories: ['gaming', 'creator'],
                images: [
                    {
                        url: laptopImages.gaming,
                        alt: 'ASUS ROG Zephyrus G14',
                        sortOrder: 0,
                    },
                ],
            },
            {
                slug: 'acer-nitro-5',
                title: 'Acer Nitro 5',
                brand: 'Acer',
                model: 'Nitro 5',
                description: 'Value-first gaming performance with room to grow and upgrade over time.',
                condition: Condition.REFURBISHED,
                status: ProductStatus.ACTIVE,
                priceAmount: 165000,
                warrantyMonths: 6,
                returnPolicyDays: 14,
                stockRemaining: 11,
                specsJson: {
                    cpu: 'Intel Core i5',
                    gpu: 'NVIDIA GTX/RTX',
                    ram_gb: 16,
                    storage_gb: 512,
                    storage_type: 'SSD',
                    screen_size_in: 15.6,
                    os: 'Windows 11',
                },
                highlightsJson: ['Great value', 'Upgradeable RAM/storage', 'Dedicated graphics'],
                categories: ['gaming', 'deals', 'student'],
                images: [
                    {
                        url: laptopImages.generic4,
                        alt: 'Acer Nitro 5',
                        sortOrder: 0,
                    },
                ],
            },
            {
                slug: 'dell-precision-5570',
                title: 'Dell Precision 5570',
                brand: 'Dell',
                model: 'Precision 5570',
                description: 'Mobile workstation built for CAD, 3D, and heavy multitasking with pro graphics options.',
                condition: Condition.REFURBISHED,
                status: ProductStatus.ACTIVE,
                priceAmount: 340000,
                warrantyMonths: 6,
                returnPolicyDays: 7,
                stockRemaining: 4,
                specsJson: {
                    cpu: 'Intel Core i7/i9',
                    gpu: 'NVIDIA RTX A-series',
                    ram_gb: 32,
                    storage_gb: 1000,
                    storage_type: 'SSD',
                    screen_size_in: 15.6,
                    os: 'Windows 11 Pro',
                },
                highlightsJson: ['Workstation-class build', 'Pro GPU options', 'High performance under load'],
                categories: ['workstation', 'business', 'creator'],
                images: [
                    {
                        url: laptopImages.generic5,
                        alt: 'Dell Precision 5570',
                        sortOrder: 0,
                    },
                ],
            },
            {
                slug: 'apple-macbook-air-13',
                title: 'MacBook Air 13"',
                brand: 'Apple',
                model: 'MacBook Air 13',
                description: 'Silent, slim, and fast—perfect for study, travel, and everyday creative work.',
                condition: Condition.NEW,
                status: ProductStatus.ACTIVE,
                priceAmount: 190000,
                salePriceAmount: 179000,
                saleStart: saleWindow.saleStart,
                saleEnd: saleWindow.saleEnd,
                warrantyMonths: 12,
                returnPolicyDays: 7,
                stockRemaining: 18,
                specsJson: {
                    cpu: 'Apple Silicon',
                    gpu: 'Integrated',
                    ram_gb: 16,
                    storage_gb: 512,
                    storage_type: 'SSD',
                    screen_size_in: 13.6,
                    os: 'macOS',
                },
                highlightsJson: ['Fanless design', 'Great battery life', 'Premium build'],
                categories: ['student', 'ultra-portable', 'deals'],
                images: [
                    {
                        url: laptopImages.macbookAir,
                        alt: 'MacBook Air 13',
                        sortOrder: 0,
                    },
                ],
            },
        ];

    for (const p of products) {
        const categoryConnect = (p.categories ?? []).map((slug) => {
            const cat = categoryBySlug.get(slug);
            if (!cat) throw new Error(`Unknown category slug: ${slug}`);
            return { categoryId: cat.id };
        });

        const imageCreate = (p.images ?? []).map((img, idx) => ({
            url: img.url,
            alt: img.alt ?? p.title,
            sortOrder: typeof img.sortOrder === 'number' ? img.sortOrder : idx,
        }));

        await prisma.product.upsert({
            where: { slug: p.slug },
            update: {
                title: p.title,
                brand: p.brand,
                model: p.model,
                description: p.description,
                condition: p.condition,
                status: p.status,
                priceAmount: p.priceAmount,
                salePriceAmount: p.salePriceAmount ?? null,
                saleStart: p.saleStart ?? null,
                saleEnd: p.saleEnd ?? null,
                warrantyMonths: p.warrantyMonths,
                returnPolicyDays: p.returnPolicyDays,
                stockRemaining: p.stockRemaining,
                specsJson: p.specsJson,
                highlightsJson: p.highlightsJson,
                categories: {
                    deleteMany: {},
                    create: categoryConnect,
                },
                images: {
                    deleteMany: {},
                    create: imageCreate,
                },
            },
            create: {
                slug: p.slug,
                title: p.title,
                brand: p.brand,
                model: p.model,
                description: p.description,
                condition: p.condition,
                status: p.status,
                priceAmount: p.priceAmount,
                salePriceAmount: p.salePriceAmount ?? null,
                saleStart: p.saleStart ?? null,
                saleEnd: p.saleEnd ?? null,
                warrantyMonths: p.warrantyMonths,
                returnPolicyDays: p.returnPolicyDays,
                stockRemaining: p.stockRemaining,
                specsJson: p.specsJson,
                highlightsJson: p.highlightsJson,
                categories: {
                    create: categoryConnect,
                },
                images: {
                    create: imageCreate,
                },
            },
        });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@hercles.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'HerclesAdmin!2026';
    const demoEmail = process.env.DEMO_EMAIL || 'demo@hercles.com';
    const demoPassword = process.env.DEMO_PASSWORD || 'demo1234';

    const adminPasswordHash = await hash(adminPassword, 10);
    const demoPasswordHash = await hash(demoPassword, 10);

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: 'ADMIN', passwordHash: adminPasswordHash, name: 'Hercles Admin' },
        create: {
            email: adminEmail,
            passwordHash: adminPasswordHash,
            role: 'ADMIN',
            name: 'Hercles Admin',
        },
    });

    const demoUser = await prisma.user.upsert({
        where: { email: demoEmail },
        update: { name: 'Demo Customer', passwordHash: demoPasswordHash },
        create: {
            email: demoEmail,
            passwordHash: demoPasswordHash,
            role: 'USER',
            name: 'Demo Customer',
        },
    });

    const existingDemoOrders = await prisma.order.count({ where: { userId: demoUser.id } });
    if (existingDemoOrders === 0) {
        const picked = await prisma.product.findMany({
            where: { slug: { in: ['macbook-pro-16', 'dell-xps-13', 'framework-laptop-13'] } },
            select: { id: true, title: true, priceAmount: true, salePriceAmount: true, saleStart: true, saleEnd: true },
        });

        const getPrice = (p: (typeof picked)[number]) => {
            const saleActive = p.salePriceAmount && (!p.saleStart || now >= p.saleStart) && (!p.saleEnd || now <= p.saleEnd);
            return saleActive ? p.salePriceAmount! : p.priceAmount;
        };

        const items = picked.map((p, idx) => ({
            productId: p.id,
            titleSnapshot: p.title,
            priceSnapshot: getPrice(p),
            quantity: idx === 0 ? 1 : 2,
        }));

        const subtotal = items.reduce((sum, i) => sum + i.priceSnapshot * i.quantity, 0);
        const shipping = subtotal >= 300000 ? 0 : 2500;

        await prisma.order.create({
            data: {
                userId: demoUser.id,
                customerEmail: demoUser.email,
                customerName: demoUser.name ?? 'Demo Customer',
                phone: '+254700000000',
                addressJson: {
                    address1: 'Westlands',
                    address2: 'Near the mall',
                    city: 'Nairobi',
                    state: 'Nairobi County',
                    country: 'Kenya',
                    postalCode: '00100',
                },
                subtotal,
                shipping,
                total: subtotal + shipping,
                currency: 'KES',
                status: 'DELIVERED',
                paymentStatus: 'PAID',
                items: { create: items },
                internalNotes: 'Seeded demo order',
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
