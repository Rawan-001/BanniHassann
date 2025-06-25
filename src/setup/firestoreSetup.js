// setup/firestoreSetup.js هو هذا الملف بس للاختبار فقققققط
import { collection, addDoc, getFirestore, writeBatch, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const sampleData = {
  cafes: [
    {
      name: 'مقهى الجبل الأخضر',
      description: 'مقهى تراثي يقع في قلب بني حسن، يتميز بالأجواء الشعبية الأصيلة والإطلالة الساحرة على الجبال المحيطة. يقدم القهوة العربية الأصيلة والشاي بأنواعه المختلفة.',
      location: 'شارع الملك عبدالعزيز، بني حسن، الباحة',
      images: [],
      videos: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rating: 4.3,
      popularity: '85% (زيارات)',
      openingHours: '6:00 صباحاً - 12:00 منتصف الليل',
      contactInfo: '0507123456',
      price: '15-30 ريال',
      features: ['واي فاي مجاني', 'جلسات خارجية', 'قهوة عربية', 'حلويات تراثية'],
      views: 150,
      likes: 23
    },
    {
      name: 'كافيه الضباب',
      description: 'كافيه عصري يوفر تجربة فريدة مع الضباب الطبيعي في أجواء بني حسن الجميلة. مكان مثالي للاسترخاء والاستمتاع بالطبيعة.',
      location: 'طريق الطائف، بني حسن، الباحة',
      images: [],
      videos: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rating: 4.7,
      popularity: '92% (زيارات)',
      openingHours: '7:00 صباحاً - 11:00 مساء',
      contactInfo: '0501234567',
      price: '20-45 ريال',
      features: ['إطلالة جبلية', 'مشروبات ساخنة', 'حلويات', 'أجواء هادئة'],
      views: 320,
      likes: 45
    }
  ],

  dams: [
    {
      name: 'سد بني حسن',
      description: 'سد طبيعي جميل يقع في منطقة بني حسن، يتميز بالمياه الصافية والمناظر الطبيعية الخلابة. مكان مثالي للنزهات العائلية والتصوير.',
      location: 'وادي بني حسن، الباحة',
      images: [],
      videos: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rating: 4.6,
      popularity: '78% (زيارات)',
      openingHours: 'على مدار الساعة',
      contactInfo: 'إدارة المتنزهات 0172234567',
      price: 'مجاني',
      features: ['مياه عذبة', 'مناظر طبيعية', 'مناسب للعائلات', 'تصوير'],
      views: 280,
      likes: 67
    }
  ],

  parks: [
    {
      name: 'منتزه الأمير محمد بن سعود',
      description: 'منتزه عائلي واسع يضم مساحات خضراء واسعة وألعاب للأطفال ومرافق متكاملة. يوفر أجواء مثالية للنزهات العائلية والاستجمام.',
      location: 'حي النخيل، بني حسن، الباحة',
      images: [],
      videos: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rating: 4.4,
      popularity: '88% (زيارات)',
      openingHours: '6:00 صباحاً - 10:00 مساء',
      contactInfo: '0172345678',
      price: '10 ريال للكبار، 5 ريال للأطفال',
      features: ['ألعاب أطفال', 'مساحات خضراء', 'مواقف سيارات', 'دورات مياه'],
      views: 450,
      likes: 89
    },
    {
      name: 'غابة رغدان',
      description: 'غابة طبيعية كثيفة تتميز بأشجار العرعر والطلح وتنوع النباتات البرية. مكان مثالي للمشي وسط الطبيعة والتخييم.',
      location: 'طريق غابة رغدان، بني حسن، الباحة',
      images: [],
      videos: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rating: 4.8,
      popularity: '95% (زيارات)',
      openingHours: '5:00 صباحاً - 8:00 مساء',
      contactInfo: 'هيئة تطوير المنطقة 0501876543',
      price: 'مجاني',
      features: ['مسارات مشي', 'تخييم', 'مراقبة الطيور', 'هواء نقي'],
      views: 620,
      likes: 134
    }
  ],

  housing: [
    {
      name: 'شاليهات الضباب',
      description: 'شاليهات سياحية فاخرة تطل على الجبال مع إطلالة ساحرة. تحتوي على جميع المرافق الحديثة وتوفر تجربة إقامة مميزة وسط الطبيعة.',
      location: 'طريق الشفا، بني حسن، الباحة',
      images: [],
      videos: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rating: 4.5,
      popularity: '82% (حجوزات)',
      openingHours: 'استقبال على مدار الساعة',
      contactInfo: '0506789012',
      price: '250-400 ريال/الليلة',
      features: ['مطبخ مجهز', 'تكييف', 'واي فاي', 'إطلالة جبلية'],
      views: 380,
      likes: 72
    },
    {
      name: 'منتجع الجبال الخضراء',
      description: 'منتجع سياحي متكامل يوفر غرف وأجنحة مع إطلالات بانورامية على المناظر الطبيعية. يضم مطعماً ومرافق ترفيهية متنوعة.',
      location: 'شارع السياحة، بني حسن، الباحة',
      images: [],
      videos: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rating: 4.2,
      popularity: '76% (حجوزات)',
      openingHours: 'استقبال على مدار الساعة',
      contactInfo: '0172567890',
      price: '180-350 ريال/الليلة',
      features: ['مطعم', 'مسبح', 'صالة رياضة', 'خدمة الغرف'],
      views: 290,
      likes: 53
    }
  ],

  viewpoints: [
    {
      name: 'مطل مراوة',
      description: 'مطل مراوة يقع في حي الروضة، يتميز بإطلالة ساحرة على جبال السروات وإطلالة بانورامية على المنطقة المحيطة. يعتبر من أجمل المطلات في بني حسن.',
      location: '6338/3517، الروضة، الباحة 65524',
      images: [],
      videos: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rating: 4.5,
      popularity: '80% (زيارات)',
      openingHours: 'على مدار الساعة',
      contactInfo: 'غير متوفر',
      price: 'مجاني',
      features: ['إطلالة جبلية', 'تصوير', 'مناسب للعائلات', 'مواقف سيارات'],
      views: 520,
      likes: 98
    },
    {
      name: 'مطل تهامة',
      description: 'مطل تهامة يقع في منطقة الزرقاء، يوفر مناظر خلابة لجبال تهامة والسهول المحيطة. مكان مثالي لمشاهدة غروب الشمس والاستمتاع بالطبيعة.',
      location: '3427 معتب بن أبي لهب، الزرقاء، الباحة 65522',
      images: [],
      videos: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rating: 4.2,
      popularity: '75% (زيارات)',
      openingHours: 'على مدار الساعة',
      contactInfo: 'غير متوفر',
      price: 'مجاني',
      features: ['مشاهدة الغروب', 'تصوير', 'هواء عليل', 'سهولة الوصول'],
      views: 410,
      likes: 76
    }
  ],

  farms: [
    {
      name: 'مزرعة الورود العضوية',
      description: 'مزرعة متخصصة في زراعة الورود والنباتات العطرية بطرق عضوية طبيعية. تقدم جولات تعليمية وورش عمل في الزراعة العضوية.',
      location: 'وادي الأحسبة، بني حسن، الباحة',
      images: [],
      videos: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rating: 4.6,
      popularity: '73% (زيارات)',
      openingHours: '8:00 صباحاً - 5:00 مساء',
      contactInfo: '0503456789',
      price: '20 ريال للجولة التعليمية',
      features: ['زراعة عضوية', 'جولات تعليمية', 'منتجات طبيعية', 'ورش عمل'],
      views: 180,
      likes: 34
    },
    {
      name: 'مزرعة النخيل التراثية',
      description: 'مزرعة تراثية تضم أنواع مختلفة من النخيل والنباتات المحلية. تحافظ على التراث الزراعي للمنطقة وتقدم تجربة تعليمية ممتعة.',
      location: 'طريق القرى التراثية، بني حسن، الباحة',
      images: [],
      videos: [],
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      rating: 4.3,
      popularity: '68% (زيارات)',
      openingHours: '7:00 صباحاً - 6:00 مساء',
      contactInfo: '0172789123',
      price: '15 ريال للزيارة',
      features: ['تراث زراعي', 'أنواع نخيل', 'منتجات تمور', 'تعليم تراثي'],
      views: 125,
      likes: 28
    }
  ]
};

export const initializeCollections = async () => {
  const batch = writeBatch(db);
  const maxBatchSize = 500;
  let operationCount = 0;

  for (const [category, items] of Object.entries(sampleData)) {
    for (const item of items) {
      const docRef = doc(collection(db, category));
      batch.set(docRef, item);
      operationCount++;
      if (operationCount >= maxBatchSize) {
        await batch.commit();
        operationCount = 0;
      }
    }
  }
  if (operationCount > 0) {
    await batch.commit();
  }
};

export const addSampleData = async (category, data) => {
  const collectionRef = collection(db, category);
  await addDoc(collectionRef, data);
};

export const firestoreSecurityRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tourism sites collections
    match /{collection}/{document} {
      // Allow read access to all active tourism sites
      allow read: if resource.data.isActive == true;
      
      // Allow write access only to authenticated admin users
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // Admin collection for user management
    match /admins/{userId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == userId;
    }
    
    // Analytics collection
    match /analytics/{document} {
      allow read: if request.auth != null && 
                     request.auth.token.admin == true;
      allow write: if request.auth != null;
    }
  }
}
`;

export const createAdminUser = async (userId, userData) => {
  try {
    const docRef = doc(db, 'admins', userId);
    await setDoc(docRef, {
      ...userData,
      role: 'admin',
      createdAt: serverTimestamp(),
      isActive: true
    });
    
    console.log('Admin user created successfully');
    return true;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

export default {
  initializeCollections,
  addSampleData,
  createAdminUser,
  sampleData
};