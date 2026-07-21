// ═══════════════════════════════════════════
//  八字做工推理引擎
//  十神力量 → 格局 → 做工方式 → 喜用神 → 纯粹度
// ═══════════════════════════════════════════

const MONTH_SEASON = { 寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水',子:'水',丑:'土' };

function getMonthPower(wx, monthWx) {
  const sx = { 木:['火','水','金','土'], 火:['土','木','水','金'], 土:['金','火','木','水'], 金:['水','土','火','木'], 水:['木','金','土','火'] };
  const order = sx[monthWx] || [];
  if (wx === monthWx) return 5;
  if (wx === order[0]) return 4;
  if (wx === order[1]) return 3;
  if (wx === order[2]) return 2;
  return 1;
}

const SHI_SHEN_WU_XING = {
  '比肩':'木','劫财':'木','食神':'火','伤官':'火','正财':'土','偏财':'土','正官':'金','七杀':'金','正印':'水','偏印':'水'
};

function calcTenGodPower(r) {
  const scores = {};
  const mp = MONTH_SEASON[r.pillars[1].zhi] || '土';
  const total = {};

  for (const ss of ['比肩','劫财','食神','伤官','正财','偏财','正官','七杀','正印','偏印']) {
    scores[ss] = { stemCount: 0, zhiCount: 0, positions: [], rootScore: 0, monthBoost: 0, power: 0 };
    total[ss] = 0;
  }

  const add = (ss, pos, isStem, wx) => {
    if (!scores[ss]) return;
    if (isStem) { scores[ss].stemCount++; scores[ss].positions.push(pos + '(干)'); }
    else { scores[ss].zhiCount++; scores[ss].positions.push(pos + '(支)'); }
    if (wx) scores[ss].rootScore += 3;
    scores[ss].monthBoost = getMonthPower(SHI_SHEN_WU_XING[ss] || '土', mp);
  };

  r.pillars.forEach((p, i) => {
    const ss = r.shiShen[i];
    add(ss, p.name, true, null);
    const cg = r.cangGan[i] || [];
    const sz = r.shiShenZhi[i] || [];
    cg.forEach((g, j) => {
      const ssz = sz[j] || '';
      add(ssz, p.name, false, WU_XING_TG[g] === SHI_SHEN_WU_XING[ssz]);
    });
  });

  for (const ss of Object.keys(scores)) {
    const s = scores[ss];
    const countWeight = Math.min(s.stemCount + s.zhiCount * 0.6, 6);
    s.power = Math.round(countWeight * 10 + s.rootScore * 5 + s.monthBoost * 6);
    s.level = s.power >= 60 ? '旺' : s.power >= 35 ? '中' : '弱';
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1].power - a[1].power);
  const top = sorted.filter(s => s[1].power > 0).slice(0, 5);
  return { scores, top, monthWx: mp };
}

function isStemPresent(pillars, gan) {
  return pillars.some(p => p.gan === gan);
}

function countStemTenGod(shiShen, name) {
  return shiShen.filter(s => s === name).length;
}

function countZhiTenGod(shiShenZhi, name) {
  let c = 0;
  shiShenZhi.forEach(arr => { arr.forEach(s => { if (s === name) c++; }); });
  return c;
}

function countAllTenGod(shiShen, shiShenZhi, name) {
  return countStemTenGod(shiShen, name) + countZhiTenGod(shiShenZhi, name);
}

function determinePatterns(r) {
  const patterns = [];
  const monthZhi = r.pillars[1].zhi;
  const cg = CANG_GAN[monthZhi] || [];
  const monthLord = cg[0] || '';
  if (monthLord) {
    const mlSS = calcShiShenFromZhi(r.riGan, monthLord);
    const prob = r.shiShen[1] === mlSS ? 0.8 : 0.5;
    patterns.push({ name: mlSS + '格', prob: prob, reason: '月令主气为' + monthLord + '，对日主为' + mlSS + (r.shiShen[1] === mlSS ? '，月干透出' : '') });
  }

  const riCount = countAllTenGod(r.shiShen, r.shiShenZhi, '比肩') + countAllTenGod(r.shiShen, r.shiShenZhi, '劫财');
  const shiCount = countAllTenGod(r.shiShen, r.shiShenZhi, '食神') + countAllTenGod(r.shiShen, r.shiShenZhi, '伤官');
  const caiCount = countAllTenGod(r.shiShen, r.shiShenZhi, '正财') + countAllTenGod(r.shiShen, r.shiShenZhi, '偏财');
  const guanCount = countAllTenGod(r.shiShen, r.shiShenZhi, '正官') + countAllTenGod(r.shiShen, r.shiShenZhi, '七杀');
  const yinCount = countAllTenGod(r.shiShen, r.shiShenZhi, '正印') + countAllTenGod(r.shiShen, r.shiShenZhi, '偏印');

  const riWxCount = r.wuxingCount[r.riWx] || 0;
  const strongRi = riWxCount >= 4;
  const weakRi = riWxCount <= 1;

  if (weakRi && (shiCount > 4 || caiCount > 4 || guanCount > 4)) {
    const dom = shiCount > caiCount && shiCount > guanCount ? '食伤' : caiCount > guanCount ? '财' : '官杀';
    patterns.push({ name: '从' + dom + '格', prob: 0.3, reason: '日主极弱，' + dom + '势强，有从' + dom + '之势' });
  }
  if (strongRi && riCount >= 4 && shiCount === 0 && caiCount === 0 && guanCount === 0) {
    patterns.push({ name: '从旺格(专旺)', prob: 0.25, reason: '日主极旺，无异党，气专一方' });
  }

  patterns.sort((a, b) => b.prob - a.prob);
  return patterns;
}

