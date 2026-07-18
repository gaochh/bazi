const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const SHI_CHEN = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];
const SHI_CHEN_RANGE = [
  '23:00-00:59', '01:00-02:59', '03:00-04:59', '05:00-06:59',
  '07:00-08:59', '09:00-10:59', '11:00-12:59', '13:00-14:59',
  '15:00-16:59', '17:00-18:59', '19:00-20:59', '21:00-22:59'
];

const WU_XING_TG = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
const WU_XING_DZ = { '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' };
const YIN_YANG_TG = { '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳', '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴' };
const YIN_YANG_DZ = { '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴', '辰': '阳', '巳': '阴', '午': '阳', '未': '阴', '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴' };
const WU_XING_COLOR = { '木': '#2e7d32', '火': '#c62828', '土': '#ef8a17', '金': '#5d4037', '水': '#1565c0' };

const NA_YIN = [
  '海中金', '炉中火', '大林木', '路旁土', '剑锋金', '山头火',
  '涧下水', '城头土', '白蜡金', '杨柳木', '泉中水', '屋上土',
  '霹雳火', '松柏木', '长流水', '沙中金', '山下火', '平地木',
  '壁上土', '金箔金', '覆灯火', '天河水', '大驿土', '钗钏金',
  '桑柘木', '大溪水', '沙中土', '天上火', '石榴木', '大海水'
];

const CANG_GAN = {
  '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'],
  '卯': ['乙'], '辰': ['戊', '乙', '癸'], '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'], '未': ['己', '丁', '乙'], '申': ['庚', '壬', '戊'],
  '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲']
};

function calcSexagenaryIdx(stem, branch) {
  const S = TIAN_GAN.indexOf(stem);
  const B = DI_ZHI.indexOf(branch);
  return S + ((S - B + 12) % 12) / 2 * 10;
}

function calcNaYin(stem, branch) {
  const sidx = calcSexagenaryIdx(stem, branch);
  if (!Number.isInteger(sidx) || sidx < 0 || sidx > 59) return '—';
  return NA_YIN[Math.floor(sidx / 2)];
}

function calcShiShen(riGan, otherGan) {
  const riIdx = TIAN_GAN.indexOf(riGan);
  const otherIdx = TIAN_GAN.indexOf(otherGan);
  const riWx = Math.floor(riIdx / 2);
  const otherWx = Math.floor(otherIdx / 2);
  const riYang = riIdx % 2 === 0;
  const otherYang = otherIdx % 2 === 0;

  if (riWx === otherWx) return riYang === otherYang ? '比肩' : '劫财';
  const shengRi = (riWx + 3) % 5;
  const keRi = (riWx + 2) % 5;
  const riSheng = (riWx + 1) % 5;
  const riKe = (riWx + 4) % 5;

  if (otherWx === shengRi) return riYang === otherYang ? '偏印' : '正印';
  if (otherWx === riSheng) return riYang === otherYang ? '食神' : '伤官';
  if (otherWx === keRi) return riYang === otherYang ? '偏官(七杀)' : '正官';
  if (otherWx === riKe) return riYang === otherYang ? '偏财' : '正财';
  return '';
}

function getMonthBranchInfo(month, day) {
  const md = month * 100 + day;
  if (md >= 204 && md < 306) return { branchIdx: 2, monthIdx: 1 };
  if (md >= 306 && md < 405) return { branchIdx: 3, monthIdx: 2 };
  if (md >= 405 && md < 506) return { branchIdx: 4, monthIdx: 3 };
  if (md >= 506 && md < 606) return { branchIdx: 5, monthIdx: 4 };
  if (md >= 606 && md < 707) return { branchIdx: 6, monthIdx: 5 };
  if (md >= 707 && md < 807) return { branchIdx: 7, monthIdx: 6 };
  if (md >= 807 && md < 908) return { branchIdx: 8, monthIdx: 7 };
  if (md >= 908 && md < 1008) return { branchIdx: 9, monthIdx: 8 };
  if (md >= 1008 && md < 1107) return { branchIdx: 10, monthIdx: 9 };
  if (md >= 1107 && md < 1207) return { branchIdx: 11, monthIdx: 10 };
  if (md >= 1207) return { branchIdx: 0, monthIdx: 11 };
  if (md <= 105) return { branchIdx: 0, monthIdx: 11 };
  return { branchIdx: 1, monthIdx: 12 };
}

