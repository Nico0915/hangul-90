/* =========================================================
   data.js — 한글 90 内容数据
   12 周路径 / 字母 / 发音规则 / 语法 / 词汇 / 通勤句 / 速查
   ========================================================= */

const WEEK_META = [
  { w:1,  name:'韩文字母 · 元音',   goal:'认清 21 个元音，能把音节读出来' },
  { w:2,  name:'韩文字母 · 辅音',   goal:'认清 19 个辅音，掌握 7 个代表收音' },
  { w:3,  name:'问候与自我介绍',     goal:'用 입니다 / 이에요 介绍自己' },
  { w:4,  name:'指示词与主格助词',   goal:'分清 은/는 与 이/가 的分工' },
  { w:5,  name:'数字与时间',         goal:'会说钟点、日期、价格' },
  { w:6,  name:'动词与 해요 体',     goal:'把任何动词变成礼貌现在时' },
  { w:7,  name:'场所与存在',         goal:'表达「在哪里、有什么」' },
  { w:8,  name:'过去时与否定',       goal:'说昨天做了什么、没做什么' },
  { w:9,  name:'请求与意愿',         goal:'礼貌请求、表达「想要」' },
  { w:10, name:'连接句子',           goal:'用 -고 / -서 / -지만 说长句' },
  { w:11, name:'计划与能力',         goal:'表达将来计划和「能不能」' },
  { w:12, name:'条件与义务',         goal:'用 -면 / -아야 하다 收尾并复盘' }
];

/* ---------------- 字母 ---------------- */
const LETTERS = {
  vowels: [
    { ch:'ㅏ', rm:'a',  nm:'아', tip:'嘴自然张开，舌放平，接近「啊」但更短', ex:'아이', excn:'小孩' },
    { ch:'ㅑ', rm:'ya', nm:'야', tip:'ㅏ 前加 y，像「呀」', ex:'야구', excn:'棒球' },
    { ch:'ㅓ', rm:'eo', nm:'어', tip:'嘴张开、舌后缩，接近英语 but 的 u。不是「哦」', ex:'어머니', excn:'母亲' },
    { ch:'ㅕ', rm:'yeo', nm:'여', tip:'ㅓ 前加 y', ex:'여기', excn:'这里' },
    { ch:'ㅗ', rm:'o',  nm:'오', tip:'双唇收圆前伸，比中文「哦」更圆更紧', ex:'오이', excn:'黄瓜' },
    { ch:'ㅛ', rm:'yo', nm:'요', tip:'ㅗ 前加 y', ex:'요리', excn:'料理' },
    { ch:'ㅜ', rm:'u',  nm:'우', tip:'双唇收圆，像「乌」', ex:'우유', excn:'牛奶' },
    { ch:'ㅠ', rm:'yu', nm:'유', tip:'ㅜ 前加 y', ex:'유리', excn:'玻璃' },
    { ch:'ㅡ', rm:'eu', nm:'으', tip:'嘴唇扁平向两侧拉，舌位高。中文没有这个音', ex:'그', excn:'那个' },
    { ch:'ㅣ', rm:'i',  nm:'이', tip:'嘴角向两侧拉开，像「衣」', ex:'이름', excn:'名字' },
    { ch:'ㅐ', rm:'ae', nm:'애', tip:'嘴张得比 ㅔ 大，现代韩语里与 ㅔ 几乎同音', ex:'개', excn:'狗' },
    { ch:'ㅔ', rm:'e',  nm:'에', tip:'嘴张得较小，实际口语中与 ㅐ 不分', ex:'네', excn:'是' },
    { ch:'ㅒ', rm:'yae',nm:'얘', tip:'ㅐ 前加 y', ex:'얘기', excn:'聊天' },
    { ch:'ㅖ', rm:'ye', nm:'예', tip:'ㅔ 前加 y', ex:'예', excn:'是（正式）' },
    { ch:'ㅘ', rm:'wa', nm:'와', tip:'ㅗ + ㅏ 快速连读', ex:'과일', excn:'水果' },
    { ch:'ㅙ', rm:'wae',nm:'왜', tip:'ㅗ + ㅐ', ex:'왜', excn:'为什么' },
    { ch:'ㅚ', rm:'oe', nm:'외', tip:'实际多读作 we', ex:'회사', excn:'公司' },
    { ch:'ㅝ', rm:'wo', nm:'워', tip:'ㅜ + ㅓ', ex:'뭐', excn:'什么' },
    { ch:'ㅞ', rm:'we', nm:'웨', tip:'ㅜ + ㅔ', ex:'웨이터', excn:'服务员' },
    { ch:'ㅟ', rm:'wi', nm:'위', tip:'ㅜ + ㅣ', ex:'위', excn:'上面' },
    { ch:'ㅢ', rm:'ui', nm:'의', tip:'ㅡ + ㅣ，作助词时多读 e', ex:'의사', excn:'医生' }
  ],
  consonants: [
    { ch:'ㄱ', rm:'g / k', nm:'기역', tip:'舌根抵软腭。词首偏 k，词中偏 g', ex:'가방', excn:'包' },
    { ch:'ㄴ', rm:'n',     nm:'니은', tip:'舌尖抵上齿龈，同拼音 n', ex:'나', excn:'我' },
    { ch:'ㄷ', rm:'d / t', nm:'디귿', tip:'词首偏 t，词中偏 d', ex:'도시', excn:'城市' },
    { ch:'ㄹ', rm:'r / l', nm:'리을', tip:'词首是弹舌 r，收音是 l。介于两者之间', ex:'라면', excn:'拉面' },
    { ch:'ㅁ', rm:'m',     nm:'미음', tip:'双唇闭合，同 m', ex:'물', excn:'水' },
    { ch:'ㅂ', rm:'b / p', nm:'비읍', tip:'词首偏 p，词中偏 b', ex:'밥', excn:'饭' },
    { ch:'ㅅ', rm:'s',     nm:'시옷', tip:'在 ㅣ / ㅑ 等前变 sh 音', ex:'사람', excn:'人' },
    { ch:'ㅇ', rm:'— / ng',nm:'이응', tip:'词首不发音（占位），作收音时发 ng', ex:'아이', excn:'小孩' },
    { ch:'ㅈ', rm:'j',     nm:'지읒', tip:'词首略偏 ch，词中偏 j', ex:'집', excn:'家' },
    { ch:'ㅊ', rm:'ch',    nm:'치읓', tip:'ㅈ 的送气版，气流强', ex:'차', excn:'茶 / 车' },
    { ch:'ㅋ', rm:'k',     nm:'키읔', tip:'ㄱ 的送气版', ex:'커피', excn:'咖啡' },
    { ch:'ㅌ', rm:'t',     nm:'티읕', tip:'ㄷ 的送气版', ex:'토요일', excn:'周六' },
    { ch:'ㅍ', rm:'p',     nm:'피읖', tip:'ㅂ 的送气版', ex:'피자', excn:'披萨' },
    { ch:'ㅎ', rm:'h',     nm:'히읗', tip:'词中常弱化甚至脱落', ex:'하나', excn:'一' },
    { ch:'ㄲ', rm:'kk',    nm:'쌍기역', tip:'紧音，喉部绷紧、不送气', ex:'까치', excn:'喜鹊' },
    { ch:'ㄸ', rm:'tt',    nm:'쌍디귿', tip:'紧音', ex:'딸', excn:'女儿' },
    { ch:'ㅃ', rm:'pp',    nm:'쌍비읍', tip:'紧音', ex:'빵', excn:'面包' },
    { ch:'ㅆ', rm:'ss',    nm:'쌍시옷', tip:'紧音，比 ㅅ 更用力', ex:'쌀', excn:'大米' },
    { ch:'ㅉ', rm:'jj',    nm:'쌍지읒', tip:'紧音', ex:'짜다', excn:'咸' }
  ]
};

