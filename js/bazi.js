const TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const SHENG_XIAO = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
const SHI_CHEN = ['子时','丑时','寅时','卯时','辰时','巳时','午时','未时','申时','酉时','戌时','亥时'];
const SHI_CHEN_RANGE = ['23:00-00:59','01:00-02:59','03:00-04:59','05:00-06:59','07:00-08:59','09:00-10:59','11:00-12:59','13:00-14:59','15:00-16:59','17:00-18:59','19:00-20:59','21:00-22:59'];

const WU_XING_TG = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
const WU_XING_DZ = {子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};
const YIN_YANG_TG = {甲:'阳',乙:'阴',丙:'阳',丁:'阴',戊:'阳',己:'阴',庚:'阳',辛:'阴',壬:'阳',癸:'阴'};
const YIN_YANG_DZ = {子:'阳',丑:'阴',寅:'阳',卯:'阴',辰:'阳',巳:'阴',午:'阳',未:'阴',申:'阳',酉:'阴',戌:'阳',亥:'阴'};
const WU_XING_COLOR = {木:'#2e7d32',火:'#c62828',土:'#ef8a17',金:'#5d4037',水:'#1565c0'};

const NA_YIN = ['海中金','炉中火','大林木','路旁土','剑锋金','山头火','涧下水','城头土','白蜡金','杨柳木','泉中水','屋上土','霹雳火','松柏木','长流水','沙中金','山下火','平地木','壁上土','金箔金','覆灯火','天河水','大驿土','钗钏金','桑柘木','大溪水','沙中土','天上火','石榴木','大海水'];

const CANG_GAN = {子:['癸'],丑:['己','癸','辛'],寅:['甲','丙','戊'],卯:['乙'],辰:['戊','乙','癸'],巳:['丙','庚','戊'],午:['丁','己'],未:['己','丁','乙'],申:['庚','壬','戊'],酉:['辛'],戌:['戊','辛','丁'],亥:['壬','甲']};

const JIE_QI_LIST = [
  {m:2,d:4,name:'立春',dz:'寅'},{m:3,d:6,name:'惊蛰',dz:'卯'},
  {m:4,d:5,name:'清明',dz:'辰'},{m:5,d:6,name:'立夏',dz:'巳'},
  {m:6,d:6,name:'芒种',dz:'午'},{m:7,d:7,name:'小暑',dz:'未'},
  {m:8,d:7,name:'立秋',dz:'申'},{m:9,d:8,name:'白露',dz:'酉'},
  {m:10,d:8,name:'寒露',dz:'戌'},{m:11,d:7,name:'立冬',dz:'亥'},
  {m:12,d:7,name:'大雪',dz:'子'},{m:1,d:6,name:'小寒',dz:'丑'}
];

const CHANG_SHENG_STAGE = ['长生','沐浴','冠带','临官','帝旺','衰','病','死','墓','绝','胎','养'];
const CS_START = {甲:11,丙:2,戊:2,庚:5,壬:8,乙:6,丁:9,己:9,辛:0,癸:3};

function calcSexagenaryIdx(stem,branch){
  const S=TIAN_GAN.indexOf(stem),B=DI_ZHI.indexOf(branch);
  return S+((S-B+12)%12)/2*10;
}
function calcNaYin(stem,branch){
  const si=calcSexagenaryIdx(stem,branch);
  return Number.isInteger(si)&&si>=0&&si<=59?NA_YIN[Math.floor(si/2)]:'—';
}

