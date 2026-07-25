import type { Locale } from '../config';

/**
 * Every string on the marketing pages. Legal documents are Markdown files
 * (src/data/legal/<lang>/) — they are documents, not UI, and must stay diffable.
 */
const STRINGS = {
  en: {
    'nav.label': 'Main',
    'nav.home': 'Home',
    'nav.game': 'The game',
    'nav.screens': 'Screens',
    'nav.support': 'Support',

    'cta.get': 'Get it on Google Play',
    'cta.soon': 'Coming soon to Google Play',
    'cta.android': 'Android · Free to play · No ads',

    'home.title': 'SIEGELINE RIVALS — real-time siege warfare on Android',
    'home.description':
      'A mobile real-time strategy game: mine gold, raise a base from tier 1 to tier 3, command squads, and break your rival’s siege line. Free to play on Android, in English and Arabic.',
    'hero.kicker': 'Mobile real-time strategy',
    'hero.tagline': 'Build the base. Command the squads. Break their line.',
    'hero.blurb':
      'Head-to-head siege warfare built for a phone screen. Ten minutes, one map, one rival — no endless base-building timers.',

    'game.eyebrow': 'What you do',
    'game.title': 'Three things, done well',
    'game.p1.title': 'Take the ground',
    'game.p1.body':
      'Gold sits in mines scattered across a fogged map. Workers dig, scouts push the fog back, and every metre you hold is a metre your rival cannot mine.',
    'game.p2.title': 'Raise the siege line',
    'game.p2.body':
      'Build anywhere you control. Push your main tower from tier 1 to tier 3 to unlock factories, labs, air pads and the units that actually end games.',
    'game.p3.title': 'Command, don’t micro',
    'game.p3.body':
      'Orders go to squads, not individual soldiers. Tap the ground to march in formation, tap an enemy to focus it — readable with one thumb, on a bus.',

    'screens.eyebrow': 'In game',
    'screens.title': 'A real match, not a mockup',
    'screens.note': 'Captured in the Unity client during a live match.',
    'screens.shot1': 'Your first tower, a worker on the nearest gold mine, and fog everywhere else.',
    'screens.shot2': 'A tier-3 base in full production, with the build bar open.',
    'screens.shot3': 'Scouting forward — the enemy base appears out of the fog.',

    'meta.eyebrow': 'Between matches',
    'meta.title': 'An army you keep',
    'meta.body':
      'Win chests, collect cards, and spend them to level 12 units and 8 strategy cards. Trophies move your rank; the ladder pairs you with players near your own.',
    'meta.li1': 'Casual matches use your unit levels — ranked normalises them, so the ladder stays about play.',
    'meta.li2': 'Chests open on your schedule. No energy meter, no timers standing between you and a match.',
    'meta.li3': 'Practice against bots any time, offline-friendly and free.',

    'fair.title': 'Free to play. No ads.',
    'fair.body':
      'No banner ads, no interstitials, no rewarded video. The game runs on authoritative servers, so matches are decided by decisions, not by edited memory.',
    'fair.lang': 'Fully playable in English and العربية, right-to-left included.',

    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy policy',
    'footer.terms': 'Terms of service',
    'footer.support': 'Support',
    'footer.deletion': 'Delete your account',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
    'footer.disclaimer': 'Google Play and the Google Play logo are trademarks of Google LLC.',

    'legal.updated': 'Last updated',
    'legal.back': 'Back to home',
    'legal.canonical': 'The English version of this document is the binding one.',

    '404.title': 'Page not found',
    '404.body': 'That page does not exist. Try the home page.',
  },

  ar: {
    'nav.label': 'الرئيسية',
    'nav.home': 'الرئيسية',
    'nav.game': 'اللعبة',
    'nav.screens': 'لقطات',
    'nav.support': 'الدعم',

    'cta.get': 'حمّلها من Google Play',
    'cta.soon': 'قريبًا على Google Play',
    'cta.android': 'أندرويد · مجانية · بدون إعلانات',

    'home.title': 'خط الحصار: الخصوم — حرب حصار لحظية على أندرويد',
    'home.description':
      'لعبة استراتيجية لحظية للجوال: اجمع الذهب، وارفع قاعدتك من الطبقة الأولى إلى الثالثة، وقُد فرقك لكسر خط حصار خصمك. مجانية على أندرويد، بالعربية والإنجليزية.',
    'hero.kicker': 'استراتيجية لحظية للجوال',
    'hero.tagline': 'ابنِ القاعدة. قُد الفرق. اكسر خطهم.',
    'hero.blurb':
      'حرب حصار وجهًا لوجه مصمّمة لشاشة الجوال. عشر دقائق، خريطة واحدة، خصم واحد — بلا مؤقتات بناء لا تنتهي.',

    'game.eyebrow': 'ماذا تفعل',
    'game.title': 'ثلاثة أشياء، متقنة',
    'game.p1.title': 'سيطر على الأرض',
    'game.p1.body':
      'الذهب موزّع في مناجم على خريطة يغطيها الضباب. العمّال يحفرون، والاستطلاع يزيح الضباب، وكل متر تسيطر عليه متر لا يستطيع خصمك التعدين فيه.',
    'game.p2.title': 'ارفع خط الحصار',
    'game.p2.body':
      'ابنِ في أي مكان تسيطر عليه. ارفع برجك الرئيسي من الطبقة الأولى إلى الثالثة لتفتح المصانع والمختبرات ومهابط الطائرات والوحدات التي تحسم المعارك.',
    'game.p3.title': 'قِد، ولا تتعب أصابعك',
    'game.p3.body':
      'الأوامر تصل إلى الفرق لا إلى كل جندي على حدة. المس الأرض لتتقدم الفرقة بتشكيل، والمس عدوًا لتركّز النيران عليه — بإصبع واحد.',

    'screens.eyebrow': 'داخل اللعبة',
    'screens.title': 'مباراة حقيقية، لا صورة تجريبية',
    'screens.note': 'لقطات مأخوذة من عميل Unity أثناء مباراة حية.',
    'screens.shot1': 'برجك الأول، وعامل على أقرب منجم ذهب، وضباب في كل اتجاه.',
    'screens.shot2': 'قاعدة من الطبقة الثالثة في كامل إنتاجها، وشريط البناء مفتوح.',
    'screens.shot3': 'استطلاع للأمام — قاعدة الخصم تظهر من الضباب.',

    'meta.eyebrow': 'بين المباريات',
    'meta.title': 'جيش يبقى معك',
    'meta.body':
      'اربح الصناديق، واجمع البطاقات، وأنفقها لترقية 12 وحدة و8 بطاقات استراتيجية. الكؤوس تحرّك رتبتك، والسلّم يجمعك بمن هم في مستواك.',
    'meta.li1': 'المباريات الودّية تستخدم مستويات وحداتك، أما المصنّفة فتوحّدها ليبقى الفوز على المهارة.',
    'meta.li2': 'الصناديق تُفتح وقت ما تشاء. لا عدّاد طاقة ولا مؤقت يقف بينك وبين مباراة.',
    'meta.li3': 'تدرّب ضد الروبوتات في أي وقت، مجانًا.',

    'fair.title': 'مجانية. وبلا إعلانات.',
    'fair.body':
      'لا لافتات ولا إعلانات بينية ولا فيديو مقابل مكافأة. المباريات تُدار على خوادم موثوقة، فتُحسم بالقرارات لا بالتلاعب.',
    'fair.lang': 'تُلعب بالكامل بالعربية والإنجليزية، مع دعم الكتابة من اليمين إلى اليسار.',

    'footer.legal': 'قانوني',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الاستخدام',
    'footer.support': 'الدعم',
    'footer.deletion': 'حذف حسابك',
    'footer.contact': 'تواصل معنا',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.disclaimer': 'Google Play وشعارها علامتان تجاريتان لشركة Google LLC.',

    'legal.updated': 'آخر تحديث',
    'legal.back': 'العودة للرئيسية',
    'legal.canonical': 'النسخة الإنجليزية من هذه الوثيقة هي النسخة المُلزِمة.',

    '404.title': 'الصفحة غير موجودة',
    '404.body': 'هذه الصفحة غير موجودة. جرّب الصفحة الرئيسية.',
  },
} as const;

export type StringKey = keyof (typeof STRINGS)['en'];

export function t(lang: Locale, key: StringKey): string {
  return STRINGS[lang][key] ?? STRINGS.en[key];
}