const BATCHIM = [
  { rep:'ㄱ', from:'ㄱ ㅋ ㄲ', ex:'국', excn:'汤', tip:'舌根抵住不放气，声音突然停住' },
  { rep:'ㄴ', from:'ㄴ',       ex:'눈', excn:'眼睛', tip:'舌尖抵齿龈，鼻腔出气' },
  { rep:'ㄷ', from:'ㄷ ㅌ ㅅ ㅆ ㅈ ㅊ ㅎ', ex:'낮', excn:'白天', tip:'舌尖抵住，最常见的收音' },
  { rep:'ㄹ', from:'ㄹ',       ex:'물', excn:'水', tip:'舌尖轻触上齿龈，像 l' },
  { rep:'ㅁ', from:'ㅁ',       ex:'밤', excn:'夜晚', tip:'双唇闭合，鼻腔共鸣' },
  { rep:'ㅂ', from:'ㅂ ㅍ',    ex:'밥', excn:'饭', tip:'双唇闭合后突然放开' },
  { rep:'ㅇ', from:'ㅇ',       ex:'강', excn:'江', tip:'舌根抬起，鼻腔出气，像 ng' }
];

const PRON_RULES = [
  { name:'连音化', pattern:'받침 + 元音 → 移到下一音节',
    desc:'收音后面紧跟元音开头的助词或词尾时，收音会「借」到下一个音节。这是韩语口语里最重要的规则。',
    ex:[{ko:'한국어', rm:'[한구거]', cn:'韩语'},{ko:'밥을', rm:'[바블]', cn:'饭（宾格）'}] },
  { name:'紧音化', pattern:'收音 ㄱㄷㅂ + ㄱㄷㅂㅅㅈ → 变紧音',
    desc:'前面的收音把后面的辅音「挤紧」，读成 ㄲ ㄸ ㅃ ㅆ ㅉ。',
    ex:[{ko:'학교', rm:'[학꾜]', cn:'学校'},{ko:'먹다', rm:'[먹따]', cn:'吃'}] },
  { name:'鼻音化', pattern:'收音 ㄱㄷㅂ + ㄴㅁ → ㅇㄴㅁ',
    desc:'最常出现在「입니다」这类句型里，也是初学者最容易漏掉的。',
    ex:[{ko:'입니다', rm:'[임니다]', cn:'是'},{ko:'국물', rm:'[궁물]', cn:'汤水'}] },
  { name:'流音化', pattern:'ㄴ + ㄹ / ㄹ + ㄴ → ㄹㄹ',
    desc:'两个音互相影响，统一变成 ㄹㄹ。',
    ex:[{ko:'연락', rm:'[열락]', cn:'联系'},{ko:'설날', rm:'[설랄]', cn:'春节'}] },
  { name:'ㅎ 弱化', pattern:'ㅎ + ㄱㄷㅈ → ㅋㅌㅊ',
    desc:'ㅎ 遇到硬辅音会把对方送气化；在 ㄴ 前则直接消失。',
    ex:[{ko:'좋다', rm:'[조타]', cn:'好'},{ko:'전화', rm:'[저놔]', cn:'电话'}] },
  { name:'口盖音化', pattern:'ㄷ / ㅌ + 이 → 지 / 치',
    desc:'收音 ㄷ、ㅌ 后面遇到 이 会变成 지、치，属于固定变化。',
    ex:[{ko:'같이', rm:'[가치]', cn:'一起'},{ko:'굳이', rm:'[구지]', cn:'非要'}] }
];