function calcShiShen(riGan,otherGan){
  const ri=TIAN_GAN.indexOf(riGan),ot=TIAN_GAN.indexOf(otherGan);
  const rw=Math.floor(ri/2),ow=Math.floor(ot/2),ry=ri%2===0,oy=ot%2===0;
  if(rw===ow) return ry===oy?'比肩':'劫财';
  const woSheng=(rw+1)%5,shengWo=(rw+4)%5,woKe=(rw+2)%5,keWo=(rw+3)%5;
  if(ow===shengWo) return ry===oy?'偏印':'正印';
  if(ow===woSheng) return ry===oy?'食神':'伤官';
  if(ow===keWo) return ry===oy?'偏官(七杀)':'正官';
  if(ow===woKe) return ry===oy?'偏财':'正财';
  return '';
}
function calcShiShenFromZhi(riGan,otherGan){
  const ri=TIAN_GAN.indexOf(riGan),ot=TIAN_GAN.indexOf(otherGan);
  if(ot===-1) return '';
  const rw=Math.floor(ri/2),ow=Math.floor(ot/2),ry=ri%2===0,oy=ot%2===0;
  if(rw===ow) return ry===oy?'比肩':'劫财';
  const woSheng=(rw+1)%5,shengWo=(rw+4)%5,woKe=(rw+2)%5,keWo=(rw+3)%5;
  if(ow===shengWo) return ry===oy?'偏印':'正印';
  if(ow===woSheng) return ry===oy?'食神':'伤官';
  if(ow===keWo) return ry===oy?'偏官(七杀)':'正官';
  if(ow===woKe) return ry===oy?'偏财':'正财';
  return '';
}

function getMonthBranchInfo(month,day){
  const md=month*100+day;
  if(md>=204&&md<306) return {branchIdx:2,monthIdx:1};
  if(md>=306&&md<405) return {branchIdx:3,monthIdx:2};
  if(md>=405&&md<506) return {branchIdx:4,monthIdx:3};
  if(md>=506&&md<606) return {branchIdx:5,monthIdx:4};
  if(md>=606&&md<707) return {branchIdx:6,monthIdx:5};
  if(md>=707&&md<807) return {branchIdx:7,monthIdx:6};
  if(md>=807&&md<908) return {branchIdx:8,monthIdx:7};
  if(md>=908&&md<1008) return {branchIdx:9,monthIdx:8};
  if(md>=1008&&md<1107) return {branchIdx:10,monthIdx:9};
  if(md>=1107&&md<1207) return {branchIdx:11,monthIdx:10};
  if(md>=1207) return {branchIdx:0,monthIdx:11};
  if(md<=105) return {branchIdx:0,monthIdx:11};
  return {branchIdx:1,monthIdx:12};
}

function calcYearPillar(year,month,day){
  const md=month*100+day;
  let y=md<204?year-1:year;
  const stem=((y-4)%10+10)%10,branch=((y-4)%12+12)%12;
  return {stem:TIAN_GAN[stem],branch:DI_ZHI[branch],stemIdx:stem,branchIdx:branch};
}

function calcMonthPillar(year,month,day,yearStemIdx){
  const {branchIdx,monthIdx}=getMonthBranchInfo(month,day);
  const stem=(yearStemIdx%5*2+monthIdx+1)%10;
  return {stem:TIAN_GAN[stem],branch:DI_ZHI[branchIdx],stemIdx:stem,branchIdx};
}

function calcDayPillar(year,month,day){
  const ref=new Date(2000,0,1),target=new Date(year,month-1,day);
  const diff=Math.round((target-ref)/(24*60*60*1000));
  const idx=((54+diff)%60+60)%60;
  return {stem:TIAN_GAN[idx%10],branch:DI_ZHI[idx%12],stemIdx:idx%10,branchIdx:idx%12};
}

function getHourBranchIdx(hour,minute){
  if(hour===23||hour===0) return 0;
  return Math.floor((hour+1)/2)%12;
}

function calcHourPillar(dayStemIdx,hour,minute){
  const branchIdx=getHourBranchIdx(hour,minute);
  const stem=(dayStemIdx%5*2+branchIdx)%10;
  return {stem:TIAN_GAN[stem],branch:DI_ZHI[branchIdx],stemIdx:stem,branchIdx};
}

function calcChangSheng(gan,zhiIdx){
  const isYang=YIN_YANG_TG[gan]==='阳';
  const cs=CS_START[gan];
  if(cs===undefined) return '—';
  const offset=isYang?((zhiIdx-cs+12)%12):((cs-zhiIdx+12)%12);
  return CHANG_SHENG_STAGE[offset];
}

