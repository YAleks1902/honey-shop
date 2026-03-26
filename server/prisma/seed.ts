import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categories = await prisma.category.createMany({
    data: [
      { name: 'Мёд', slug: 'med', imageUrl: '/uploads/cat-honey.jpg' },
      { name: 'Орехи', slug: 'orehi', imageUrl: '/uploads/cat-nuts.jpg' },
      { name: 'Продукты пчеловодства', slug: 'produkty-pchelovodstva', imageUrl: '/uploads/cat-beekeeping.jpg' },
    ],
  });

  console.log(`Created ${categories.count} categories`);

  const honeyCategory = await prisma.category.findUnique({ where: { slug: 'med' } });
  const nutsCategory = await prisma.category.findUnique({ where: { slug: 'orehi' } });

  const honeyProducts = [
    {
      name: 'Липовый мёд с малиной',
      slug: 'lipovyj-med-s-malinoj',
      shortDescription: 'Вкусный и полезный мёд, богат на витамины.',
      fullDescription: 'Равным образом сложившаяся структура организации представляет собой интересный эксперимент проверки новых предложений. Равным образом дальнейшее развитие различных форм деятельности играет важную роль в формировании форм развития.',
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
      categoryId: honeyCategory!.id,
      harvestDate: '17/05/2021',
      state: 'жидкий',
      crystalSize: 'не содержит',
      isFeatured: true,
      isActive: true,
      stock: 50,
      variants: [
        { volume: '0.5 л', priceCents: 111250, oldPriceCents: 117105, discountPercent: 5 },
        { volume: '1 л', priceCents: 195000, oldPriceCents: 205260, discountPercent: 5 },
        { volume: '3 л', priceCents: 520000, oldPriceCents: 547368, discountPercent: 5 },
        { volume: '5 л', priceCents: 800000, oldPriceCents: 842105, discountPercent: 5 },
      ],
    },
    {
      name: 'Гречишный мёд',
      slug: 'grechishnyj-med',
      shortDescription: 'Тёмный ароматный мёд с насыщенным вкусом.',
      fullDescription: 'Гречишный мёд — один из самых полезных видов мёда. Имеет тёмно-коричневый цвет и характерный терпкий вкус. Богат железом и белком.',
      imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&q=80',
      categoryId: honeyCategory!.id,
      harvestDate: '20/07/2021',
      state: 'жидкий',
      crystalSize: 'мелкий',
      isFeatured: true,
      isActive: true,
      stock: 35,
      variants: [
        { volume: '0.5 л', priceCents: 111250, oldPriceCents: 117105, discountPercent: 5 },
        { volume: '1 л', priceCents: 195000, oldPriceCents: 205260, discountPercent: 5 },
        { volume: '3 л', priceCents: 520000, oldPriceCents: 547368, discountPercent: 5 },
        { volume: '5 л', priceCents: 800000, oldPriceCents: 842105, discountPercent: 5 },
      ],
    },
    {
      name: 'Акациевый мёд',
      slug: 'akacievyj-med',
      shortDescription: 'Светлый прозрачный мёд с нежным вкусом.',
      fullDescription: 'Акациевый мёд — самый популярный вид. Светло-янтарного цвета, долго не кристаллизуется. Имеет тонкий цветочный аромат и деликатный вкус.',
      imageUrl: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&q=80',
      categoryId: honeyCategory!.id,
      harvestDate: '10/06/2021',
      state: 'жидкий',
      crystalSize: 'не содержит',
      isFeatured: true,
      isActive: true,
      stock: 60,
      variants: [
        { volume: '0.5 л', priceCents: 111250, oldPriceCents: 117105, discountPercent: 5 },
        { volume: '1 л', priceCents: 195000, oldPriceCents: 205260, discountPercent: 5 },
        { volume: '3 л', priceCents: 520000, oldPriceCents: 547368, discountPercent: 5 },
        { volume: '5 л', priceCents: 800000, oldPriceCents: 842105, discountPercent: 5 },
      ],
    },
    {
      name: 'Цветочный мёд',
      slug: 'cvetochnyj-med',
      shortDescription: 'Ароматный полевой мёд из разнотравья.',
      fullDescription: 'Цветочный мёд собирается с различных цветущих растений. Имеет светло-жёлтый или янтарный цвет, нежный аромат и сладкий вкус с лёгкой кислинкой.',
      imageUrl: 'https://images.unsplash.com/photo-1568721169670-16c0b53b8f0d?w=600&q=80',
      categoryId: honeyCategory!.id,
      harvestDate: '05/07/2021',
      state: 'кремовый',
      crystalSize: 'мелкий',
      isFeatured: true,
      isActive: true,
      stock: 45,
      variants: [
        { volume: '0.5 л', priceCents: 111250, oldPriceCents: 117105, discountPercent: 5 },
        { volume: '1 л', priceCents: 195000, oldPriceCents: 205260, discountPercent: 5 },
        { volume: '3 л', priceCents: 520000, oldPriceCents: 547368, discountPercent: 5 },
        { volume: '5 л', priceCents: 800000, oldPriceCents: 842105, discountPercent: 5 },
      ],
    },
    {
      name: 'Таёжный мёд',
      slug: 'tajozhnyj-med',
      shortDescription: 'Мёд из хвойного леса с особым вкусом.',
      fullDescription: 'Таёжный мёд собирается в экологически чистых районах тайги. Имеет насыщенный тёмно-янтарный цвет и характерный хвойный аромат.',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80',
      categoryId: honeyCategory!.id,
      harvestDate: '25/08/2021',
      state: 'жидкий',
      crystalSize: 'средний',
      isFeatured: false,
      isActive: true,
      stock: 20,
      variants: [
        { volume: '0.5 л', priceCents: 111250, oldPriceCents: 117105, discountPercent: 5 },
        { volume: '1 л', priceCents: 195000, oldPriceCents: 205260, discountPercent: 5 },
        { volume: '3 л', priceCents: 520000, oldPriceCents: 547368, discountPercent: 5 },
        { volume: '5 л', priceCents: 800000, oldPriceCents: 842105, discountPercent: 5 },
      ],
    },
    {
      name: 'Каштановый мёд',
      slug: 'kashtanovyj-med',
      shortDescription: 'Горьковатый мёд с тёмным цветом.',
      fullDescription: 'Каштановый мёд имеет специфический горьковатый привкус, тёмно-коричневый цвет. Долго не кристаллизуется, содержит большое количество минеральных веществ.',
      imageUrl: 'https://images.unsplash.com/photo-1601063476271-a159c71ab0b3?w=600&q=80',
      categoryId: honeyCategory!.id,
      harvestDate: '15/09/2021',
      state: 'жидкий',
      crystalSize: 'не содержит',
      isFeatured: false,
      isActive: true,
      stock: 30,
      variants: [
        { volume: '0.5 л', priceCents: 111250, oldPriceCents: 117105, discountPercent: 5 },
        { volume: '1 л', priceCents: 195000, oldPriceCents: 205260, discountPercent: 5 },
        { volume: '3 л', priceCents: 520000, oldPriceCents: 547368, discountPercent: 5 },
        { volume: '5 л', priceCents: 800000, oldPriceCents: 842105, discountPercent: 5 },
      ],
    },
    {
      name: 'Подсолнечный мёд',
      slug: 'podsolnechnyj-med',
      shortDescription: 'Золотистый мёд с ярким ароматом.',
      fullDescription: 'Подсолнечный мёд — один из наиболее распространённых видов в России. Ярко-жёлтого цвета, быстро кристаллизуется, имеет приятный вкус.',
      imageUrl: 'https://images.unsplash.com/photo-1592903297149-37fb25202dfa?w=600&q=80',
      categoryId: honeyCategory!.id,
      harvestDate: '01/08/2021',
      state: 'кристаллизованный',
      crystalSize: 'крупный',
      isFeatured: false,
      isActive: true,
      stock: 55,
      variants: [
        { volume: '0.5 л', priceCents: 111250, oldPriceCents: 117105, discountPercent: 5 },
        { volume: '1 л', priceCents: 195000, oldPriceCents: 205260, discountPercent: 5 },
        { volume: '3 л', priceCents: 520000, oldPriceCents: 547368, discountPercent: 5 },
        { volume: '5 л', priceCents: 800000, oldPriceCents: 842105, discountPercent: 5 },
      ],
    },
    {
      name: 'Липовый мёд',
      slug: 'lipovyj-med',
      shortDescription: 'Классический липовый мёд с нежным вкусом.',
      fullDescription: 'Липовый мёд — один из лучших сортов мёда. Светло-янтарного цвета, обладает тонким ароматом липы и нежным вкусом с лёгкой горчинкой.',
      imageUrl: 'https://images.unsplash.com/photo-1579765853788-3bfe7e7e9c83?w=600&q=80',
      categoryId: honeyCategory!.id,
      harvestDate: '12/07/2021',
      state: 'жидкий',
      crystalSize: 'мелкий',
      isFeatured: false,
      isActive: true,
      stock: 40,
      variants: [
        { volume: '0.5 л', priceCents: 111250, oldPriceCents: 117105, discountPercent: 5 },
        { volume: '1 л', priceCents: 195000, oldPriceCents: 205260, discountPercent: 5 },
        { volume: '3 л', priceCents: 520000, oldPriceCents: 547368, discountPercent: 5 },
        { volume: '5 л', priceCents: 800000, oldPriceCents: 842105, discountPercent: 5 },
      ],
    },
  ];

  for (const product of honeyProducts) {
    const { variants, ...productData } = product;
    const created = await prisma.product.create({
      data: {
        ...productData,
        variants: { create: variants },
      },
    });
    console.log(`Created product: ${created.name}`);
  }

  if (nutsCategory) {
    await prisma.product.create({
      data: {
        name: 'Грецкий орех',
        slug: 'greckij-oreh',
        shortDescription: 'Отборные грецкие орехи из Кадымки.',
        fullDescription: 'Свежие грецкие орехи, собранные вручную. Богаты омега-3, белком и минералами.',
        imageUrl: 'https://images.unsplash.com/photo-1536591375443-65a9f4c0d9c5?w=600&q=80',
        categoryId: nutsCategory.id,
        harvestDate: '10/10/2021',
        state: 'сухой',
        crystalSize: null,
        isFeatured: false,
        isActive: true,
        stock: 100,
        variants: {
          create: [
            { volume: '0.5 кг', priceCents: 45000, oldPriceCents: 47368, discountPercent: 5 },
            { volume: '1 кг', priceCents: 80000, oldPriceCents: 84210, discountPercent: 5 },
          ],
        },
      },
    });
  }

  const allProducts = await prisma.product.findMany({ take: 3 });

  const reviews = [
    {
      productId: allProducts[0].id,
      authorName: 'Андрей Петров',
      authorCity: 'г.Москва',
      comment: 'Первый раз заказал мёд для своей семьи. В итоге все были довольны, мёд безумно вкусный. Буду заказывать и советовать своим друзьям. Огромное спасибо за подарочный набор.',
    },
    {
      productId: allProducts[0].id,
      authorName: 'Мария Иванова',
      authorCity: 'г.Санкт-Петербург',
      comment: 'Отличный мёд! Натуральный, ароматный. Доставка быстрая, упаковка надёжная. Рекомендую всем!',
    },
    {
      productId: allProducts[1].id,
      authorName: 'Сергей Козлов',
      authorCity: 'г.Казань',
      comment: 'Заказываю уже третий раз. Качество стабильно высокое. Семья очень довольна.',
    },
    {
      productId: allProducts[2].id,
      authorName: 'Анна Смирнова',
      authorCity: 'г.Екатеринбург',
      comment: 'Прекрасный мёд, покупаю для всей семьи. Дети обожают! Спасибо за качество.',
    },
  ];

  await prisma.review.createMany({ data: reviews });
  console.log(`Created ${reviews.length} reviews`);

  const passwordHash = await bcrypt.hash('password123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash,
      firstName: 'Иван',
      lastName: 'Петров',
      phone: '8-029-222-22-22',
      country: 'Россия',
      city: 'Москва',
      address: 'Улица Пушкина Дом 23',
      isVerified: true,
      isAdmin: true,
    },
  });
  console.log('Created test user (admin): test@example.com / password123');

  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Как выбрать настоящий мёд',
        slug: 'kak-vybrat-nastoyashchij-myod',
        excerpt: 'Несколько простых советов, которые помогут вам отличить натуральный мёд от подделки.',
        content: `Натуральный мёд — это один из самых полезных продуктов, которые дарит нам природа. Однако на рынке нередко встречаются подделки. Как же выбрать настоящий мёд?\n\n## Цвет и прозрачность\n\nСвежий мёд должен быть прозрачным или слегка мутным. Чрезмерная прозрачность может свидетельствовать о добавлении сахарного сиропа.\n\n## Консистенция\n\nНатуральный мёд тянется тонкой нитью при поднятии ложки. Если мёд капает отдельными каплями — скорее всего, в него добавлена вода.\n\n## Аромат\n\nКачественный мёд обладает насыщенным цветочным ароматом. Слабый или химический запах — признак подделки.\n\n## Кристаллизация\n\nБольшинство сортов натурального мёда кристаллизуется через 1–3 месяца. Если мёд хранится жидким годами — это повод насторожиться.`,
        imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
        authorId: adminUser.id,
        isPublished: true,
      },
      {
        title: 'Польза мёда для здоровья',
        slug: 'polza-myoda-dlya-zdorovya',
        excerpt: 'Учёные подтверждают: регулярное употребление мёда укрепляет иммунитет и улучшает самочувствие.',
        content: `Мёд используется в народной медицине тысячелетиями. Современная наука подтверждает многие его полезные свойства.\n\n## Антибактериальные свойства\n\nМёд содержит перекись водорода и другие вещества, угнетающие рост бактерий. Именно поэтому его применяют при лечении ран и ожогов.\n\n## Богатый состав\n\nВ мёде содержится более 300 различных веществ: витамины группы B, витамин C, калий, кальций, магний, железо и многие другие минералы.\n\n## Укрепление иммунитета\n\nРегулярное употребление мёда — особенно в сочетании с имбирём и лимоном — помогает укрепить иммунную систему и противостоять простудным заболеваниям.\n\n## Улучшение сна\n\nЛожка мёда перед сном способствует выработке серотонина и помогает быстрее засыпать.`,
        imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80',
        authorId: adminUser.id,
        isPublished: true,
      },
      {
        title: 'Сезон сбора мёда в Кадымке',
        slug: 'sezon-sbora-myoda-v-kadymke',
        excerpt: 'Рассказываем о том, как проходит сезон сбора мёда на нашей пасеке.',
        content: `Каждый год с конца мая по сентябрь на нашей пасеке в селе Кадымка кипит работа. Именно в этот период пчёлы собирают нектар с цветущих лугов и лесов.\n\n## Весенний мёд\n\nПервый мёд сезона — акациевый и цветочный. Он собирается в мае-июне, когда цветут акации, яблони и луговые травы. Этот мёд отличается светлым цветом и нежным вкусом.\n\n## Летний мёд\n\nС июня по август пчёлы работают особенно активно. В этот период мы получаем липовый, гречишный и полевой мёд — самые популярные и полезные сорта.\n\n## Осенний мёд\n\nВ конце лета и начале осени собирается последний мёд сезона. Он более тёмный и насыщенный, богат минеральными веществами.\n\n## Зимовка\n\nС наступлением холодов пчёлы уходят на зимовку. Мы бережно готовим ульи, оставляя пчёлам достаточно запасов для зимы.`,
        imageUrl: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&q=80',
        authorId: adminUser.id,
        isPublished: true,
      },
    ],
  });
  console.log('Created 3 blog posts');
  console.log('Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