/* ---------------- 语法 ---------------- */
const GRAMMAR = [
  { wk:3, pat:'N은/는 N입니다', cn:'……是……（正式体）',
    note:'은 接在收音后，는 接在元音后。입니다 是最正式的「是」，适合邮件、会议、自我介绍。',
    ex:[{ko:'저는 니콜입니다.', cn:'我是 Nico。'},{ko:'저는 제품 매니저입니다.', cn:'我是产品经理。'}] },
  { wk:3, pat:'N이에요/예요', cn:'……是……（口语礼貌体）',
    note:'有收音用 이에요，无收音用 예요。日常对话用这个，比 입니다 柔和。',
    ex:[{ko:'저는 회사원이에요.', cn:'我是公司职员。'},{ko:'이거 뭐예요?', cn:'这是什么？'}] },
  { wk:3, pat:'N은/는', cn:'主题助词：至于……',
    note:'把话题拎出来。自我介绍几乎都以 저는 开头。它和 이/가 的区别是「强调主题」还是「强调主语」。',
    ex:[{ko:'저는 중국 사람이에요.', cn:'我是中国人。'},{ko:'오늘은 바빠요.', cn:'今天（倒是）很忙。'}] },
  { wk:4, pat:'N이/가', cn:'主格助词：谁 / 什么在做',
    note:'引出新信息或强调主语。问「谁、什么」时，回答用 이/가。',
    ex:[{ko:'물이 없어요.', cn:'没有水。'},{ko:'누가 왔어요?', cn:'谁来了？'}] },
  { wk:4, pat:'이 / 그 / 저 + N', cn:'这 / 那 / 那（远处）',
    note:'이 指近处，그 指对方那边或刚提过，저 指双方都远的。',
    ex:[{ko:'이 사람은 제 친구예요.', cn:'这个人是我朋友。'},{ko:'저 건물이 우리 회사예요.', cn:'那栋楼是我们公司。'}] },
  { wk:4, pat:'은/는 vs 이/가', cn:'主题 vs 主语',
    note:'一句话记法：은/는 说「关于它，我知道什么」；이/가 说「是谁/什么在做这件事」。初次出现用 이/가，接着聊用 은/는。',
    ex:[{ko:'옛날에 왕이 있었어요. 그 왕은…', cn:'从前有个王。那个王……'},{ko:'제가 할게요.', cn:'我来做。（强调是我）'}] },
  { wk:5, pat:'汉字数词 일 이 삼…', cn:'一 二 三（用于金额、日期、电话）',
    note:'일(1) 이(2) 삼(3) 사(4) 오(5) 육(6) 칠(7) 팔(8) 구(9) 십(10) 백(100) 천(1000) 만(万)。和中文数字几乎一一对应。',
    ex:[{ko:'삼천 원이에요.', cn:'三千韩元。'},{ko:'이월 십사일', cn:'2 月 14 日'}] },
  { wk:5, pat:'固有数词 하나 둘 셋…', cn:'一 二 三（用于数东西、说钟点）',
    note:'하나(1) 둘(2) 셋(3) 넷(4) 다섯(5) 여섯(6) 일곱(7) 여덟(8) 아홉(9) 열(10)。数东西时后面常缩写：한 개、두 명、세 시。',
    ex:[{ko:'두 개 주세요.', cn:'请给我两个。'},{ko:'세 시에 만나요.', cn:'三点见。'}] },
  { wk:5, pat:'N에', cn:'在（时间）/ 往（方向）',
    note:'时间点后加 에，目的地后也加 에（搭配 가다/오다）。',
    ex:[{ko:'아홉 시에 출근해요.', cn:'九点上班。'},{ko:'서울에 가요.', cn:'去首尔。'}] },
  { wk:5, pat:'N부터 N까지', cn:'从……到……',
    note:'时间、地点都能用。上班族最实用的一句：출근 시간부터 퇴근 시간까지。',
    ex:[{ko:'아홉 시부터 여섯 시까지 일해요.', cn:'从九点工作到六点。'},{ko:'월요일부터 금요일까지', cn:'周一到周五'}] },
  { wk:6, pat:'V-아요 / 어요', cn:'动词现在时（礼貌体）',
    note:'词干最后一个元音是 ㅏ/ㅗ 用 -아요，其他用 -어요，하다 变 해요。这是韩语最核心的活用规则。',
    ex:[{ko:'가다 → 가요', cn:'去'},{ko:'먹다 → 먹어요', cn:'吃'}] },
  { wk:6, pat:'하다 动词', cn:'공부하다 → 공부해요',
    note:'所有 -하다 结尾的动词（공부하다、일하다、전화하다、확인하다）都统一变成 -해요，不用记不规则。',
    ex:[{ko:'매일 한국어를 공부해요.', cn:'每天学韩语。'},{ko:'내일 전화할게요.', cn:'明天给你打电话。'}] },
  { wk:6, pat:'N을/를', cn:'宾格助词：动作的对象',
    note:'有收音用 을，无收音用 를。位置在宾语后面、动词前面。',
    ex:[{ko:'커피를 마셔요.', cn:'喝咖啡。'},{ko:'이메일을 보냈어요.', cn:'发了邮件。'}] },
  { wk:7, pat:'N에 있다 / 없다', cn:'在 / 不在，有 / 没有',
    note:'表达存在。「在哪里」的句型是 N이/가 어디에 있어요?',
    ex:[{ko:'화장실이 어디에 있어요?', cn:'洗手间在哪里？'},{ko:'시간이 없어요.', cn:'没有时间。'}] },
  { wk:7, pat:'N에서', cn:'在（某处做某事）',
    note:'에 表示存在的位置，에서 表示动作发生的地点。这个区分中国人最容易混。',
    ex:[{ko:'회사에서 일해요.', cn:'在公司工作。'},{ko:'집에서 공부해요.', cn:'在家学习。'}] },
  { wk:7, pat:'N도', cn:'也 / 还',
    note:'替代 은/는、이/가、을/를，不能叠加。',
    ex:[{ko:'저도 학생이에요.', cn:'我也是学生。'},{ko:'이것도 주세요.', cn:'这个也请给我。'}] },
  { wk:8, pat:'V-았/었어요', cn:'过去时',
    note:'ㅏ/ㅗ 结尾加 -았어요，其他加 -었어요，하다 变 했어요。',
    ex:[{ko:'어제 회의가 있었어요.', cn:'昨天有会议。'},{ko:'보고서를 만들었어요.', cn:'做好了报告。'}] },
  { wk:8, pat:'안 + V', cn:'不（主观否定）',
    note:'放在动词前面。하다 动词说 안 하다，也可以整句用 -지 않아요（更书面）。',
    ex:[{ko:'오늘은 안 바빠요.', cn:'今天不忙。'},{ko:'저는 안 갔어요.', cn:'我没去。'}] },
  { wk:8, pat:'못 + V', cn:'不能 / 做不了（能力或客观限制）',
    note:'안 是「不愿意/不」，못 是「做不到」。这个区分很关键，说错会显得不礼貌。',
    ex:[{ko:'오늘은 못 갑니다.', cn:'今天去不了。'},{ko:'한국어를 못 해요.', cn:'不会韩语。'}] },
  { wk:9, pat:'V-(으)세요', cn:'请……（请求 / 命令）',
    note:'有收音加 -으세요，无收音加 -세요。加 주세요 表示「请为我做」。',
    ex:[{ko:'여기 앉으세요.', cn:'请坐这里。'},{ko:'천천히 말해 주세요.', cn:'请说慢一点。'}] },
  { wk:9, pat:'V-(으)ㅂ시다', cn:'一起……吧',
    note:'正式的建议体，会议里提议用得上。口语更常说 -아/어요。',
    ex:[{ko:'같이 갑시다.', cn:'一起去吧。'},{ko:'시작합시다.', cn:'开始吧。'}] },
  { wk:9, pat:'V-고 싶다', cn:'想……',
    note:'去掉 다 加 -고 싶어요。主语是「我」时常用；说别人想什么要用 -고 싶어하다。',
    ex:[{ko:'한국어를 배우고 싶어요.', cn:'想学韩语。'},{ko:'뭐 먹고 싶어요?', cn:'想吃什么？'}] },
  { wk:10, pat:'V-고', cn:'……然后 / 并且',
    note:'连接两个动作，先后或并列都行，主语要一致。',
    ex:[{ko:'먹고 잤어요.', cn:'吃了然后睡了。'},{ko:'이 제품은 가볍고 좋아요.', cn:'这个产品又轻又好。'}] },
  { wk:10, pat:'V-아서 / 어서', cn:'因为……所以 / ……然后',
    note:'原因和先后都能用。注意：后面不能接命令句或建议句。',
    ex:[{ko:'바빠서 못 갔어요.', cn:'因为忙没能去。'},{ko:'만나서 반갑습니다.', cn:'见到你很高兴。'}] },
  { wk:10, pat:'V-지만', cn:'……但是',
    note:'前后对比，语气比 그런데 更书面，商务场合很常用。',
    ex:[{ko:'비싸지만 품질이 좋아요.', cn:'贵但质量好。'},{ko:'작지만 성능이 좋습니다.', cn:'体积小但性能好。'}] },
  { wk:11, pat:'V-(으)ㄹ 거예요', cn:'将要……（计划 / 推测）',
    note:'表将来的计划。正式场合用 -(으)ㄹ 것입니다。',
    ex:[{ko:'내일 다시 연락드릴게요.', cn:'明天再联系您。'},{ko:'다음 주에 출장을 갈 거예요.', cn:'下周出差。'}] },
  { wk:11, pat:'V-(으)ㄹ 수 있다/없다', cn:'能 / 不能',
    note:'能力的核心句型。敬语里说 -(으)실 수 있으세요? 更礼貌。',
    ex:[{ko:'한국어를 조금 할 수 있어요.', cn:'会一点韩语。'},{ko:'이건 제가 할 수 없어요.', cn:'这个我做不了。'}] },
  { wk:11, pat:'V-고 있다', cn:'正在……',
    note:'进行时，等于「-着」。电话里说「正在开会」就靠它。',
    ex:[{ko:'지금 회의하고 있어요.', cn:'正在开会。'},{ko:'기다리고 있습니다.', cn:'正在等待。'}] },
  { wk:12, pat:'V-(으)면', cn:'如果……的话',
    note:'条件句。加 좋겠다 表示「要是……就好了」。',
    ex:[{ko:'시간이 있으면 갈게요.', cn:'有时间的话就去。'},{ko:'문제가 있으면 알려 주세요.', cn:'有问题请告诉我。'}] },
  { wk:12, pat:'V-아야 / 어야 하다', cn:'必须……',
    note:'义务和必要。口语里 해야 해요 出现频率极高。',
    ex:[{ko:'지금 가야 해요.', cn:'现在得走了。'},{ko:'납기를 꼭 지켜야 합니다.', cn:'必须遵守交期。'}] }
];

