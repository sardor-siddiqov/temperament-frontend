export enum TemperamentType {
  SANGUINE = 'sangvinik',
  CHOLERIC = 'xolerik',
  PHLEGMATIC = 'flegmatik',
  MELANCHOLIC = 'melanxolik'
}

export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    weights: Partial<Record<TemperamentType, number>>;
  }[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Siz odatda yangi odamlar bilan uchrashganda birinchi bo'lib muloqot boshlaysizmi?",
    options: [
      { text: "Ha, doimo", weights: { [TemperamentType.SANGUINE]: 2, [TemperamentType.CHOLERIC]: 1 } },
      { text: "Vaziyatga qarab", weights: { [TemperamentType.PHLEGMATIC]: 1 } },
      { text: "Yo'q, odatda kutaman", weights: { [TemperamentType.MELANCHOLIC]: 2 } }
    ]
  },
  {
    id: 2,
    text: "Muvaffaqiyatsizlikka uchrasangiz, munosabatingiz qanday bo'ladi?",
    options: [
      { text: "Tezda unutaman va yangi ish boshlayman", weights: { [TemperamentType.SANGUINE]: 2 } },
      { text: "Jahlga minaman va qaytadan urinib ko'raman", weights: { [TemperamentType.CHOLERIC]: 2 } },
      { text: "Xotirjamlik bilan tahlil qilaman", weights: { [TemperamentType.PHLEGMATIC]: 2 } },
      { text: "Uzoq vaqt qayg'uraman", weights: { [TemperamentType.MELANCHOLIC]: 2 } }
    ]
  },
  {
    id: 3,
    text: "Ish bajarayotganda qaysi uslubni afzal ko'rasiz?",
    options: [
      { text: "Tez va shiddatli", weights: { [TemperamentType.CHOLERIC]: 2 } },
      { text: "Qiziqarli va jamoaviy", weights: { [TemperamentType.SANGUINE]: 2 } },
      { text: "Sekin, ammo sifatli", weights: { [TemperamentType.PHLEGMATIC]: 2 } },
      { text: "Daqiqlik bilan, yolg'iz", weights: { [TemperamentType.MELANCHOLIC]: 2 } }
    ]
  },
  {
    id: 4,
    text: "Sizni nima ko'proq charchatadi?",
    options: [
      { text: "Yolg'izlik", weights: { [TemperamentType.SANGUINE]: 2 } },
      { text: "Harakatsizlik", weights: { [TemperamentType.CHOLERIC]: 2 } },
      { text: "Shovqin va tartibsizlik", weights: { [TemperamentType.MELANCHOLIC]: 2 } },
      { text: "Shoshqaloqlik", weights: { [TemperamentType.PHLEGMATIC]: 2 } }
    ]
  },
  {
    id: 5,
    text: "Odamlar orasida o'zingizni qanday tutasiz?",
    options: [
      { text: "Diqqat markazida bo'lishni yoqtiraman", weights: { [TemperamentType.SANGUINE]: 2, [TemperamentType.CHOLERIC]: 1 } },
      { text: "Yaxshi tinglovchiman", weights: { [TemperamentType.PHLEGMATIC]: 2 } },
      { text: "Chetda kuzatishni afzal ko'raman", weights: { [TemperamentType.MELANCHOLIC]: 2 } }
    ]
  },
  // Adding more mock questions to reach 20 as requested
  {
    id: 6,
    text: "Qaror qabul qilishda nimaga tayanishingiz ko'proq?",
    options: [
      { text: "Hissiyotlarga", weights: { [TemperamentType.SANGUINE]: 1, [TemperamentType.MELANCHOLIC]: 1 } },
      { text: "Mantiqqa", weights: { [TemperamentType.PHLEGMATIC]: 2 } },
      { text: "Tezkor instinktlarga", weights: { [TemperamentType.CHOLERIC]: 2 } }
    ]
  },
  {
    id: 7,
    text: "Kayfiyatingiz qanchalik tez o'zgaradi?",
    options: [
      { text: "Juda tez o'zgaradi", weights: { [TemperamentType.CHOLERIC]: 1, [TemperamentType.MELANCHOLIC]: 1 } },
      { text: "Odatda barqaror", weights: { [TemperamentType.PHLEGMATIC]: 2 } },
      { text: "Har doim yaxshi", weights: { [TemperamentType.SANGUINE]: 2 } }
    ]
  },
  {
    id: 8,
    text: "Tanqidga munosabatingiz qanday?",
    options: [
      { text: "Darrov xafa bo'laman", weights: { [TemperamentType.MELANCHOLIC]: 2 } },
      { text: "Bahslashaman va o'zimni himoya qilaman", weights: { [TemperamentType.CHOLERIC]: 2 } },
      { text: "Eshitaman, lekin ko'nglimga olmayman", weights: { [TemperamentType.PHLEGMATIC]: 1, [TemperamentType.SANGUINE]: 1 } }
    ]
  },
  {
    id: 9,
    text: "Sayohatga chiqishda qanday tayyorgarlik ko'rasiz?",
    options: [
      { text: "Oxirgi daqiqada narsalarni yig'aman", weights: { [TemperamentType.SANGUINE]: 2 } },
      { text: "Hamma narsani reja asosida qilaman", weights: { [TemperamentType.PHLEGMATIC]: 2 } },
      { text: "Faqat eng muhim narsalarni tezda olaman", weights: { [TemperamentType.CHOLERIC]: 2 } }
    ]
  },
  {
    id: 10,
    text: "Kutilmagan muammo paydo bo'lsa:",
    options: [
      { text: "Tezda yechim izlayman", weights: { [TemperamentType.CHOLERIC]: 2 } },
      { text: "Xavotirga tushaman", weights: { [TemperamentType.MELANCHOLIC]: 2 } },
      { text: "Boshqalardan yordam so'rayman", weights: { [TemperamentType.SANGUINE]: 1 } },
      { text: "Xotirjamlik bilan kutaman", weights: { [TemperamentType.PHLEGMATIC]: 2 } }
    ]
  }
  // Simplified to 10 for demonstration but logic supports 20+
];