function calcTianYiGuiRen(gan){
  const m={甲:['丑','未','丑','未'],乙:['子','申','子','申'],丙:['亥','酉'],丁:['亥','酉'],戊:['丑','未'],己:['子','申'],庚:['丑','未'],辛:['午','寅'],壬:['卯','巳'],癸:['卯','巳']};
  return m[gan]||[];
}
function calcWenChang(gan){
  const m={甲:'巳',乙:'午',丙:'申',丁:'酉',戊:'申',己:'酉',庚:'亥',辛:'子',壬:'寅',癸:'卯'};
  return m[gan]||'';
}
function calcYiMa(zhi){
  const m={寅:'申',午:'申',戌:'申',申:'寅',子:'寅',辰:'寅',巳:'亥',酉:'亥',丑:'亥',亥:'巳',卯:'巳',未:'巳'};
  return m[zhi]||'';
}
function calcTaoHua(zhi){
  const m={寅:'卯',午:'卯',戌:'卯',申:'酉',子:'酉',辰:'酉',巳:'午',酉:'午',丑:'午',亥:'子',卯:'子',未:'子'};
  return m[zhi]||'';
}
function calcHuaGai(zhi){
  const m={寅:'戌',午:'戌',戌:'戌',申:'辰',子:'辰',辰:'辰',巳:'丑',酉:'丑',丑:'丑',亥:'未',卯:'未',未:'未'};
  return m[zhi]||'';
}
function calcJieSha(zhi){
  const m={寅:'亥',午:'亥',戌:'亥',申:'巳',子:'巳',辰:'巳',巳:'寅',酉:'寅',丑:'寅',亥:'申',卯:'申',未:'申'};
  return m[zhi]||'';
}
function calcTianDe(monthZhi){
  const m={寅:'丁',卯:'申',辰:'壬',巳:'辛',午:'亥',未:'甲',申:'癸',酉:'寅',戌:'丙',亥:'乙',子:'巳',丑:'庚'};
  return m[monthZhi]||'';
}
function calcYueDe(monthZhi){
  const m={寅:'丙',午:'丙',戌:'丙',申:'壬',子:'壬',辰:'壬',巳:'庚',酉:'庚',丑:'庚',亥:'甲',卯:'甲',未:'甲'};
  return m[monthZhi]||'';
}
function calcSanTai(zhi){
  const m={寅:'巳',午:'巳',戌:'巳',申:'亥',子:'亥',辰:'亥',巳:'申',酉:'申',丑:'申',亥:'寅',卯:'寅',未:'寅'};
  return m[zhi]||'';
}
function calcJiangXing(zhi){
  const m={寅:'卯',午:'卯',戌:'卯',申:'子',子:'子',辰:'子',巳:'午',酉:'午',丑:'午',亥:'酉',卯:'酉',未:'酉'};
  return m[zhi]||'';
}

function calcShenSha(gan,zhiAll,monthZhi){
  const sha={};
  const guiRen=calcTianYiGuiRen(gan).slice(0,2);
  if(guiRen.length) sha['天乙贵人']=guiRen;
  const wc=calcWenChang(gan);
  if(wc) sha['文昌贵人']=wc;
  const ym=calcYiMa(zhiAll[0]);
  if(ym) sha['驿马']=ym;
  const th=calcTaoHua(zhiAll[0]);
  if(th) sha['桃花']=th;
  const hg=calcHuaGai(zhiAll[0]);
  if(hg) sha['华盖']=hg;
  const js=calcJieSha(zhiAll[0]);
  if(js) sha['劫煞']=js;
  const td=calcTianDe(monthZhi);
  if(td) sha['天德贵人']=td;
  const yd=calcYueDe(monthZhi);
  if(yd) sha['月德贵人']=yd;
  const st=calcSanTai(zhiAll[0]);
  if(st) sha['三台']=st;
  const jx=calcJiangXing(zhiAll[0]);
  if(jx) sha['将星']=jx;
  return sha;
}