/* ---------------- 词汇 ---------------- */
const VOCAB = [
  { wk:3, theme:'问候与称呼', words:[
    { ko:'안녕하세요', rm:'annyeonghaseyo', cn:'你好' },
    { ko:'감사합니다', rm:'gamsahamnida', cn:'谢谢', hj:'感谢' },
    { ko:'죄송합니다', rm:'joesonghamnida', cn:'抱歉', hj:'罪悚' },
    { ko:'네', rm:'ne', cn:'是' },
    { ko:'아니요', rm:'aniyo', cn:'不是' },
    { ko:'이름', rm:'ireum', cn:'名字' },
    { ko:'만나다', rm:'mannada', cn:'见面' },
    { ko:'반갑습니다', rm:'bangapseumnida', cn:'很高兴认识你' },
    { ko:'저', rm:'jeo', cn:'我（谦称）' },
    { ko:'우리', rm:'uri', cn:'我们' },
    { ko:'안녕히 가세요', rm:'annyeonghi gaseyo', cn:'再见（对离开的人）' },
    { ko:'안녕히 계세요', rm:'annyeonghi gyeseyo', cn:'再见（对留下的人）' }
  ]},
  { wk:4, theme:'人物与身份', words:[
    { ko:'사람', rm:'saram', cn:'人' },
    { ko:'친구', rm:'chingu', cn:'朋友' },
    { ko:'회사원', rm:'hoesawon', cn:'公司职员', hj:'会社员' },
    { ko:'학생', rm:'haksaeng', cn:'学生', hj:'学生' },
    { ko:'선생님', rm:'seonsaengnim', cn:'老师', hj:'先生' },
    { ko:'사장님', rm:'sajangnim', cn:'社长 / 老板', hj:'社长' },
    { ko:'고객', rm:'gogaek', cn:'客户', hj:'顾客' },
    { ko:'팀장', rm:'timjang', cn:'组长', hj:'组长' },
    { ko:'제품', rm:'jepum', cn:'产品', hj:'制品' },
    { ko:'관리자', rm:'gwallija', cn:'管理者', hj:'管理者' },
    { ko:'동료', rm:'dongnyo', cn:'同事', hj:'同僚' },
    { ko:'직원', rm:'jigwon', cn:'职员', hj:'职员' }
  ]},
  { wk:5, theme:'数字与时间', words:[
    { ko:'오늘', rm:'oneul', cn:'今天' },
    { ko:'내일', rm:'naeil', cn:'明天' },
    { ko:'어제', rm:'eoje', cn:'昨天' },
    { ko:'아침', rm:'achim', cn:'早上' },
    { ko:'점심', rm:'jeomsim', cn:'中午', hj:'点心' },
    { ko:'저녁', rm:'jeonyeok', cn:'晚上' },
    { ko:'시', rm:'si', cn:'点（钟点）', hj:'时' },
    { ko:'분', rm:'bun', cn:'分', hj:'分' },
    { ko:'시간', rm:'sigan', cn:'时间 / 小时', hj:'时间' },
    { ko:'주', rm:'ju', cn:'周', hj:'周' },
    { ko:'달', rm:'dal', cn:'月' },
    { ko:'년', rm:'nyeon', cn:'年', hj:'年' }
  ]},
  { wk:6, theme:'日常动作', words:[
    { ko:'가다', rm:'gada', cn:'去' },
    { ko:'오다', rm:'oda', cn:'来' },
    { ko:'먹다', rm:'meokda', cn:'吃' },
    { ko:'마시다', rm:'masida', cn:'喝' },
    { ko:'보다', rm:'boda', cn:'看' },
    { ko:'듣다', rm:'deutda', cn:'听' },
    { ko:'말하다', rm:'malhada', cn:'说' },
    { ko:'읽다', rm:'ikda', cn:'读' },
    { ko:'쓰다', rm:'sseuda', cn:'写 / 用' },
    { ko:'자다', rm:'jada', cn:'睡' },
    { ko:'일하다', rm:'ilhada', cn:'工作' },
    { ko:'배우다', rm:'baeuda', cn:'学' }
  ]},
  { wk:7, theme:'场所与位置', words:[
    { ko:'집', rm:'jip', cn:'家' },
    { ko:'회사', rm:'hoesa', cn:'公司', hj:'会社' },
    { ko:'학교', rm:'hakgyo', cn:'学校', hj:'学校' },
    { ko:'화장실', rm:'hwajangsil', cn:'洗手间', hj:'化粧室' },
    { ko:'식당', rm:'sikdang', cn:'餐厅', hj:'食堂' },
    { ko:'카페', rm:'kape', cn:'咖啡厅' },
    { ko:'지하철', rm:'jihacheol', cn:'地铁', hj:'地下铁' },
    { ko:'공항', rm:'gonghang', cn:'机场', hj:'空港' },
    { ko:'병원', rm:'byeongwon', cn:'医院', hj:'病院' },
    { ko:'은행', rm:'eunhaeng', cn:'银行', hj:'银行' },
    { ko:'가게', rm:'gage', cn:'商店' },
    { ko:'어디', rm:'eodi', cn:'哪里' }
  ]},
  { wk:8, theme:'食物与饮食', words:[
    { ko:'밥', rm:'bap', cn:'饭' },
    { ko:'물', rm:'mul', cn:'水' },
    { ko:'커피', rm:'keopi', cn:'咖啡' },
    { ko:'김치', rm:'kimchi', cn:'泡菜' },
    { ko:'고기', rm:'gogi', cn:'肉' },
    { ko:'야채', rm:'yachae', cn:'蔬菜', hj:'野菜' },
    { ko:'과일', rm:'gwail', cn:'水果', hj:'果物' },
    { ko:'맥주', rm:'maekju', cn:'啤酒', hj:'麦酒' },
    { ko:'차', rm:'cha', cn:'茶', hj:'茶' },
    { ko:'국', rm:'guk', cn:'汤' },
    { ko:'면', rm:'myeon', cn:'面', hj:'面' },
    { ko:'맛있다', rm:'masitda', cn:'好吃' }
  ]},
  { wk:9, theme:'购物与价格', words:[
    { ko:'얼마', rm:'eolma', cn:'多少钱' },
    { ko:'비싸다', rm:'bissada', cn:'贵' },
    { ko:'싸다', rm:'ssada', cn:'便宜' },
    { ko:'사다', rm:'sada', cn:'买' },
    { ko:'팔다', rm:'palda', cn:'卖' },
    { ko:'돈', rm:'don', cn:'钱' },
    { ko:'카드', rm:'kadeu', cn:'卡' },
    { ko:'현금', rm:'hyeongeum', cn:'现金', hj:'现金' },
    { ko:'할인', rm:'harin', cn:'打折', hj:'割引' },
    { ko:'봉투', rm:'bongtu', cn:'袋子' },
    { ko:'영수증', rm:'yeongsujeung', cn:'收据', hj:'领收证' },
    { ko:'주세요', rm:'juseyo', cn:'请给我' }
  ]},
  { wk:10, theme:'交通与出行', words:[
    { ko:'지하철', rm:'jihacheol', cn:'地铁', hj:'地下铁' },
    { ko:'버스', rm:'beoseu', cn:'公交车' },
    { ko:'택시', rm:'taeksi', cn:'出租车' },
    { ko:'기차', rm:'gicha', cn:'火车', hj:'汽车' },
    { ko:'표', rm:'pyo', cn:'票', hj:'票' },
    { ko:'역', rm:'yeok', cn:'车站', hj:'驿' },
    { ko:'출구', rm:'chulgu', cn:'出口', hj:'出口' },
    { ko:'입구', rm:'ipgu', cn:'入口', hj:'入口' },
    { ko:'길', rm:'gil', cn:'路' },
    { ko:'오른쪽', rm:'oreunjjok', cn:'右边' },
    { ko:'왼쪽', rm:'oenjjok', cn:'左边' },
    { ko:'가깝다', rm:'gakkapda', cn:'近' }
  ]},
  { wk:11, theme:'天气与感受', words:[
    { ko:'날씨', rm:'nalssi', cn:'天气' },
    { ko:'덥다', rm:'deopda', cn:'热' },
    { ko:'춥다', rm:'chupda', cn:'冷' },
    { ko:'비', rm:'bi', cn:'雨' },
    { ko:'눈', rm:'nun', cn:'雪 / 眼睛' },
    { ko:'바람', rm:'baram', cn:'风' },
    { ko:'좋다', rm:'jota', cn:'好' },
    { ko:'나쁘다', rm:'nappeuda', cn:'坏' },
    { ko:'피곤하다', rm:'pigonhada', cn:'累', hj:'疲劳' },
    { ko:'바쁘다', rm:'bappeuda', cn:'忙' },
    { ko:'재미있다', rm:'jaemiitda', cn:'有趣', hj:'趣味' },
    { ko:'어렵다', rm:'eoryeopda', cn:'难' }
  ]},
  { wk:12, theme:'工作与办公', words:[
    { ko:'회의', rm:'hoeui', cn:'会议', hj:'会议' },
    { ko:'보고서', rm:'bogoseo', cn:'报告', hj:'报告书' },
    { ko:'이메일', rm:'imeil', cn:'邮件' },
    { ko:'일정', rm:'iljeong', cn:'日程', hj:'日程' },
    { ko:'마감', rm:'magam', cn:'截止' },
    { ko:'계약', rm:'gyeyak', cn:'合同', hj:'契约' },
    { ko:'견적', rm:'gyeonjeok', cn:'报价', hj:'见积' },
    { ko:'납기', rm:'napgi', cn:'交期', hj:'纳期' },
    { ko:'기술', rm:'gisul', cn:'技术', hj:'技术' },
    { ko:'지원', rm:'jiwon', cn:'支持', hj:'支援' },
    { ko:'문제', rm:'munje', cn:'问题', hj:'问题' },
    { ko:'확인', rm:'hwagin', cn:'确认', hj:'确认' }
  ]}
];