function calcWorkMethods(r, tp) {
  const methods = [];
  const ss = r.shiShen;
  const ssz = r.shiShenZhi;
  const cYin = countAllTenGod(ss, ssz, '正印') + countAllTenGod(ss, ssz, '偏印');
  const cGuan = countAllTenGod(ss, ssz, '正官');
  const cSha = countAllTenGod(ss, ssz, '七杀');
  const cShi = countAllTenGod(ss, ssz, '食神');
  const cShang = countAllTenGod(ss, ssz, '伤官');
  const cCai = countAllTenGod(ss, ssz, '正财') + countAllTenGod(ss, ssz, '偏财');
  const cBi = countAllTenGod(ss, ssz, '比肩') + countAllTenGod(ss, ssz, '劫财');

  const guanStem = countStemTenGod(ss, '正官');
  const shaStem = countStemTenGod(ss, '七杀');
  const yinStem = countStemTenGod(ss, '正印') + countStemTenGod(ss, '偏印');
  const shiStem = countStemTenGod(ss, '食神');
  const shangStem = countStemTenGod(ss, '伤官');
  const caiStem = countStemTenGod(ss, '正财') + countStemTenGod(ss, '偏财');

  const riWx = r.wuxingCount[r.riWx] || 0;
  const strong = riWx >= 4;
  const weak = riWx <= 1;

  // 官印相生
  if (guanStem > 0 && yinStem > 0) {
    methods.push({ name:'官印相生', prob:calcProb(guanStem, cGuan, yinStem, cYin, strong, 0.7), desc:'正官透干生正印，官印相生主贵', tag:'吉' });
  }

  // 杀印相生
  if (shaStem > 0 && yinStem > 0) {
    methods.push({ name:'杀印相生', prob:calcProb(shaStem, cSha, yinStem, cYin, strong, 0.7), desc:'七杀透干，印星化杀生身，转凶为吉', tag:'吉' });
  }

  // 食神生财
  if (shiStem > 0 && caiStem > 0) {
    methods.push({ name:'食神生财', prob:calcProb(shiStem, cShi, caiStem, cCai, strong, 0.65), desc:'食神透干生财星，主富', tag:'吉' });
  }

  // 伤官生财
  if (shangStem > 0 && caiStem > 0) {
    const p = calcProb(shangStem, cShang, caiStem, cCai, strong, 0.55);
    if (p > 0.2) methods.push({ name:'伤官生财', prob:p, desc:'伤官透干生财星，以才华生财', tag:'中' });
  }

  // 食神制杀
  if (shiStem > 0 && shaStem > 0) {
    methods.push({ name:'食神制杀', prob:calcProb(shiStem, cShi, shaStem, cSha, strong, 0.65), desc:'食神制七杀，以智谋制敌', tag:'吉' });
  }

  // 伤官合杀
  if (shangStem > 0 && shaStem > 0) {
    methods.push({ name:'伤官合杀', prob:calcProb(shangStem, cShang, shaStem, cSha, strong, 0.4), desc:'伤官合杀，以才华化解压力', tag:'中' });
  }

  // 比劫帮身 (body help)
  if (weak && cBi >= 2) {
    methods.push({ name:'比劫帮身', prob:Math.min(0.3 + cBi * 0.08, 0.7), desc:'日主弱，比劫助身担财官', tag:'吉' });
  }

  // 比劫夺财
  if (cBi >= 2 && caiStem > 0) {
    methods.push({ name:'比劫夺财', prob:Math.min(0.2 + cBi * 0.06, 0.5), desc:'比劫旺夺财星，竞争破财', tag:'凶' });
  }

  // 财生官杀
  if (caiStem > 0 && (guanStem > 0 || shaStem > 0)) {
    const gs = guanStem + shaStem;
    methods.push({ name:'财生官杀', prob:calcProb(caiStem, cCai, gs, guanStem + cSha, strong, 0.6), desc:'财星生官杀，以财富求取权力地位', tag:'中' });
  }

  // 官杀混杂
  if (guanStem > 0 && shaStem > 0) {
    methods.push({ name:'官杀混杂', prob:Math.min(0.2 + (guanStem + shaStem) * 0.15, 0.6), desc:'正官七杀同现，事业感情易反复', tag:'凶' });
  }

  // 食神泄秀
  if (strong && shiStem > 0) {
    methods.push({ name:'食神泄秀', prob:Math.min(0.2 + shiStem * 0.15 + (cShi - shiStem) * 0.05, 0.6), desc:'日主旺，食神泄秀发挥才华', tag:'吉' });
  }

  // 伤官见官
  if (shangStem > 0 && guanStem > 0) {
    methods.push({ name:'伤官见官', prob:Math.min(0.15 + (shangStem + guanStem) * 0.1, 0.45), desc:'伤官见官，易有是非官非', tag:'凶' });
  }

  methods.sort((a, b) => b.prob - a.prob);

  let bestIdx = 0;
  let maxEff = 0;
  methods.forEach((m, i) => {
    const base = m.prob;
    const bonus = m.tag === '吉' ? 0.15 : m.tag === '凶' ? -0.1 : 0;
    m.efficiency = Math.round((base + bonus) * 100);
    if (m.efficiency > maxEff) { maxEff = m.efficiency; bestIdx = i; }
  });

  return { methods, bestIdx, count: methods.length };
}

