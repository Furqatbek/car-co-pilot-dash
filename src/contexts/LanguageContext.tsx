import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ar' | 'pt' | 'ru' | 'ja' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.profile': 'Profile',
    'nav.notifications': 'Notifications',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
    
    // Service Centers
    'services.title': 'Service Centers',
    'services.findNearby': 'Find Nearby Places',
    'services.enableLocation': 'Enable Location',
    'services.searchByCategory': 'Search by Category',
    'services.serviceCenters': 'Service Centers',
    'services.carWash': 'Car Wash',
    'services.gasStations': 'Gas Stations',
    'services.getDirections': 'Get Directions',
    'services.routeTo': 'Route to',
    'services.foundPlaces': 'Found Places',
    'services.clickCategory': 'Click a category to search',
    'services.searching': 'Searching...',
    'services.kmAway': 'km away',
    
    // Profile
    'profile.title': 'Profile',
    'profile.language': 'Language',
    'profile.selectLanguage': 'Select Language',
    'profile.carInfo': 'Car Information',
    'profile.personalInfo': 'Personal Information',
    'profile.fullName': 'Full Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone Number',
    'profile.carMake': 'Car Make',
    'profile.carModel': 'Car Model',
    'profile.carYear': 'Car Year',
    'profile.carPlate': 'License Plate',
    'profile.subscription': 'Subscription',
    'profile.logout': 'Logout',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.profile': 'Perfil',
    'nav.notifications': 'Notificaciones',
    
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.back': 'Atrás',
    
    'services.title': 'Centros de Servicio',
    'services.findNearby': 'Encontrar Lugares Cercanos',
    'services.enableLocation': 'Activar Ubicación',
    'services.searchByCategory': 'Buscar por Categoría',
    'services.serviceCenters': 'Centros de Servicio',
    'services.carWash': 'Lavado de Autos',
    'services.gasStations': 'Gasolineras',
    'services.getDirections': 'Obtener Direcciones',
    'services.routeTo': 'Ruta a',
    'services.foundPlaces': 'Lugares Encontrados',
    'services.clickCategory': 'Haz clic en una categoría para buscar',
    'services.searching': 'Buscando...',
    'services.kmAway': 'km de distancia',
    
    'profile.title': 'Perfil',
    'profile.language': 'Idioma',
    'profile.selectLanguage': 'Seleccionar Idioma',
    'profile.carInfo': 'Información del Automóvil',
    'profile.personalInfo': 'Información Personal',
    'profile.fullName': 'Nombre Completo',
    'profile.email': 'Correo Electrónico',
    'profile.phone': 'Número de Teléfono',
    'profile.carMake': 'Marca del Auto',
    'profile.carModel': 'Modelo del Auto',
    'profile.carYear': 'Año del Auto',
    'profile.carPlate': 'Placa',
    'profile.subscription': 'Suscripción',
    'profile.logout': 'Cerrar Sesión',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.profile': 'Profil',
    'nav.notifications': 'Notifications',
    
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.back': 'Retour',
    
    'services.title': 'Centres de Service',
    'services.findNearby': 'Trouver des Lieux à Proximité',
    'services.enableLocation': 'Activer la Localisation',
    'services.searchByCategory': 'Rechercher par Catégorie',
    'services.serviceCenters': 'Centres de Service',
    'services.carWash': 'Lavage Auto',
    'services.gasStations': 'Stations-Service',
    'services.getDirections': 'Obtenir l\'Itinéraire',
    'services.routeTo': 'Route vers',
    'services.foundPlaces': 'Lieux Trouvés',
    'services.clickCategory': 'Cliquez sur une catégorie pour rechercher',
    'services.searching': 'Recherche...',
    'services.kmAway': 'km',
    
    'profile.title': 'Profil',
    'profile.language': 'Langue',
    'profile.selectLanguage': 'Sélectionner la Langue',
    'profile.carInfo': 'Informations sur la Voiture',
    'profile.personalInfo': 'Informations Personnelles',
    'profile.fullName': 'Nom Complet',
    'profile.email': 'Email',
    'profile.phone': 'Numéro de Téléphone',
    'profile.carMake': 'Marque',
    'profile.carModel': 'Modèle',
    'profile.carYear': 'Année',
    'profile.carPlate': 'Plaque',
    'profile.subscription': 'Abonnement',
    'profile.logout': 'Se Déconnecter',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.services': 'Dienstleistungen',
    'nav.profile': 'Profil',
    'nav.notifications': 'Benachrichtigungen',
    
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.back': 'Zurück',
    
    'services.title': 'Servicezentren',
    'services.findNearby': 'Orte in der Nähe Finden',
    'services.enableLocation': 'Standort Aktivieren',
    'services.searchByCategory': 'Nach Kategorie Suchen',
    'services.serviceCenters': 'Servicezentren',
    'services.carWash': 'Autowäsche',
    'services.gasStations': 'Tankstellen',
    'services.getDirections': 'Wegbeschreibung',
    'services.routeTo': 'Route nach',
    'services.foundPlaces': 'Gefundene Orte',
    'services.clickCategory': 'Klicken Sie auf eine Kategorie zum Suchen',
    'services.searching': 'Suchen...',
    'services.kmAway': 'km entfernt',
    
    'profile.title': 'Profil',
    'profile.language': 'Sprache',
    'profile.selectLanguage': 'Sprache Wählen',
    'profile.carInfo': 'Fahrzeuginformationen',
    'profile.personalInfo': 'Persönliche Informationen',
    'profile.fullName': 'Vollständiger Name',
    'profile.email': 'E-Mail',
    'profile.phone': 'Telefonnummer',
    'profile.carMake': 'Automarke',
    'profile.carModel': 'Automodell',
    'profile.carYear': 'Baujahr',
    'profile.carPlate': 'Kennzeichen',
    'profile.subscription': 'Abonnement',
    'profile.logout': 'Abmelden',
  },
  zh: {
    'nav.home': '主页',
    'nav.services': '服务',
    'nav.profile': '个人资料',
    'nav.notifications': '通知',
    
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.back': '返回',
    
    'services.title': '服务中心',
    'services.findNearby': '查找附近地点',
    'services.enableLocation': '启用位置',
    'services.searchByCategory': '按类别搜索',
    'services.serviceCenters': '服务中心',
    'services.carWash': '洗车',
    'services.gasStations': '加油站',
    'services.getDirections': '获取路线',
    'services.routeTo': '前往',
    'services.foundPlaces': '找到的地点',
    'services.clickCategory': '点击类别进行搜索',
    'services.searching': '搜索中...',
    'services.kmAway': '公里',
    
    'profile.title': '个人资料',
    'profile.language': '语言',
    'profile.selectLanguage': '选择语言',
    'profile.carInfo': '车辆信息',
    'profile.personalInfo': '个人信息',
    'profile.fullName': '全名',
    'profile.email': '电子邮件',
    'profile.phone': '电话号码',
    'profile.carMake': '汽车品牌',
    'profile.carModel': '汽车型号',
    'profile.carYear': '年份',
    'profile.carPlate': '车牌',
    'profile.subscription': '订阅',
    'profile.logout': '退出登录',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات',
    'nav.profile': 'الملف الشخصي',
    'nav.notifications': 'الإشعارات',
    
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.back': 'رجوع',
    
    'services.title': 'مراكز الخدمة',
    'services.findNearby': 'العثور على أماكن قريبة',
    'services.enableLocation': 'تفعيل الموقع',
    'services.searchByCategory': 'البحث حسب الفئة',
    'services.serviceCenters': 'مراكز الخدمة',
    'services.carWash': 'غسيل السيارات',
    'services.gasStations': 'محطات الوقود',
    'services.getDirections': 'الحصول على الاتجاهات',
    'services.routeTo': 'الطريق إلى',
    'services.foundPlaces': 'الأماكن الموجودة',
    'services.clickCategory': 'انقر على فئة للبحث',
    'services.searching': 'جاري البحث...',
    'services.kmAway': 'كم',
    
    'profile.title': 'الملف الشخصي',
    'profile.language': 'اللغة',
    'profile.selectLanguage': 'اختر اللغة',
    'profile.carInfo': 'معلومات السيارة',
    'profile.personalInfo': 'المعلومات الشخصية',
    'profile.fullName': 'الاسم الكامل',
    'profile.email': 'البريد الإلكتروني',
    'profile.phone': 'رقم الهاتف',
    'profile.carMake': 'صانع السيارة',
    'profile.carModel': 'طراز السيارة',
    'profile.carYear': 'السنة',
    'profile.carPlate': 'لوحة الترخيص',
    'profile.subscription': 'الاشتراك',
    'profile.logout': 'تسجيل الخروج',
  },
  pt: {
    'nav.home': 'Início',
    'nav.services': 'Serviços',
    'nav.profile': 'Perfil',
    'nav.notifications': 'Notificações',
    
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.back': 'Voltar',
    
    'services.title': 'Centros de Serviço',
    'services.findNearby': 'Encontrar Locais Próximos',
    'services.enableLocation': 'Ativar Localização',
    'services.searchByCategory': 'Buscar por Categoria',
    'services.serviceCenters': 'Centros de Serviço',
    'services.carWash': 'Lava-Rápido',
    'services.gasStations': 'Postos de Gasolina',
    'services.getDirections': 'Obter Direções',
    'services.routeTo': 'Rota para',
    'services.foundPlaces': 'Locais Encontrados',
    'services.clickCategory': 'Clique em uma categoria para pesquisar',
    'services.searching': 'Pesquisando...',
    'services.kmAway': 'km de distância',
    
    'profile.title': 'Perfil',
    'profile.language': 'Idioma',
    'profile.selectLanguage': 'Selecionar Idioma',
    'profile.carInfo': 'Informações do Carro',
    'profile.personalInfo': 'Informações Pessoais',
    'profile.fullName': 'Nome Completo',
    'profile.email': 'Email',
    'profile.phone': 'Número de Telefone',
    'profile.carMake': 'Marca do Carro',
    'profile.carModel': 'Modelo do Carro',
    'profile.carYear': 'Ano',
    'profile.carPlate': 'Placa',
    'profile.subscription': 'Assinatura',
    'profile.logout': 'Sair',
  },
  ru: {
    'nav.home': 'Главная',
    'nav.services': 'Услуги',
    'nav.profile': 'Профиль',
    'nav.notifications': 'Уведомления',
    
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.back': 'Назад',
    
    'services.title': 'Сервисные Центры',
    'services.findNearby': 'Найти Ближайшие Места',
    'services.enableLocation': 'Включить Местоположение',
    'services.searchByCategory': 'Поиск по Категории',
    'services.serviceCenters': 'Сервисные Центры',
    'services.carWash': 'Автомойка',
    'services.gasStations': 'АЗС',
    'services.getDirections': 'Показать Маршрут',
    'services.routeTo': 'Маршрут к',
    'services.foundPlaces': 'Найдено Мест',
    'services.clickCategory': 'Нажмите на категорию для поиска',
    'services.searching': 'Поиск...',
    'services.kmAway': 'км',
    
    'profile.title': 'Профиль',
    'profile.language': 'Язык',
    'profile.selectLanguage': 'Выбрать Язык',
    'profile.carInfo': 'Информация об Автомобиле',
    'profile.personalInfo': 'Личная Информация',
    'profile.fullName': 'Полное Имя',
    'profile.email': 'Email',
    'profile.phone': 'Номер Телефона',
    'profile.carMake': 'Марка',
    'profile.carModel': 'Модель',
    'profile.carYear': 'Год',
    'profile.carPlate': 'Номер',
    'profile.subscription': 'Подписка',
    'profile.logout': 'Выйти',
  },
  ja: {
    'nav.home': 'ホーム',
    'nav.services': 'サービス',
    'nav.profile': 'プロフィール',
    'nav.notifications': '通知',
    
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.back': '戻る',
    
    'services.title': 'サービスセンター',
    'services.findNearby': '近くの場所を探す',
    'services.enableLocation': '位置情報を有効にする',
    'services.searchByCategory': 'カテゴリーで検索',
    'services.serviceCenters': 'サービスセンター',
    'services.carWash': '洗車',
    'services.gasStations': 'ガソリンスタンド',
    'services.getDirections': 'ルートを取得',
    'services.routeTo': 'までのルート',
    'services.foundPlaces': '見つかった場所',
    'services.clickCategory': 'カテゴリーをクリックして検索',
    'services.searching': '検索中...',
    'services.kmAway': 'km',
    
    'profile.title': 'プロフィール',
    'profile.language': '言語',
    'profile.selectLanguage': '言語を選択',
    'profile.carInfo': '車両情報',
    'profile.personalInfo': '個人情報',
    'profile.fullName': '氏名',
    'profile.email': 'メール',
    'profile.phone': '電話番号',
    'profile.carMake': 'メーカー',
    'profile.carModel': 'モデル',
    'profile.carYear': '年式',
    'profile.carPlate': 'ナンバープレート',
    'profile.subscription': 'サブスクリプション',
    'profile.logout': 'ログアウト',
  },
  hi: {
    'nav.home': 'होम',
    'nav.services': 'सेवाएं',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.notifications': 'सूचनाएं',
    
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.back': 'वापस',
    
    'services.title': 'सर्विस सेंटर',
    'services.findNearby': 'आस-पास के स्थान खोजें',
    'services.enableLocation': 'स्थान सक्षम करें',
    'services.searchByCategory': 'श्रेणी द्वारा खोजें',
    'services.serviceCenters': 'सर्विस सेंटर',
    'services.carWash': 'कार वॉश',
    'services.gasStations': 'पेट्रोल पंप',
    'services.getDirections': 'दिशा-निर्देश प्राप्त करें',
    'services.routeTo': 'के लिए मार्ग',
    'services.foundPlaces': 'मिले स्थान',
    'services.clickCategory': 'खोजने के लिए एक श्रेणी पर क्लिक करें',
    'services.searching': 'खोज रहे हैं...',
    'services.kmAway': 'किमी',
    
    'profile.title': 'प्रोफ़ाइल',
    'profile.language': 'भाषा',
    'profile.selectLanguage': 'भाषा चुनें',
    'profile.carInfo': 'कार की जानकारी',
    'profile.personalInfo': 'व्यक्तिगत जानकारी',
    'profile.fullName': 'पूरा नाम',
    'profile.email': 'ईमेल',
    'profile.phone': 'फोन नंबर',
    'profile.carMake': 'कार ब्रांड',
    'profile.carModel': 'कार मॉडल',
    'profile.carYear': 'वर्ष',
    'profile.carPlate': 'लाइसेंस प्लेट',
    'profile.subscription': 'सदस्यता',
    'profile.logout': 'लॉगआउट',
  },
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  zh: '中文',
  ar: 'العربية',
  pt: 'Português',
  ru: 'Русский',
  ja: '日本語',
  hi: 'हिन्दी',
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language from user profile
    const loadLanguage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('language')
          .eq('user_id', user.id)
          .single();
        
        if (profile?.language) {
          setLanguageState(profile.language as Language);
        }
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    
    // Save to user profile
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ language: lang })
        .eq('user_id', user.id);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