/* ---------------- 通勤听力句 ---------------- */
const LINES = [
  { wk:1, ko:'가 나 다 라 마 바 사', rm:'ga na da ra ma ba sa', cn:'辅音顺序朗读' },
  { wk:1, ko:'아 어 오 우 으 이', rm:'a eo o u eu i', cn:'六个基础元音' },
  { wk:1, ko:'한글은 쉽습니다', rm:'hangeureun swipseumnida', cn:'韩文很容易' },
  { wk:1, ko:'천천히 읽어 보세요', rm:'cheoncheonhi ilgeo boseyo', cn:'请慢慢读读看' },
  { wk:1, ko:'이거 어떻게 읽어요?', rm:'igeo eotteoke ilgeoyo', cn:'这个怎么读？' },
  { wk:1, ko:'다시 한번', rm:'dasi hanbeon', cn:'再一次' },

  { wk:2, ko:'받침이 어려워요', rm:'batchimi eoryeowoyo', cn:'收音很难' },
  { wk:2, ko:'한국어 발음이 좋아요', rm:'hangugeo bareumi joayo', cn:'你的韩语发音很好' },
  { wk:2, ko:'조금 더 크게 말해 주세요', rm:'jogeum deo keuge malhae juseyo', cn:'请说大声一点' },
  { wk:2, ko:'저는 중국 사람입니다', rm:'jeoneun jungguk saram-imnida', cn:'我是中国人' },
  { wk:2, ko:'연습이 필요해요', rm:'yeonseubi piryohaeyo', cn:'需要练习' },
  { wk:2, ko:'잘 했어요', rm:'jal haesseoyo', cn:'做得好' },

  { wk:3, ko:'안녕하세요', rm:'annyeonghaseyo', cn:'你好' },
  { wk:3, ko:'저는 니콜입니다', rm:'jeoneun nikol-imnida', cn:'我是 Nico' },
  { wk:3, ko:'만나서 반갑습니다', rm:'mannaseo bangapseumnida', cn:'很高兴见到你' },
  { wk:3, ko:'이름이 뭐예요?', rm:'ireumi mwoyeyo', cn:'你叫什么名字？' },
  { wk:3, ko:'저는 제품 매니저예요', rm:'jeoneun jepum maejijeoyeyo', cn:'我是产品经理' },
  { wk:3, ko:'감사합니다', rm:'gamsahamnida', cn:'谢谢' },

  { wk:4, ko:'이게 뭐예요?', rm:'ige mwoyeyo', cn:'这是什么？' },
  { wk:4, ko:'저 사람은 제 친구예요', rm:'jeo sarameun je chinguyeyo', cn:'那个人是我朋友' },
  { wk:4, ko:'이건 제 책이 아니에요', rm:'igeon je chaegi anieyo', cn:'这不是我的书' },
  { wk:4, ko:'우리 회사는 여기 있어요', rm:'uri hoesaneun yeogi isseoyo', cn:'我们公司在这里' },
  { wk:4, ko:'잘 모르겠어요', rm:'jal moreugesseoyo', cn:'我不太清楚' },
  { wk:4, ko:'그분은 선생님이세요', rm:'geubuneun seonsaengnimiseyo', cn:'那位是老师' },

  { wk:5, ko:'지금 몇 시예요?', rm:'jigeum myeot siyeyo', cn:'现在几点？' },
  { wk:5, ko:'세 시 반이에요', rm:'se si banieyo', cn:'三点半' },
  { wk:5, ko:'오늘은 11월 4일이에요', rm:'oneureun sirowol sairieyo', cn:'今天是 11 月 4 日' },
  { wk:5, ko:'아홉 시부터 여섯 시까지 일해요', rm:'ahop sibuteo yeoseot sikkaji ilhaeyo', cn:'从九点工作到六点' },
  { wk:5, ko:'얼마예요?', rm:'eolmayeyo', cn:'多少钱？' },
  { wk:5, ko:'이거 두 개 주세요', rm:'igeo du gae juseyo', cn:'请给我两个' },

  { wk:6, ko:'저는 회사에 가요', rm:'jeoneun hoesae gayo', cn:'我去公司' },
  { wk:6, ko:'아침에 커피를 마셔요', rm:'achime keopireul masyeoyo', cn:'早上喝咖啡' },
  { wk:6, ko:'매일 한국어를 배워요', rm:'maeil hangugeoreul baewoyo', cn:'每天学韩语' },
  { wk:6, ko:'보통 지하철을 타요', rm:'botong jihacheoreul tayo', cn:'通常坐地铁' },
  { wk:6, ko:'뭐 먹고 싶어요?', rm:'mwo meokgo sipeoyo', cn:'想吃什么？' },
  { wk:6, ko:'천천히 말해 주세요', rm:'cheoncheonhi malhae juseyo', cn:'请说慢一点' },

  { wk:7, ko:'화장실이 어디에 있어요?', rm:'hwajangsiri eodie isseoyo', cn:'洗手间在哪？' },
  { wk:7, ko:'회의실은 3층에 있어요', rm:'hoeuisireun samcheunge isseoyo', cn:'会议室在三楼' },
  { wk:7, ko:'저는 회사에서 일해요', rm:'jeoneun hoesaeseo ilhaeyo', cn:'我在公司工作' },
  { wk:7, ko:'시간이 없어요', rm:'sigani eopseoyo', cn:'没时间' },
  { wk:7, ko:'저도 그렇게 생각해요', rm:'jeodo geureoke saenggakhaeyo', cn:'我也这么想' },
  { wk:7, ko:'여기 앉으세요', rm:'yeogi anjeuseyo', cn:'请坐这里' },

  { wk:8, ko:'어제 회의가 있었어요', rm:'eoje hoeuiga isseosseoyo', cn:'昨天有会议' },
  { wk:8, ko:'보고서를 다 만들었어요', rm:'bogoseoreul da mandeureosseoyo', cn:'报告做完了' },
  { wk:8, ko:'오늘은 안 바빠요', rm:'oneureun an bappayo', cn:'今天不忙' },
  { wk:8, ko:'죄송해요, 못 갔어요', rm:'joesonghaeyo, mot gasseoyo', cn:'抱歉，我没能去' },
  { wk:8, ko:'이메일을 보냈어요', rm:'imeireul bonaesseoyo', cn:'邮件发出了' },
  { wk:8, ko:'확인 부탁드립니다', rm:'hwagin butakdeurimnida', cn:'请确认' },

  { wk:9, ko:'다시 한번 말씀해 주세요', rm:'dasi hanbeon malsseumhae juseyo', cn:'请再说一次' },
  { wk:9, ko:'조금만 기다려 주세요', rm:'jogeumman gidaryeo juseyo', cn:'请稍等' },
  { wk:9, ko:'같이 갑시다', rm:'gachi gapsida', cn:'一起去吧' },
  { wk:9, ko:'저는 한국에 가고 싶어요', rm:'jeoneun hanguge gago sipeoyo', cn:'我想去韩国' },
  { wk:9, ko:'이거 도와주실 수 있어요?', rm:'igeo dowajusil su isseoyo', cn:'能帮我一下吗？' },
  { wk:9, ko:'괜찮습니다', rm:'gwaenchansseumnida', cn:'没关系' },

  { wk:10, ko:'회의가 끝나고 연락드릴게요', rm:'hoeuiga kkeutnago yeollakdeurilgeyo', cn:'会议结束后联系您' },
  { wk:10, ko:'바빠서 못 갔어요', rm:'bappaseo mot gasseoyo', cn:'因为忙没能去' },
  { wk:10, ko:'비싸지만 품질이 좋아요', rm:'bissajiman pumjiri joayo', cn:'贵但质量好' },
  { wk:10, ko:'이 제품은 가볍고 좋아요', rm:'i jepumeun gabyeopgo joayo', cn:'这个产品又轻又好' },
  { wk:10, ko:'시간이 있어서 다행이에요', rm:'sigani isseoseo dahaengieyo', cn:'有时间真好' },
  { wk:10, ko:'이해했어요', rm:'ihaehaesseoyo', cn:'明白了' },

  { wk:11, ko:'내일 다시 연락드릴게요', rm:'naeil dasi yeollakdeurilgeyo', cn:'明天再联系您' },
  { wk:11, ko:'다음 주에 출장을 갈 거예요', rm:'daeum jue chuljangeul gal geoyeyo', cn:'下周出差' },
  { wk:11, ko:'한국어를 조금 할 수 있어요', rm:'hangugeoreul jogeum hal su isseoyo', cn:'会一点韩语' },
  { wk:11, ko:'지금 회의하고 있어요', rm:'jigeum hoeuihago isseoyo', cn:'正在开会' },
  { wk:11, ko:'이건 제가 할 수 없어요', rm:'igeon jega hal su eopseoyo', cn:'这个我做不了' },
  { wk:11, ko:'가능합니다', rm:'ganeunghamnida', cn:'可以' },

  { wk:12, ko:'시간이 있으면 꼭 갈게요', rm:'sigani isseumyeon kkok galgeyo', cn:'有时间的话一定去' },
  { wk:12, ko:'지금 가야 해요', rm:'jigeum gaya haeyo', cn:'现在得走了' },
  { wk:12, ko:'문제가 있으면 알려 주세요', rm:'munjega isseumyeon allyeo juseyo', cn:'有问题请告诉我' },
  { wk:12, ko:'납기를 꼭 지켜 주세요', rm:'napgireul kkok jikyeo juseyo', cn:'请务必遵守交期' },
  { wk:12, ko:'견적서를 보내드릴게요', rm:'gyeonjeokseoreul bonaedeurilgeyo', cn:'我把报价单发给您' },
  { wk:12, ko:'좋은 하루 보내세요', rm:'joeun haru bonaeseyo', cn:'祝你今天愉快' }
];