function calcDaysBetween(d1,d2){
  return Math.round((d2-d1)/(24*60*60*1000));
}

function calcDaYun(year,month,day,hour,minute,yearGan,gender,monthStemIdx,monthBranchIdx){
  const isYang=YIN_YANG_TG[yearGan]==='阳';
  const isMale=gender==='男';
  const shunPai=(isYang&&isMale)||(!isYang&&!isMale);

  const birthDate=new Date(year,month-1,day);
  if(hour>=23) birthDate.setDate(birthDate.getDate());

  let daysToJie=365;
  const checkJie=(y,m,d)=>{
    const jd=new Date(y,m-1,d);
    const diff=calcDaysBetween(birthDate,jd);
    if(shunPai&&diff>0&&diff<daysToJie) daysToJie=diff;
    if(!shunPai&&diff<0&&-diff<daysToJie) daysToJie=-diff;
  };

  for(const jie of JIE_QI_LIST){
    let jy=year;
    if(jie.m===1&&month===12) jy=year+1;
    else if(jie.m===12&&month===1) jy=year-1;
    checkJie(jy,jie.m,jie.d);
    checkJie(jy+1,jie.m,jie.d);
    checkJie(jy-1,jie.m,jie.d);
  }

  const startAge=Math.max(1,Math.round(daysToJie/3));
  const maxYun=8;
  const pillars=[];
  for(let i=0;i<maxYun;i++){
    const offset=shunPai?(i+1):-(i+1);
    const stem=((monthStemIdx+offset)%10+10)%10;
    const branch=((monthBranchIdx+offset)%12+12)%12;
    const ageFrom=startAge+i*10;
    const ageTo=ageFrom+9;
    pillars.push({
      index:i+1,ageFrom,ageTo,
      gan:TIAN_GAN[stem],zhi:DI_ZHI[branch],
      wxG:WU_XING_TG[TIAN_GAN[stem]],wxZ:WU_XING_DZ[DI_ZHI[branch]],
      naYin:calcNaYin(TIAN_GAN[stem],DI_ZHI[branch]),
      shiShen:calcShiShen(TIAN_GAN[monthStemIdx],TIAN_GAN[stem])
    });
  }

  return {shunPai,startAge,pillars};
}

function calcBazi(year,month,day,hour,minute,gender){
  const yearP=calcYearPillar(year,month,day);
  const monthP=calcMonthPillar(year,month,day,yearP.stemIdx);
  const dayP=calcDayPillar(year,month,day);
  const hourP=calcHourPillar(dayP.stemIdx,hour,minute);

  const pillars=[
    {name:'年柱',gan:yearP.stem,zhi:yearP.branch},
    {name:'月柱',gan:monthP.stem,zhi:monthP.branch},
    {name:'日柱',gan:dayP.stem,zhi:dayP.branch},
    {name:'时柱',gan:hourP.stem,zhi:hourP.branch}
  ];

  const baziStr=pillars.map(p=>p.gan+p.zhi).join(' ');

  const wuxingCount={木:0,火:0,土:0,金:0,水:0};
  for(const p of pillars){wuxingCount[WU_XING_TG[p.gan]]++;wuxingCount[WU_XING_DZ[p.zhi]]++;}
  const total=Object.values(wuxingCount).reduce((a,b)=>a+b,0);
  const wuxingPercent={};
  for(const[k,v]of Object.entries(wuxingCount)) wuxingPercent[k]=Math.round(v/total*100);
  const missingWx=Object.entries(wuxingCount).filter(([k,v])=>v===0).map(([k])=>k);
  const maxWx=Object.entries(wuxingCount).sort((a,b)=>b[1]-a[1]).filter(([k,v])=>v>0);

  const nayin=pillars.map(p=>calcNaYin(p.gan,p.zhi));
  const yinyang=pillars.map(p=>({gan:YIN_YANG_TG[p.gan],zhi:YIN_YANG_DZ[p.zhi]}));
  const shiShen=pillars.map(p=>calcShiShen(dayP.stem,p.gan));
  const cangGan=pillars.map(p=>CANG_GAN[p.zhi]||[]);

  const riGan=dayP.stem,riZhi=dayP.branch,riWx=WU_XING_TG[riGan];
  const riYinYang=YIN_YANG_TG[riGan];
  const shengXiao=SHENG_XIAO[yearP.branchIdx];
  const hourBranchIdx=getHourBranchIdx(hour,minute);
  const hourRange=SHI_CHEN_RANGE[hourBranchIdx];

  const changSheng=pillars.map(p=>calcChangSheng(dayP.stem,DI_ZHI.indexOf(p.zhi)));
  const shenSha=calcShenSha(dayP.stem,pillars.map(p=>p.zhi),monthP.branch);
  const daYun=calcDaYun(year,month,day,hour,minute,yearP.stem,gender,monthP.stemIdx,monthP.branchIdx);

  const shiShenZhi=pillars.map(p=>{
    const cg=cangGan[pillars.indexOf(p)];
    if(!cg.length) return [];
    return cg.map(g=>calcShiShenFromZhi(riGan,g));
  });

  return {
    bazi:baziStr,
    pillars,nayin,yinyang,shiShen,cangGan,shiShenZhi,
    wuxingCount,wuxingPercent,missingWx,maxWx,
    riGan,riZhi,riWx,riYinYang,
    shengXiao,hourRange,gender,
    changSheng,shenSha,daYun
  };
}