function calcProb(stemA, totalA, stemB, totalB, strong, base) {
  let p = base;
  p += stemA * 0.12;
  p += (totalA - stemA) * 0.04;
  p += stemB * 0.1;
  p += (totalB - stemB) * 0.03;
  if (strong) p -= 0.1;
  return Math.max(0.05, Math.min(0.92, p));
}

function calcFavorableGods(r, workMethods) {
  const riWx = r.riWx;
  const wxCycle = { 木:['水','火','金','土'], 火:['木','土','水','金'], 土:['火','金','木','水'], 金:['土','水','火','木'], 水:['金','木','土','火'] };
  const order = wxCycle[riWx] || [];

  const guanShaCount = countAllTenGod(r.shiShen, r.shiShenZhi, '正官') + countAllTenGod(r.shiShen, r.shiShenZhi, '七杀');
  const shiShangCount = countAllTenGod(r.shiShen, r.shiShenZhi, '食神') + countAllTenGod(r.shiShen, r.shiShenZhi, '伤官');
  const caiCount = countAllTenGod(r.shiShen, r.shiShenZhi, '正财') + countAllTenGod(r.shiShen, r.shiShenZhi, '偏财');
  const yinCount = countAllTenGod(r.shiShen, r.shiShenZhi, '正印') + countAllTenGod(r.shiShen, r.shiShenZhi, '偏印');
  const biCount = countAllTenGod(r.shiShen, r.shiShenZhi, '比肩') + countAllTenGod(r.shiShen, r.shiShenZhi, '劫财');

  const riWxCount = r.wuxingCount[riWx] || 0;
  const strong = riWxCount >= 4;
  const weak = riWxCount <= 1;

  let favWx = [], unfavWx = [];
  let favSS = [], unfavSS = [];

  if (workMethods.best && workMethods.best.name) {
    const bn = workMethods.best.name;
    if (bn === '官印相生' || bn === '杀印相生') {
      favSS = ['正印','偏印','正官','七杀'];
      favWx = [order[0] || '水', order[1] || '木'];
      unfavSS = ['伤官','食神','正财','偏财'];
      unfavWx = [order[2] || '金', order[3] || '土'];
    } else if (bn.startsWith('食神生财') || bn.startsWith('伤官生财')) {
      favSS = ['食神','伤官','正财','偏财'];
      favWx = [order[2] || '金', order[3] || '土'];
      unfavSS = ['比肩','劫财','正印','偏印'];
      unfavWx = [order[0] || '水', order[1] || '木'];
    } else {
      favSS = ['比肩','劫财','正印','偏印'];
      favWx = [order[0] || '水', order[1] || '木'];
      unfavSS = ['正官','七杀','正财','偏财'];
      unfavWx = [order[2] || '金', order[3] || '土'];
    }
  } else {
    if (weak) { favWx = [order[0], order[1]]; favSS = ['比肩','劫财','正印','偏印']; unfavWx = [order[2], order[3]]; unfavSS = ['正官','七杀','正财','偏财']; }
    else if (strong) { favWx = [order[2], order[3]]; favSS = ['食神','伤官','正财','偏财']; unfavWx = [order[0], order[1]]; unfavSS = ['比肩','劫财','正印','偏印']; }
    else { favWx = [order[0], order[2]]; favSS = ['正印','偏印','食神','正财']; unfavWx = [order[1], order[3]]; unfavSS = ['比肩','劫财','七杀']; }
  }

  return {
    favorable: { elements: favWx.filter(Boolean), tenGods: favSS },
    unfavorable: { elements: unfavWx.filter(Boolean), tenGods: unfavSS }
  };
}