/* ---------------- 场景速查 ---------------- */
const CHEATS = [
  { group:'会议开场', items:[
    { ko:'오늘 회의를 시작하겠습니다.', cn:'现在开始今天的会议。' },
    { ko:'먼저 일정부터 확인하겠습니다.', cn:'先确认一下日程。' },
    { ko:'화면 공유하겠습니다.', cn:'我来共享屏幕。' },
    { ko:'질문 있으시면 말씀해 주세요.', cn:'有问题请说。' }
  ]},
  { group:'没听懂时', items:[
    { ko:'죄송합니다, 다시 한번 말씀해 주시겠어요?', cn:'抱歉，能再说一次吗？' },
    { ko:'조금 천천히 말씀해 주세요.', cn:'请说慢一点。' },
    { ko:'무슨 뜻인지 잘 이해하지 못했어요.', cn:'我没太理解是什么意思。' },
    { ko:'채팅으로 적어 주시면 더 정확합니다.', cn:'写在聊天里我会更准确。' }
  ]},
  { group:'技术沟通', items:[
    { ko:'이 기능은 지원되지 않습니다.', cn:'这个功能不支持。' },
    { ko:'확인 후에 다시 연락드리겠습니다.', cn:'确认后再联系您。' },
    { ko:'개발 일정을 조정해야 합니다.', cn:'需要调整开发日程。' },
    { ko:'재현 방법을 알려 주시겠어요?', cn:'能告诉我复现方法吗？' },
    { ko:'로그를 보내 주시면 분석하겠습니다.', cn:'发日志给我，我来分析。' }
  ]},
  { group:'邮件与交期', items:[
    { ko:'견적서를 첨부드립니다.', cn:'附上报价单。' },
    { ko:'납기는 12월 초로 예상됩니다.', cn:'交期预计在 12 月初。' },
    { ko:'회신 부탁드립니다.', cn:'请回复。' },
    { ko:'확인 부탁드립니다.', cn:'请确认。' },
    { ko:'항상 협조해 주셔서 감사합니다.', cn:'感谢您一直以来的配合。' }
  ]},
  { group:'礼貌缓冲（说"不"时）', items:[
    { ko:'검토해 보겠습니다.', cn:'我考虑一下。（委婉拒绝）' },
    { ko:'어려울 것 같습니다.', cn:'恐怕比较困难。' },
    { ko:'내부 논의가 필요합니다.', cn:'需要内部讨论。' },
    { ko:'가능한 범위에서 노력하겠습니다.', cn:'我会在可能范围内努力。' }
  ]}
];

/* ---------------- 精选手写练习题 ---------------- */
const QUIZ = [
  { q:'下面哪个元音最接近英语 but 中的 u？', opts:['ㅏ','ㅓ','ㅗ','ㅜ'], a:1,
    exp:'ㅓ 是否则最容易错的音——嘴唇不圆，舌后缩。ㅗ 则是圆唇。' },
  { q:'「안녕하세요」变成正式书面体应该是？', opts:['안녕합니다','안녕하십니까','안녕이에요','안녕해요'], a:1,
    exp:'안녕하십니까 是最正式的问候，会议开场和邮件开头都用它。' },
  { q:'「회사에서 일해요」中的 에서 表示什么？', opts:['存在的位置','动作发生的地点','方向','时间'], a:1,
    exp:'에서 是动作发生的场所；에 才是存在的位置。这是中国人最容易混的一对。' },
  { q:'「贵但是质量好」的正确说法是？', opts:['비싸고 품질이 좋아요','비싸서 품질이 좋아요','비싸지만 품질이 좋아요','비싸면 품질이 좋아요'], a:2,
    exp:'-지만 表转折。商务谈判里这句话出现率极高。' },
  { q:'「안 갔어요」和「못 갔어요」的区别是？', opts:['没有区别','안 是没去，못 是去不了','안 是去不了，못 是没去','前者是过去时'], a:1,
    exp:'안 是主观不做，못 是能力或客观条件不允许。说错会显得不礼貌。' },
  { q:'收音 ㄱ 后面接 ㄴ 时，会发生什么变化？', opts:['连音化','紧音化','鼻音化','流音化'], a:2,
    exp:'국물 读作 [궁물]。입니다 读作 [임니다] 也是同一条规则。' },
  { q:'「请说慢一点」用韩语怎么说？', opts:['천천히 말해 주세요','천천히 말하고 싶어요','천천히 말할 수 있어요','천천히 말해야 해요'], a:0,
    exp:'-아/어 주세요 是「请为我做」，礼貌请求的万能句式。' },
  { q:'「저는 회사원입니다」中的 입니다 属于？', opts:['口语体','正式体','过去时','否定'], a:1,
    exp:'입니다 用于正式场合；日常对话用 이에요/예요 更自然。' },
  { q:'汉字数词「삼천」是多少？', opts:['300','3000','30','13'], a:1,
    exp:'삼(3) + 천(1000) = 3000。汉字数词和中文几乎一一对应。' },
  { q:'「지금 회의하고 있어요」表达的是？', opts:['开过会了','正在开会','要去开会','不想开会'], a:1,
    exp:'-고 있다 是进行时。电话里最实用的一句。' },
  { q:'下面哪个是固有数词的「三」？', opts:['삼','셋','사','서'], a:1,
    exp:'셋 是固有数词三，数东西时缩写成 세（세 시 = 三点）。' },
  { q:'「비가 와서 못 갔어요」中 -아서 表示？', opts:['转折','原因','条件','并列'], a:1,
    exp:'-아서/어서 表原因，但后面不能接命令句或建议句。' },
  { q:'「请确认」在商务邮件里最得体的说法是？', opts:['확인해','확인해요','확인 부탁드립니다','확인하세요'], a:2,
    exp:'부탁드립니다 是「拜托您」的敬语，比直接命令柔和得多。' },
  { q:'①ㄹ 作收音时最接近哪个音？', opts:['r','l','n','d'], a:1,
    exp:'词首近 r（弹舌），收音近 l。라면 是 [ra-myeon]，물 是 [mul]。' },
  { q:'「-ㄹ 수 있다」前面的动词应该用什么形式？', opts:['原形','词干','过去式','命令式'], a:1,
    exp:'所有语法都接在词干（去掉 다）后面：할 수 있어요 = 하 + ㄹ 수 있다。' },
  { q:'「회의가 끝나고 연락드릴게요」的意思是？', opts:['会议开始前联系您','会议结束后联系您','会议中联系您','会议取消了'], a:1,
    exp:'-고 表先后顺序，끝나고 = 结束之后。' }
];