function calcBranchRelation(b1,b2){
  if(b1===b2) return '伏吟';
  const i1=DI_ZHI.indexOf(b1),i2=DI_ZHI.indexOf(b2);
  if(i1===-1||i2===-1) return '';
  const liuHe=[[0,1],[11,2],[10,3],[9,4],[8,5],[7,6]];
  if(liuHe.some(([a,b])=>(a===i1&&b===i2)||(a===i2&&b===i1))) return '六合';
  if(Math.abs(i1-i2)===6) return '六冲';
  const liuHai=[[0,7],[6,1],[5,2],[4,3],[8,11],[9,10]];
  if(liuHai.some(([a,b])=>(a===i1&&b===i2)||(a===i2&&b===i1))) return '六害';
  const yinShenSi=[2,5,8],chouWeiXu=[1,7,10],ziMao=[0,3];
  if(yinShenSi.includes(i1)&&yinShenSi.includes(i2)) return '三刑';
  if(chouWeiXu.includes(i1)&&chouWeiXu.includes(i2)) return '三刑';
  if(ziMao.includes(i1)&&ziMao.includes(i2)) return '相刑';
  if(i1===i2&&[4,6,9,11].includes(i1)) return '自刑';
  const sanHe=[[0,4,8],[2,6,10],[3,7,11],[1,5,9]];
  for(const sh of sanHe) if(sh.includes(i1)&&sh.includes(i2)&&i1!==i2) return '三合';
  const banHe=[[0,4],[4,8],[0,8],[2,6],[6,10],[2,10],[3,7],[7,11],[3,11],[1,5],[5,9],[1,9]];
  if(banHe.some(([a,b])=>(a===i1&&b===i2)||(a===i2&&b===i1))) return '半合';
  return '';
}

function calcLiuNianShenSha(nianZhi,liuNianZhi){
  const off=((DI_ZHI.indexOf(liuNianZhi)-DI_ZHI.indexOf(nianZhi))%12+12)%12;
  const m={0:'值太岁',1:'太阳',2:'丧门',3:'太阴',4:'五鬼',5:'死符',6:'岁破(冲太岁)',7:'龙德',8:'白虎',9:'福德',10:'天狗',11:'病符'};
  return m[off]||'';
}