function assessPurity(workMethods, patterns) {
  const good = workMethods.methods.filter(m => m.tag !== '凶');
  const bad = workMethods.methods.filter(m => m.tag === '凶');
  const best = workMethods.methods[workMethods.bestIdx];

  let pure = '中';
  let desc = '';

  if (workMethods.count === 0) {
    pure = '低'; desc = '无明显做工路线，格局不够清晰';
  } else if (workMethods.count <= 2 && bad.length === 0) {
    pure = '高'; desc = '做工路线单一清晰，' + best.name + '，少有杂气干扰';
  } else if (bad.length >= 2 || workMethods.count >= 5) {
    pure = '低'; desc = '多条路线混杂，' + (bad.length ? '有' + bad.map(m => m.name).join('、') + '等凶格干扰，' : '') + '十神杂陈，格局不纯';
  } else {
    pure = '中'; desc = '有' + best.name + '为主，但兼有' + good.filter((m, i) => i !== workMethods.bestIdx).map(m => m.name).join('、') + '等其它路线，纯中有杂';
  }

  const pat = (patterns[0] || {}).name || '无';
  const quality = (() => {
    if (pure === '高' && best.prob > 0.5) return '上等格局，做工纯粹，层次较高';
    if (pure === '高') return '中等偏上格局，路线清晰但条件未尽满足';
    if (pure === '中' && best.prob > 0.4) return '中等格局，有主次之分';
    if (pure === '中') return '中等偏下格局，需要大运引动';
    return '格局较低，需结合大运流年仔细分析';
  })();

  return { purity: pure, description: desc, quality };
}

function analyzeBazi(r) {
  const tp = calcTenGodPower(r);
  const patterns = determinePatterns(r);
  const wm = calcWorkMethods(r, tp);
  const best = wm.methods[wm.bestIdx] || null;
  const purity = assessPurity(wm, patterns);
  const fg = calcFavorableGods(r, { best });

  return {
    tenGodPower: tp,
    patterns,
    workMethods: wm.methods,
    bestWorkMethod: best,
    bestIdx: wm.methods.length ? wm.bestIdx : -1,
    favorableGods: fg.favorable,
    unfavorableGods: fg.unfavorable,
    purity: purity.purity,
    purityDesc: purity.description,
    quality: purity.quality
  };
}

function analyzeBaziWithFlow(r, flowItems) {
  if (!flowItems || flowItems.length === 0) return analyzeBazi(r);

  const extSS = [...r.shiShen];
  const extSSZ = r.shiShenZhi.map(arr => [...arr]);
  const extCG = r.cangGan.map(arr => [...arr]);
  const extWx = { ...r.wuxingCount };
  const extPills = r.pillars.map(p => ({ ...p }));

  flowItems.forEach(f => {
    const fSS = calcShiShen(r.riGan, f.gan);
    extSS.push(fSS);
    const fCG = CANG_GAN[f.zhi] || [];
    extCG.push(fCG);
    extSSZ.push(fCG.map(g => calcShiShenFromZhi(r.riGan, g)));
    extWx[WU_XING_TG[f.gan]] = (extWx[WU_XING_TG[f.gan]] || 0) + 1;
    extWx[WU_XING_DZ[f.zhi]] = (extWx[WU_XING_DZ[f.zhi]] || 0) + 1;
    extPills.push({ name: f.label, gan: f.gan, zhi: f.zhi });
  });

  const total = Object.values(extWx).reduce((a, b) => a + b, 0);
  const extPct = {};
  for (const [k, v] of Object.entries(extWx)) extPct[k] = Math.round(v / total * 100);

  const extR = {
    ...r,
    shiShen: extSS,
    shiShenZhi: extSSZ,
    cangGan: extCG,
    wuxingCount: extWx,
    wuxingPercent: extPct,
    pillars: extPills
  };

  const tp = calcTenGodPower(extR);
  const patterns = determinePatterns(r);
  const wm = calcWorkMethods(extR, tp);
  const best = wm.methods[wm.bestIdx] || null;
  const purity = assessPurity(wm, patterns);
  const fg = calcFavorableGods(extR, { best });

  return {
    tenGodPower: tp,
    patterns,
    workMethods: wm.methods,
    bestWorkMethod: best,
    bestIdx: wm.methods.length ? wm.bestIdx : -1,
    favorableGods: fg.favorable,
    unfavorableGods: fg.unfavorable,
    purity: purity.purity,
    purityDesc: purity.description,
    quality: purity.quality,
    flowLabel: flowItems.map(f => f.label).join('+')
  };
}