/* ---------------- 旅行场景 ---------------- */
const TRAVEL = [
  { id:'airport', name:'机场', icon:'✈', words:[
      { ko:'공항', rm:'gonghang', cn:'机场', hj:'空港' },
      { ko:'여권', rm:'yeogwon', cn:'护照', hj:'旅券' },
      { ko:'짐', rm:'jim', cn:'行李' },
      { ko:'탑승권', rm:'apseunggwon', cn:'登机牌', hj:'搭乘券' },
      { ko:'출발', rm:'chulbal', cn:'出发', hj:'出发' },
      { ko:'도착', rm:'dochak', cn:'到达', hj:'到着' },
      { ko:'게이트', rm:'geiteu', cn:'登机口' },
      { ko:'항공권', rm:'hanggonggwon', cn:'机票', hj:'航空券' }
    ], lines:[
      { ko:'공항은 어떻게 가요?', rm:'gonghangeun eotteoke gayo', cn:'机场怎么走？' },
      { ko:'체크인은 어디에서 해요?', rm:'chekeineun eodieseo haeyo', cn:'在哪里办理登机手续？' },
      { ko:'탑승구는 몇 번이에요?', rm:'apseungguneun myeot beonieyo', cn:'登机口是几号？' },
      { ko:'여권을 보여 주세요', rm:'yeogwoneul boyeo juseyo', cn:'请出示护照' },
      { ko:'짐이 너무 많아요', rm:'jimi neomu manayo', cn:'行李太多了' },
      { ko:'오후 세 시 비행기예요', rm:'ohu se si bihaenggineyo', cn:'是下午三点的飞机' }
    ]},
  { id:'station', name:'车站交通', icon:'⇄', words:[
      { ko:'역', rm:'yeok', cn:'车站', hj:'驿' },
      { ko:'표', rm:'pyo', cn:'票', hj:'票' },
      { ko:'승강장', rm:'seunggangjang', cn:'站台', hj:'乘降场' },
      { ko:'환승', rm:'hwanseung', cn:'换乘', hj:'换乘' },
      { ko:'매표소', rm:'maepyoso', cn:'售票处', hj:'卖票所' },
      { ko:'시내', rm:'sinae', cn:'市区', hj:'市内' },
      { ko:'노선', rm:'noseon', cn:'线路', hj:'路线' },
      { ko:'다음 역', rm:'daeum yeok', cn:'下一站' }
    ], lines:[
      { ko:'지하철 역이 어디예요?', rm:'jihacheol yeogi eodiyeyo', cn:'地铁站在哪？' },
      { ko:'표는 어디에서 사요?', rm:'pyoneun eodieseo sayo', cn:'票在哪里买？' },
      { ko:'이 버스 시내에 가요?', rm:'i beoseu sinaee gayo', cn:'这趟公交去市区吗？' },
      { ko:'다음 역에서 내릴게요', rm:'daeum yeogeseo naerilgeyo', cn:'我下一站下车' },
      { ko:'몇 정거장 더 가요?', rm:'myeot jeonggeojang deo gayo', cn:'还有几站？' },
      { ko:'여기서 갈아타야 해요?', rm:'yeogiseo garataya haeyo', cn:'要在这里换乘吗？' }
    ]},
  { id:'direction', name:'问路与方向', icon:'→', words:[
      { ko:'직진', rm:'jikjin', cn:'直走', hj:'直进' },
      { ko:'왼쪽', rm:'oenjjok', cn:'左边' },
      { ko:'오른쪽', rm:'oreunjjok', cn:'右边' },
      { ko:'앞', rm:'ap', cn:'前面' },
      { ko:'뒤', rm:'dwi', cn:'后面' },
      { ko:'옆', rm:'yeop', cn:'旁边' },
      { ko:'모퉁이', rm:'motung-i', cn:'拐角' },
      { ko:'건너편', rm:'geonneopyeon', cn:'对面' }
    ], lines:[
      { ko:'여기서 멀어요?', rm:'yeogiseo meoreoyo', cn:'离这里远吗？' },
      { ko:'걸어서 얼마나 걸려요?', rm:'georeoseo eolmana geollyeoyo', cn:'走过去要多久？' },
      { ko:'직진하면 왼쪽에 있어요', rm:'jikjinhamyeon oenjjoge isseoyo', cn:'直走就在左边' },
      { ko:'길을 잃었어요', rm:'gireul ilheosseoyo', cn:'我迷路了' },
      { ko:'지도 좀 그려 주세요', rm:'jido jom geuryeo juseyo', cn:'请帮我画个地图' },
      { ko:'여기가 맞아요?', rm:'yeogiga majayo', cn:'是这里吗？' }
    ]},
  { id:'hotel', name:'酒店住宿', icon:'⌂', words:[
      { ko:'호텔', rm:'hoter', cn:'酒店' },
      { ko:'예약', rm:'yeyak', cn:'预订', hj:'预约' },
      { ko:'체크인', rm:'chekeuin', cn:'入住' },
      { ko:'체크아웃', rm:'chekeuaut', cn:'退房' },
      { ko:'방', rm:'bang', cn:'房间' },
      { ko:'열쇠', rm:'yeolsoe', cn:'钥匙' },
      { ko:'숙소', rm:'sukso', cn:'住宿处', hj:'宿所' },
      { ko:'보관', rm:'bogwan', cn:'寄存', hj:'保管' }
    ], lines:[
      { ko:'예약했어요', rm:'yeyakhaesseoyo', cn:'我预订过了' },
      { ko:'체크인 부탁드립니다', rm:'chekeuin butakdeurimnida', cn:'麻烦办理入住' },
      { ko:'와이파이 비밀번호가 뭐예요?', rm:'waipai bimilbeonhoga mwoyeyo', cn:'WiFi 密码是多少？' },
      { ko:'짐을 맡길 수 있어요?', rm:'jimeul matgil su isseoyo', cn:'可以寄存行李吗？' },
      { ko:'내일 아침 일곱 시에 깨워 주세요', rm:'naeil achim ilgop sie kkaewo juseyo', cn:'明早七点请叫我' },
      { ko:'방에서 물 좀 주세요', rm:'bangeseo mul jom juseyo', cn:'请给房间送点水' }
    ]},
  { id:'food', name:'餐厅点餐', icon:'☕', words:[
      { ko:'메뉴', rm:'menyu', cn:'菜单' },
      { ko:'주문', rm:'jumun', cn:'点单', hj:'注文' },
      { ko:'계산', rm:'gyesan', cn:'结账', hj:'计算' },
      { ko:'추천', rm:'sucheon', cn:'推荐', hj:'推荐' },
      { ko:'배고프다', rm:'baegopeuda', cn:'饿' },
      { ko:'배부르다', rm:'baebureuda', cn:'饱' },
      { ko:'맛집', rm:'matjip', cn:'好吃的店' },
      { ko:'포장', rm:'pojang', cn:'打包', hj:'包装' }
    ], lines:[
      { ko:'메뉴 좀 주세요', rm:'menyu jom juseyo', cn:'请给我菜单' },
      { ko:'이거 하나 주세요', rm:'igeo hana juseyo', cn:'请给我这个' },
      { ko:'뭐가 맛있어요?', rm:'mwoga masisseoyo', cn:'什么好吃？' },
      { ko:'하나 더 주세요', rm:'hana deo juseyo', cn:'请再来一份' },
      { ko:'계산할게요', rm:'gyesanalgeyo', cn:'我来结账' },
      { ko:'너무 맛있어요!', rm:'neomu masisseoyo', cn:'太好吃了！' }
    ]},
  { id:'help', name:'购物与求助', icon:'!', words:[
      { ko:'환불', rm:'hwanbul', cn:'退款', hj:'还拂' },
      { ko:'교환', rm:'gyohwan', cn:'换货', hj:'交换' },
      { ko:'깎다', rm:'kkakda', cn:'砍价' },
      { ko:'도와주다', rm:'dowajuda', cn:'帮忙' },
      { ko:'경찰서', rm:'gyeongchalseo', cn:'警察局', hj:'警察署' },
      { ko:'약국', rm:'yakguk', cn:'药店', hj:'药局' },
      { ko:'잃어버리다', rm:'ilheobeorida', cn:'丢失' },
      { ko:'긴급', rm:'gingeup', cn:'紧急', hj:'紧急' }
    ], lines:[
      { ko:'좀 깎아 주세요', rm:'jom kkakka juseyo', cn:'能便宜一点吗？' },
      { ko:'카드 돼요?', rm:'kadeu dwaeyo', cn:'能刷卡吗？' },
      { ko:'환불하고 싶어요', rm:'hwanbulhago sipeoyo', cn:'我想退款' },
      { ko:'가방을 잃어버렸어요', rm:'gabangeul ilheobeoryeosseoyo', cn:'我的包丢了' },
      { ko:'도와주세요!', rm:'dowajuseyo', cn:'请帮帮我！' },
      { ko:'큰일 났어요', rm:'keunil nasseoyo', cn:'出大事了' }
    ]}
];