function calcLiuNian(ly,riGan,riGanIdx,pillars,nianZhi,monthZhi){
  const liuNianStem=((ly-4)%10+10)%10;
  const liuNianBranch=((ly-4)%12+12)%12;
  const gan=TIAN_GAN[liuNianStem],zhi=DI_ZHI[liuNianBranch];
  const shenSha={};
  const lnss=calcLiuNianShenSha(nianZhi,zhi);
  if(lnss) shenSha[lnss]='✓';

  const guiRen=calcTianYiGuiRen(gan).slice(0,2);
  if(guiRen.length) shenSha['天乙贵人']=guiRen;

  const th=calcTaoHua(zhi);
  if(th&&nianZhi!==zhi){
    for(const p of pillars) if(p.zhi===th){shenSha['桃花']=p.name;break;}
  }

  const ny=calcNaYin(gan,zhi);
  const wzG=WU_XING_TG[gan],wzZ=WU_XING_DZ[zhi];
  const cs=calcChangSheng(riGan,liuNianBranch);
  const ss=calcShiShen(riGan,gan);
  const sx=SHENG_XIAO[liuNianBranch];

  const relations=pillars.map(p=>({
    pillar:p.name,zhi:p.zhi,relation:calcBranchRelation(zhi,p.zhi)
  })).filter(r=>r.relation);

  return {
    year:ly,gan,zhi,naYin:ny,wxG:wzG,wxZ:wzZ,
    shengXiao:sx,changSheng:cs,shiShen:ss,
    shenSha,relations
  };
}

function getDefaultDate(){
  const now=new Date();
  return{year:now.getFullYear(),month:now.getMonth()+1,day:now.getDate(),hour:now.getHours(),minute:now.getMinutes()};
}

// ═══════════════════════════════════════════
//  农历数据 & 转换（1900-2100）
//  位编码: bits 0-3 = 闰月月份(0=无闰)
//          bits 4-15 = 1-12月每月天数(0=29,1=30)
//          bit 16 = 闰月天数(0=29,1=30)
//  数据来源: https://github.com/jjonline/calendar.js
// ═══════════════════════════════════════════
const LUNAR_INFO=[
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,//1900-1909
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,//1910-1919
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,//1920-1929
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,//1930-1939
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,//1940-1949
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,//1950-1959
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,//1960-1969
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,//1970-1979
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,//1980-1989
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,//1990-1999
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,//2000-2009
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,//2010-2019
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,//2020-2029
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,//2030-2039
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,//2040-2049
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,//2050-2059
  0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,//2060-2069
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,//2070-2079
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,//2080-2089
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,//2090-2099
  0x0d520//2100
];

const LUNAR_MONTH_NAMES = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
const LUNAR_DAY_NAMES = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'
];

function lunarLeapMonth(y) {
  return LUNAR_INFO[y-1900] & 0xf;
}

function lunarLeapDays(y) {
  return LUNAR_INFO[y-1900] & 0x10000 ? 30 : 29;
}

function lunarMonthDays(y, m) {
  return LUNAR_INFO[y-1900] & (0x10000 >> m) ? 30 : 29;
}

function lunarYearDays(y) {
  let sum = 348;
  for (let bit = 0x8000; bit > 0x8; bit >>= 1) {
    if (LUNAR_INFO[y-1900] & bit) sum++;
  }
  const lm = lunarLeapMonth(y);
  return lm ? sum + lunarLeapDays(y) : sum;
}

function lunarToSolar(ly, lm, ld, isLeap) {
  if (ly < 1900 || ly > 2100) return null;
  if (ly === 1900 && lm === 1 && ld < 31) return null;
  if (ly === 2100 && lm === 12 && ld > 1) return null;
  const lp = lunarLeapMonth(ly);
  if (isLeap && lp !== lm) return null;
  const maxD = isLeap ? lunarLeapDays(ly) : lunarMonthDays(ly, lm);
  if (ld > maxD) return null;

  let offset = 0;
  for (let y = 1900; y < ly; y++) offset += lunarYearDays(y);

  let leapAdded = false;
  for (let m = 1; m < lm; m++) {
    if (!leapAdded && lp > 0 && lp <= m) { offset += lunarLeapDays(ly); leapAdded = true; }
    offset += lunarMonthDays(ly, m);
  }
  if (isLeap) offset += lunarMonthDays(ly, lm);
  offset += ld - 1;

  const d = new Date(Date.UTC(1900, 0, 31) + offset * 86400000);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}