function calcYearPillar(year, month, day) {
  const md = month * 100 + day;
  let y = md < 204 ? year - 1 : year;
  const stem = ((y - 4) % 10 + 10) % 10;
  const branch = ((y - 4) % 12 + 12) % 12;
  return { stem: TIAN_GAN[stem], branch: DI_ZHI[branch], stemIdx: stem, branchIdx: branch };
}

function calcMonthPillar(year, month, day, yearStemIdx) {
  const { branchIdx, monthIdx } = getMonthBranchInfo(month, day);
  const stem = (yearStemIdx % 5 * 2 + monthIdx + 1) % 10;
  return { stem: TIAN_GAN[stem], branch: DI_ZHI[branchIdx], stemIdx: stem, branchIdx };
}

function calcDayPillar(year, month, day) {
  const ref = new Date(2000, 0, 1);
  const target = new Date(year, month - 1, day);
  const diff = Math.round((target - ref) / (24 * 60 * 60 * 1000));
  const idx = ((54 + diff) % 60 + 60) % 60;
  return { stem: TIAN_GAN[idx % 10], branch: DI_ZHI[idx % 12], stemIdx: idx % 10, branchIdx: idx % 12 };
}

function getHourBranchIdx(hour, minute) {
  if (hour === 23 || hour === 0) return 0;
  return Math.floor((hour + 1) / 2) % 12;
}

function calcHourPillar(dayStemIdx, hour, minute) {
  const branchIdx = getHourBranchIdx(hour, minute);
  const stem = (dayStemIdx % 5 * 2 + branchIdx) % 10;
  return { stem: TIAN_GAN[stem], branch: DI_ZHI[branchIdx], stemIdx: stem, branchIdx };
}

function calcBazi(year, month, day, hour, minute, gender) {
  const yearP = calcYearPillar(year, month, day);
  const monthP = calcMonthPillar(year, month, day, yearP.stemIdx);
  const dayP = calcDayPillar(year, month, day);
  const hourP = calcHourPillar(dayP.stemIdx, hour, minute);

  const pillars = [
    { name: '年柱', gan: yearP.stem, zhi: yearP.branch },
    { name: '月柱', gan: monthP.stem, zhi: monthP.branch },
    { name: '日柱', gan: dayP.stem, zhi: dayP.branch },
    { name: '时柱', gan: hourP.stem, zhi: hourP.branch }
  ];

  const baziStr = pillars.map(p => p.gan + p.zhi).join(' ');

  const wuxingCount = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  for (const p of pillars) {
    wuxingCount[WU_XING_TG[p.gan]]++;
    wuxingCount[WU_XING_DZ[p.zhi]]++;
  }

  const nayin = pillars.map(p => calcNaYin(p.gan, p.zhi));
  const yinyang = pillars.map(p => ({ gan: YIN_YANG_TG[p.gan], zhi: YIN_YANG_DZ[p.zhi] }));
  const shiShen = pillars.map(p => calcShiShen(dayP.stem, p.gan));
  const cangGan = pillars.map(p => CANG_GAN[p.zhi] || []);

  const riGan = dayP.stem;
  const riZhi = dayP.branch;
  const riWx = WU_XING_TG[riGan];
  const riYinYang = YIN_YANG_TG[riGan];
  const shengXiao = SHENG_XIAO[yearP.branchIdx];
  const hourBranchIdx = getHourBranchIdx(hour, minute);
  const hourRange = SHI_CHEN_RANGE[hourBranchIdx];

  const maxWx = Object.entries(wuxingCount).sort((a, b) => b[1] - a[1]).filter(([k, v]) => v > 0);
  const missingWx = Object.entries(wuxingCount).filter(([k, v]) => v === 0).map(([k]) => k);

  const wuxingPercent = {};
  const total = Object.values(wuxingCount).reduce((a, b) => a + b, 0);
  for (const [k, v] of Object.entries(wuxingCount)) {
    wuxingPercent[k] = Math.round(v / total * 100);
  }

  return {
    bazi: baziStr,
    pillars, nayin, yinyang, shiShen, cangGan,
    wuxingCount, wuxingPercent, missingWx, maxWx,
    riGan, riZhi, riWx, riYinYang,
    shengXiao, hourRange, gender
  };
}

function getDefaultDate() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes()
  };
}