/* ---------- 初识韩文（0 基础引导页数据） ---------- */
/* 每个音节拆成字母：[字母, 读音]；name 为整词 */
const INTRO_WORDS = [
  {
    w: '한국', cn: '韩国',
    syl: [
      { block: '한', pieces: [['ㅎ', 'h（像打哈欠送气）'], ['ㅏ', 'a（啊）'], ['ㄴ', 'n（收尾鼻音）']], note: 'h + a + n → han' },
      { block: '국', pieces: [['ㄱ', 'g（k/g 之间）'], ['ㅜ', 'u（乌）'], ['ㄱ', 'g（收音读 k 味）']], note: 'g + u + g → guk' }
    ]
  },
  {
    w: '사랑', cn: '爱',
    syl: [
      { block: '사', pieces: [['ㅅ', 's（丝音）'], ['ㅏ', 'a（啊）']], note: 's + a → sa' },
      { block: '랑', pieces: [['ㄹ', 'l/r（舌颤音）'], ['ㅏ', 'a（啊）'], ['ㅇ', 'ng（尾鼻音）']], note: 'r + a + ng → rang' }
    ]
  },
  {
    w: '카메라', cn: '相机（外来词 camera）',
    syl: [
      { block: '카', pieces: [['ㅋ', 'k（比 ㄱ 更强的送气）'], ['ㅏ', 'a']], note: 'k + a → ka' },
      { block: '메', pieces: [['ㅁ', 'm（闭唇鼻音）'], ['ㅔ', 'e（诶）']], note: 'm + e → me' },
      { block: '라', pieces: [['ㄹ', 'r'], ['ㅏ', 'a']], note: 'r + a → ra' }
    ]
  }
];

const INTRO_FACTS = [
  {
    t: '韩文字是「拼」出来的，不是画出来的',
    d: '韩文 1443 年由世宗大王创制，是真正的表音文字：每个方块 = 一个音节，由 2~4 个基本字母拼成。字母只有 40 个（19 辅音 + 21 元音），比英语的拼读规则还规整——怎么写就怎么读，几乎没有例外。'
  },
  {
    t: '读法只有一个来源：字母的固定音值',
    d: '每个字母有一个固定读音。把方块里的字母音按「左→右、上→下」连起来，就是这个字的读音。比如 한 = ㅎ(h) + ㅏ(a) + ㄴ(n) → han。学会了 40 个字母，你见到任何韩文字都能读出来——哪怕不知道意思。'
  },
  {
    t: '方块的结构：辅音打头，元音靠边',
    d: '辅音在左边或上边，元音在右边或下边，收音（若有）压在最下面。竖着写的元音（ㅏ ㅓ ㅣ）辅音在左、元音在右；横着写的元音（ㅗ ㅜ ㅡ）辅音在上、元音在下。'
  },
  {
    t: '你会中文，已经赢了一半',
    d: '韩语约 60% 的词是汉字词：도서관 = 图书馆，회사 = 会社，보안 = 保安。看到这些词，意思基本能猜出来。剩下还有大量外来词（ 카메라 = camera）。你真正要下功夫的，是语法和助词——中文没有这套东西。'
  }
];

/* ---------- 字母的「音值示范」 ----------
   单个辅音不能独立成音节，系统 TTS 会把「ㄱ」读成字母名称「기역」（两个音节 + 收音），
   初学者会误以为那是发音。教学上统一在辅音后加一个轻读的 으，得到一个干净的单音节：
   ㄱ → 그、ㄴ → 느 …… 元音则直接读本音（ㅏ → 아）。 */
const LETTER_SOUND = {
  'ㅏ':'아', 'ㅑ':'야', 'ㅓ':'어', 'ㅕ':'여', 'ㅗ':'오', 'ㅛ':'요',
  'ㅜ':'우', 'ㅠ':'유', 'ㅡ':'으', 'ㅣ':'이', 'ㅐ':'애', 'ㅔ':'에',
  'ㅒ':'얘', 'ㅖ':'예', 'ㅘ':'와', 'ㅙ':'왜', 'ㅚ':'외', 'ㅝ':'워',
  'ㅞ':'웨', 'ㅟ':'위', 'ㅢ':'의',
  'ㄱ':'그', 'ㄴ':'느', 'ㄷ':'드', 'ㄹ':'르', 'ㅁ':'므', 'ㅂ':'브',
  'ㅅ':'스', 'ㅇ':'으', 'ㅈ':'즈', 'ㅊ':'츠', 'ㅋ':'크', 'ㅌ':'트',
  'ㅍ':'프', 'ㅎ':'흐', 'ㄲ':'끄', 'ㄸ':'뜨', 'ㅃ':'쁘', 'ㅆ':'쓰', 'ㅉ':'쯔'
};
