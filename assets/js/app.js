/* ===========================================================
   青廉筑梦 · 路由与视图
   =========================================================== */

const $ = sel => document.querySelector(sel);
const view = $('#view');

/* ---------------- 工具 ---------------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const byId = (arr, id) => arr.find(x => x.id === id);

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '') || 'home';
  const [path, query] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  const params = new URLSearchParams(query || '');
  return { route: parts[0] || 'home', id: parts[1] || null, params };
}

function setNav(route) {
  document.querySelectorAll('#nav a').forEach(a => {
    const r = a.getAttribute('href').replace('#/', '');
    a.classList.toggle('active', r === route || (route === 'article' && r === 'library'));
  });
  $('#nav').classList.remove('open');
}

/* ---------------- 首页 ---------------- */
function viewHome() {
  const featured = ['a1', 'a7', 'a4', 'a11'].map(id => byId(ARTICLES, id)).filter(Boolean);
  return `
  <section class="hero hero-a">
    <div class="wrap hero-a-inner">
      <div class="hero-copy">
        <div class="hero-eyebrow">中南大学 · 大学生创新创业训练计划</div>
        <h1>把廉洁，从<em>口号</em>变成<br>可以练习的选择</h1>
        <p class="hero-lead">四维九廉体系 · 12 篇专题 · 3 个可动手的情景 · ${KB.length} 条带出处的知识。你可以读，可以查，也可以在情景里做一次真实的选择。</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/scenario">做一次情景选择</a>
          <a class="btn btn-ghost" href="#/library">进入知识库</a>
          <a class="btn btn-ghost" href="#/ai">问问廉洁AI</a>
        </div>
      </div>
      <div class="hero-collage">
        <a href="#/article/a3" class="hc-tall"><img src="assets/img/wenchuang/bookmark-2.jpg" alt="书签 · 出淤泥而不染"></a>
        <a href="#/article/a3"><img src="assets/img/wenchuang/sticker-1.jpg" alt="廉洁主题贴纸"></a>
        <a href="#/article/a3"><img src="assets/img/wenchuang/postcard-1.jpg" alt="明信片 · 湘雅红楼"></a>
      </div>
    </div>
    <div class="wrap">
      <div class="hero-stats">
        <div><b>4</b><span>支撑维度</span></div>
        <div><b>9</b><span>九廉任务群</span></div>
        <div><b>${ARTICLES.length}</b><span>专题文章</span></div>
        <div><b>${KB.length}</b><span>知识条目</span></div>
      </div>
    </div>
  </section>

  <section class="section entry-sec">
    <div class="wrap">
      <div class="entry-grid">
        ${[
          ['书', '知识库', '12 篇专题，按四维九廉分类', '#/library'],
          ['人', '人物事迹', '8 位廉吏与时代楷模', '#/figures'],
          ['资', '学习资源', '政策、理论、50 本书单', '#/resources'],
          ['景', '情景实训', '3 个脚本，9 个决策点', '#/scenario'],
          ['法', '法规制度', '10 部制度要点', '#/rules'],
          ['问', '廉洁AI', `${KB.length} 条知识，带出处`, '#/ai']
        ].map(([ico, t, d, href]) => `
          <a class="entry" href="${href}">
            <span class="entry-ico">${ico}</span>
            <span class="entry-text"><b>${t}</b><em>${d}</em></span>
          </a>`).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow">四维</div>
        <h2>四个维度，一条认知曲线</h2>
        <p>从“知道”到“认同”再到“做到”，每一维承担不同的转化任务，不能互相替代。</p>
      </div>
      <div class="dim-row">
        ${DIMS.map(d => `
          <div class="dim-item">
            <div class="dim-no">${d.no}</div>
            <h3>${d.key}</h3>
            <p>${d.desc}</p>
          </div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap">
      <div class="section-head-row">
        <div class="section-head">
          <div class="eyebrow">九廉</div>
          <h2>九个任务群，覆盖全周期</h2>
          <p>每一项“廉”都要完成一次最小闭环：有载体、有责任人、有验收标准、有证据。</p>
        </div>
        <a class="link-more" href="#/library">查看全部文章 →</a>
      </div>
      <div class="jiu-grid">
        ${JIU.map(j => `
          <a class="jiu-card" href="#/article/${j.article}">
            <div class="jiu-no">${j.no}</div>
            <h3>${j.name}</h3>
            <p>${j.summary}</p>
            <div class="jiu-meta">
              <span class="tag">${j.dim}</span>
              <span>${j.period}</span>
            </div>
          </a>`).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head-row">
        <div class="section-head">
          <div class="eyebrow">精选</div>
          <h2>先读这四篇</h2>
          <p>如果只有十分钟，从这四篇开始：它能解释这套体系为什么这样设计。</p>
        </div>
      </div>
      <div class="card-grid two">
        ${featured.map(a => articleCard(a)).join('')}
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap">
      <div class="section-head-row">
        <div class="section-head">
          <div class="eyebrow">沉浸实践</div>
          <h2>三个情景，三种“近身”的风险</h2>
          <p>不动钱，动的是公正。每个情景都有一组必须作出的选择，选完才知道代价在哪里。</p>
        </div>
        <a class="link-more" href="#/scenario">全部情景 →</a>
      </div>
      <div class="sc-grid">
        ${SCENARIOS.map(s => `
          <a class="sc-card" href="#/scenario/${s.id}">
            <div class="sc-idx">${s.idx}</div>
            <h3>${s.title}</h3>
            <div class="sc-sub">${s.sub}</div>
            <p>${s.scene}</p>
            <div class="sc-tags">
              <span class="tag tag-zhu">${s.decisions.length} 个决策点</span>
              <span class="tag tag-ink">${s.roles.length} 个角色</span>
            </div>
          </a>`).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head-row">
        <div class="section-head">
          <div class="eyebrow">人物事迹</div>
          <h2>他们把廉洁活成了具体的样子</h2>
          <p>不是道德标本，而是在具体处境里做过具体选择的人。</p>
        </div>
        <a class="link-more" href="#/figures">全部人物 →</a>
      </div>
      <div class="fig-grid">
        ${FIGURES.slice(0, 4).map(f => `
          <a class="fig-card fig-card-h" href="#/figures">
            <div class="fc-img"><img src="${f.img}" alt="${f.name}" loading="lazy"></div>
            <div class="fc-body">
              <div class="fc-head">
                <div class="fig-seal">${f.seal}</div>
                <div>
                  <h3>${f.name}</h3>
                  <div class="fig-era">${f.era} · ${f.tag}</div>
                </div>
              </div>
              <p>${f.brief}</p>
            </div>
          </a>`).join('')}
      </div>
    </div>
  </section>

  <section class="section-tight" style="padding-bottom:76px">
    <div class="wrap">
      ${SITE.qrUrl ? `
      <div class="qr-band">
        <div class="qr-band-text">
          <div class="eyebrow">手机继续</div>
          <h2>扫码带走，随时再看</h2>
          <p>场馆里看不完，用手机扫一下就能继续。同一个网站，适配手机屏幕。</p>
          <div class="qr-url">${SITE.qrUrl.replace(/^https?:\/\//, '')}</div>
        </div>
        <div class="qr-band-img"><img src="${SITE.qrImg}" alt="扫码访问"></div>
      </div>` : ''}

      <div class="ai-banner">
        <div>
          <h2>廉洁AI：不生成，只检索</h2>
          <p>基于 ${KB.length} 条带出处的知识条目，回答你关于评优、科研、临床、法规的具体困惑。每一条答案都附来源，你可以自己核验。</p>
        </div>
        <a class="btn btn-primary" href="#/ai">开始提问</a>
      </div>
    </div>
  </section>`;
}

function articleCard(a) {
  return `
  <a class="a-card" href="#/article/${a.id}">
    <div class="a-top">
      <span class="tag">${a.dim}</span>
      ${a.jiu ? `<span class="tag tag-ink">${a.jiu}</span>` : ''}
    </div>
    <h3>${a.title}</h3>
    <p>${a.excerpt}</p>
    <div class="a-foot"><span>约 ${a.minutes} 分钟</span><span>阅读 →</span></div>
  </a>`;
}

/* ---------------- 知识库 ---------------- */
let libState = { dim: 'all', jiu: 'all' };

function viewLibrary(params) {
  if (params && params.get('dim')) libState.dim = params.get('dim');
  const dims = ['all', ...new Set(ARTICLES.map(a => a.dim))];
  const jius = ['all', ...new Set(ARTICLES.filter(a => a.jiu).map(a => a.jiu))];

  const list = ARTICLES.filter(a =>
    (libState.dim === 'all' || a.dim === libState.dim) &&
    (libState.jiu === 'all' || a.jiu === libState.jiu)
  );

  return `
  <section class="page-head">
    <div class="wrap">
      <div class="breadcrumb"><a href="#/home">首页</a> / 知识库</div>
      <h1>知识库</h1>
      <p>按“四维”与“九廉”组织的专题文章。每篇都对应一个具体做法，而不是抽象倡导。</p>
    </div>
  </section>
  <section class="section-tight">
    <div class="wrap">
      <div class="filters">
        <span class="fl-label">维度</span>
        ${dims.map(d => `<button class="chip ${libState.dim === d ? 'on' : ''}" data-dim="${d}">${d === 'all' ? '全部' : d}</button>`).join('')}
      </div>
      <div class="filters" style="margin-top:-16px">
        <span class="fl-label">九廉</span>
        ${jius.map(j => `<button class="chip ${libState.jiu === j ? 'on' : ''}" data-jiu="${j}">${j === 'all' ? '全部' : j}</button>`).join('')}
      </div>
      <div class="card-grid">
        ${list.length ? list.map(a => articleCard(a)).join('') : '<p class="muted">这个组合下还没有文章，换个筛选条件试试。</p>'}
      </div>
    </div>
  </section>`;
}

/* ---------------- 文章 ---------------- */
function viewArticle(id) {
  const a = byId(ARTICLES, id);
  if (!a) return notFound();
  const body = a.body.map(b => {
    if (b.t === 'h2') return `<h2>${b.c}</h2>`;
    if (b.t === 'h3') return `<h3>${b.c}</h3>`;
    if (b.t === 'p') return `<p>${b.c}</p>`;
    if (b.t === 'quote') return `<blockquote>${b.c}</blockquote>`;
    if (b.t === 'callout') return `<div class="callout">${b.c}</div>`;
    if (b.t === 'ul') return `<ul>${b.c.map(li => `<li>${li}</li>`).join('')}</ul>`;
    if (b.t === 'ol') return `<ol>${b.c.map(li => `<li>${li}</li>`).join('')}</ol>`;
    if (b.t === 'img') return `<figure class="prose-img"><img src="${b.src}" alt="${esc(b.cap || '')}" loading="lazy">${b.cap ? `<figcaption>${b.cap}</figcaption>` : ''}</figure>`;
    return '';
  }).join('');

  const related = ARTICLES.filter(x => x.id !== a.id && (x.dim === a.dim || x.jiu === a.jiu)).slice(0, 3);

  return `
  <article>
    <header class="article-hero">
      <div class="wrap">
        <div class="breadcrumb"><a href="#/home">首页</a> / <a href="#/library">知识库</a> / ${esc(a.title)}</div>
        <div class="a-top" style="margin-bottom:16px">
          <span class="tag">${a.dim}</span>
          ${a.jiu ? `<span class="tag tag-ink">${a.jiu}</span>` : ''}
        </div>
        <h1>${a.title}</h1>
        <div class="article-meta">
          <span>约 ${a.minutes} 分钟</span>
          <span>　</span>
          <span>${a.source}</span>
        </div>
      </div>
    </header>
    <div class="wrap">
      <div class="prose">${body}</div>
    </div>
    ${related.length ? `
    <section class="section section-alt">
      <div class="wrap">
        <div class="section-head"><div class="eyebrow">继续阅读</div><h2>同维度文章</h2></div>
        <div class="card-grid">${related.map(articleCard).join('')}</div>
      </div>
    </section>` : ''}
  </article>`;
}

/* ---------------- 人物 ---------------- */
function viewFigures() {
  return `
  <section class="page-head">
    <div class="wrap">
      <div class="breadcrumb"><a href="#/home">首页</a> / 人物事迹</div>
      <h1>人物事迹</h1>
      <p>从古代廉吏到时代楷模，从湘雅先贤到当代青年。选人的标准不是“完美”，而是在具体处境里做过具体选择。</p>
    </div>
  </section>
  <section class="section-tight">
    <div class="wrap">
      <div class="card-grid two">
        ${FIGURES.map(f => `
          <div class="fig-card fig-card-v">
            <div class="fc-img"><img src="${f.img}" alt="${f.name}" loading="lazy"></div>
            <div class="fc-body">
              <div class="fc-head">
                <div class="fig-seal">${f.seal}</div>
                <div>
                  <h3>${f.name}</h3>
                  <div class="fig-era">${f.era} · ${f.tag}</div>
                </div>
              </div>
              <p>${f.brief}</p>
              ${f.body.map(p => `<p class="fc-p">${p}</p>`).join('')}
              <div class="callout fc-lesson"><strong>给我们的启示：</strong>${f.lesson}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

/* ---------------- 学习资源 ---------------- */
function viewResources() {
  return `
  <section class="page-head">
    <div class="wrap">
      <div class="breadcrumb"><a href="#/home">首页</a> / 学习资源</div>
      <h1>学习资源</h1>
      <p>政策依据、理论框架、传统文化、红色文化、文学作品、警示案例、实践模式，以及 50 本推荐书目。
         内容整理自项目组《廉洁教育 AI 训练资料》，供主题班会、读书会与课题调研取用。</p>
    </div>
  </section>
  <section class="section-tight">
    <div class="wrap res-wrap">
      ${RESOURCES.map(sec => `
        <section class="res-sec">
          <div class="res-head">
            <span class="res-no">${sec.no}</span>
            <div>
              <h2>${sec.title}</h2>
              <p>${sec.lead}</p>
            </div>
          </div>
          <div class="res-list">
            ${sec.items.map(it => `
              <article class="res-item">
                <h3>${it.t}</h3>
                <div class="res-meta">${it.m}</div>
                <p>${it.d}</p>
              </article>`).join('')}
          </div>
        </section>`).join('')}

      <section class="res-sec">
        <div class="res-head">
          <span class="res-no">八</span>
          <div>
            <h2>推荐书目 50 本</h2>
            <p>分六类：理论读本、家风家训、纪实警示、长篇小说、人物传记、历史文化通俗读物。</p>
          </div>
        </div>
        <div class="book-grid">
          ${BOOKS.map(b => `
            <div class="book-col">
              <h4>${b.cat}</h4>
              <ol>${b.items.map(i => `<li>${i}</li>`).join('')}</ol>
            </div>`).join('')}
        </div>
      </section>

      <p class="muted small" style="margin-top:32px;line-height:1.9">
        说明：以上内容整理自项目组内部《廉洁教育 AI 训练资料》，用于教学与研究参考。
        涉及具体条文与案例的，请以官方发布文本和正式通报为准。
      </p>
    </div>
  </section>`;
}

/* ---------------- 情景实训 ---------------- */
function viewScenarioList() {
  return `
  <section class="page-head">
    <div class="wrap">
      <div class="breadcrumb"><a href="#/home">首页</a> / 情景实训</div>
      <h1>情景实训</h1>
      <p>三个脚本取自真实工作场景：学生干部的资源分配、科研实验的数据取舍、临床实习的利益冲突。每个情景有三个决策点，选完会看到直接后果与深层影响。</p>
    </div>
  </section>
  <section class="section-tight">
    <div class="wrap">
      <div class="sc-grid">
        ${SCENARIOS.map(s => `
          <a class="sc-card" href="#/scenario/${s.id}">
            <div class="sc-img"><img src="${s.img}" alt="${s.title}" loading="lazy"></div>
            <div class="sc-body">
            <div class="sc-idx">${s.idx}</div>
            <h3>${s.title}</h3>
            <div class="sc-sub">${s.sub}</div>
            <p>${s.scene}</p>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <span class="tag tag-zhu">${s.decisions.length} 个决策点</span>
              <span class="tag tag-ink">${s.roles.length} 个角色</span>
            </div>
            </div>
          </a>`).join('')}
      </div>

      <div class="sc-note">
        <strong>怎么用：</strong>不要急着选“正确选项”。先读角色卡与信息差，把自己放进角色的位置，再选。选完之后问自己：我选的理由，能不能在规则里找到依据？
      </div>
    </div>
  </section>`;
}

function viewScenario(id) {
  const s = byId(SCENARIOS, id);
  if (!s) return notFound();
  return `
  <section class="page-head">
    <div class="wrap">
      <div class="breadcrumb"><a href="#/home">首页</a> / <a href="#/scenario">情景实训</a> / ${s.title}</div>
      <h1>${s.title}</h1>
      <p>${s.sub}</p>
    </div>
  </section>
  <section class="section-tight">
    <div class="wrap">
      <div class="sc-present">
        <div class="sc-hero"><img src="${s.img}" alt="${s.title}" loading="lazy"></div>
        <div class="sc-brief">
          <h2>情景背景</h2>
          <p>${s.scene}</p>
          <h2 style="margin-top:24px">角色与信息差</h2>
          <div class="sc-role-table">
            ${s.roles.map(r => `<div class="sc-role"><b>${r.n}<span style="font-weight:400;color:var(--muted-2);font-size:12px"> · ${r.p}</span></b><span>${r.v}</span></div>`).join('')}
          </div>
          <ul style="font-size:14px;color:#3b4a57;margin:18px 0 0;padding-left:1.2em">
            ${s.info.map(i => `<li style="margin-bottom:6px">${i}</li>`).join('')}
          </ul>
        </div>

        <div class="progress-line" id="scProgress">
          ${s.decisions.map(() => '<i></i>').join('')}
        </div>

        ${s.decisions.map((d, i) => `
          <div class="decision" data-decision="${i}">
            <div class="d-no">${d.no}</div>
            <h3>${d.title}</h3>
            <p style="font-size:14.5px;color:#3b4a57">${d.q}</p>
            <div class="opt-list">
              ${d.options.map((o, oi) => `<button class="opt" data-d="${i}" data-o="${oi}">${o.t}</button>`).join('')}
            </div>
            <div class="opt-res" id="res-${i}" hidden></div>
          </div>`).join('')}

        <div class="sc-result" id="scResult">已完成 0 / ${s.decisions.length} 个决策点。全部选完后，这里会给出你的选择画像。</div>

        <div class="sc-brief" style="margin-top:28px">
          <h2>规则依据</h2>
          <ul style="font-size:14px;color:#3b4a57;padding-left:1.2em;margin:10px 0 0">
            ${s.rules.map(r => `<li style="margin-bottom:8px">${r}</li>`).join('')}
          </ul>
          <h2 style="margin-top:26px">复盘问题</h2>
          <ol style="font-size:14px;color:#3b4a57;padding-left:1.4em;margin:10px 0 0">
            ${s.questions.map(q => `<li style="margin-bottom:8px">${q}</li>`).join('')}
          </ol>
        </div>
      </div>
    </div>
  </section>`;
}

function bindScenario(s) {
  const done = new Set();
  const picks = [];
  document.querySelectorAll('.decision').forEach(box => {
    box.querySelectorAll('.opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const di = +btn.dataset.d, oi = +btn.dataset.o;
        box.querySelectorAll('.opt').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        const o = s.decisions[di].options[oi];
        const res = document.getElementById('res-' + di);
        res.hidden = false;
        res.style.borderLeftColor = o.level === 'good' ? '#0f6b5f' : o.level === 'mid' ? '#a8873f' : '#a8322d';
        res.innerHTML = `<b>${o.level === 'good' ? '这条路径守住了边界：' : o.level === 'mid' ? '这条路径没有越界，但也没有解决：' : '这条路径越界了：'}</b>${o.r}`;
        done.add(di); picks[di] = o.level;
        const bars = document.querySelectorAll('#scProgress i');
        bars.forEach((b, i) => b.classList.toggle('on', done.has(i)));
        const total = s.decisions.length;
        const out = document.getElementById('scResult');
        if (done.size === total) {
          const g = picks.filter(x => x === 'good').length;
          const b2 = picks.filter(x => x === 'bad').length;
          let verdict = b2 === 0 && g === total ? '你三次都守住了边界，但在现实中，这通常意味着要承受人际压力与短期损失——这正是廉洁教育要提前演练的部分。'
            : b2 >= 2 ? '你有两次越界。注意这不是道德审判：实训数据显示，多数人在压力下的第一反应并不理想。重要的是看清“从帮忙到共谋”的那一步有多近。'
            : '你的选择处在中间地带——既没有明确越界，也没有真正解决问题。好人主义与含糊其辞，往往是廉洁风险最隐蔽的入口。';
          out.innerHTML = `<strong>选择画像：</strong>守住边界 ${g} 次 · 中间路径 ${total - g - b2} 次 · 越界 ${b2} 次。<br><br>${verdict}<br><br><span style="color:var(--muted-2);font-size:13px">建议回到上方“规则依据”与“复盘问题”，看看你的每个选择能不能找到条文支撑。</span>`;
        } else {
          out.textContent = `已完成 ${done.size} / ${total} 个决策点。全部选完后，这里会给出你的选择画像。`;
        }
      });
    });
  });
}

/* ---------------- 法规 ---------------- */
function viewRules() {
  return `
  <section class="page-head">
    <div class="wrap">
      <div class="breadcrumb"><a href="#/home">首页</a> / 法规制度</div>
      <h1>法规制度</h1>
      <p>廉洁教育不能只讲“应该”，还要讲“依据”。这里是项目涉及的主要制度文本要点。条文以官方最新发布文本为准。</p>
    </div>
  </section>
  <section class="section-tight">
    <div class="wrap" style="max-width:900px">
      ${RULES.map((r, i) => `
        <div class="rule-item ${i === 0 ? 'open' : ''}">
          <button class="rule-head">
            <span class="r-idx">${String(i + 1).padStart(2, '0')}</span>
            <span>${r.name}</span>
            <span class="tag tag-ink" style="margin-left:12px">${r.tag}</span>
            <span class="r-arrow">▾</span>
          </button>
          <div class="rule-body">
            <div style="margin-bottom:12px;color:var(--muted);font-size:13px">适用对象：${r.scope}</div>
            <ul>${r.points.map(p => `<li>${p}</li>`).join('')}</ul>
            <div style="margin-top:14px;padding:12px 16px;background:var(--paper-2);border-radius:8px;font-size:13px;color:var(--muted)">
              ${r.note}
            </div>
          </div>
        </div>`).join('')}
      <p class="muted small" style="margin-top:36px">提示：本站法规条目为学习摘要，不构成法律意见。引用时请核对官方原文。</p>
    </div>
  </section>`;
}

function bindRules() {
  document.querySelectorAll('.rule-head').forEach(h => {
    h.addEventListener('click', () => h.parentElement.classList.toggle('open'));
  });
}

/* ---------------- 廉洁AI ---------------- */
function viewAI() {
  const sugs = ['什么是微腐败', '评优时室友是候选人怎么办', '实验数据异常值能不能删', '患者家属送红包怎么拒绝', '九项准则包含什么', '首轮实训结果如何'];
  return `
  <section class="page-head">
    <div class="wrap">
      <div class="breadcrumb"><a href="#/home">首页</a> / 廉洁AI</div>
      <h1>廉洁AI</h1>
      <p>基于 ${KB.length} 条知识条目的检索式问答。它不生成新内容，只把最相关的条目连同出处一起给你——因为在这个领域，“说得漂亮”远不如“可被核查”重要。</p>
    </div>
  </section>
  <section>
    <div class="wrap ai-shell">
      <div class="chat">
        <div class="chat-head">
          <span class="chat-dot"></span>
          <b>廉洁AI · 检索式</b>
          <span>知识库 v1.0 · ${KB.length} 条</span>
        </div>
        <div class="chat-log" id="chatLog">
          <div class="msg bot">
            <div class="avatar">廉</div>
            <div class="bubble">
              你好。我可以回答关于评优、学术诚信、临床红包、法规制度、九廉做法的问题。<br>
              每条回答都会告诉你依据哪一条知识——你可以点开核对。
            </div>
          </div>
        </div>
        <form class="chat-input" id="chatForm">
          <input id="chatInput" placeholder="输入你的问题，例如：评优时室友是候选人怎么办" autocomplete="off">
          <button type="submit">发送</button>
        </form>
      </div>
      <aside class="ai-side">
        <div class="panel">
          <h4>试试这些问题</h4>
          <div class="sug" id="sugList">
            ${sugs.map(s => `<button data-q="${s}">${s}</button>`).join('')}
          </div>
        </div>
        <div class="panel">
          <h4>它是怎么工作的</h4>
          <p class="disclaimer">把你的问题切成关键词，在知识库中做加权匹配（标签权重最高），返回最相关的一到两条，并附出处链接。<br><br>没有匹配到时会明确告诉你“没找到”，而不是编一个答案。</p>
        </div>
        <div class="panel">
          <h4>边界声明</h4>
          <p class="disclaimer">本工具为教育辅助，不替代专业判断与法律咨询。法规条文以官方文本为准。</p>
        </div>
      </aside>
    </div>
  </section>`;
}

function bindAI() {
  const form = $('#chatForm');
  const input = $('#chatInput');
  const log = $('#chatLog');
  if (!form) return;

  const push = (role, html) => {
    const el = document.createElement('div');
    el.className = 'msg ' + role;
    el.innerHTML = `<div class="avatar">${role === 'bot' ? '廉' : '我'}</div><div class="bubble">${html}</div>`;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  };

  const ask = q => {
    if (!q.trim()) return;
    push('user', esc(q));
    const res = AI.answer(q);
    setTimeout(() => {
      if (!res) { push('bot', '请输入一个问题。'); return; }
      push('bot', res.html);
    }, 260);
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    ask(input.value);
    input.value = '';
  });

  document.querySelectorAll('#sugList button').forEach(b => {
    b.addEventListener('click', () => ask(b.dataset.q));
  });
}

/* ---------------- 关于 ---------------- */
function viewAbout() {
  return `
  <section class="page-head">
    <div class="wrap">
      <div class="breadcrumb"><a href="#/home">首页</a> / 关于项目</div>
      <h1>关于“青廉筑梦”</h1>
      <p>基于廉洁教育馆的大学生廉洁品格全周期涵养体系构建与实践。执行周期 ${SITE.term}，由学生团队独立推进。</p>
    </div>
  </section>
  <section>
    <div class="wrap about-grid">
      <div>
        <h2 style="font-size:22px;margin-bottom:16px">项目要解决什么</h2>
        <p style="color:#3b4a57">廉洁教育常见的问题是“三多三少”：宣讲多、体验少；知识多、判断少；活动多、证据少。学生能背出“不能收红包”，却说不清依据哪一条；能在台上表态，却在真实的两难里犹豫。</p>
        <p style="color:#3b4a57">本项目以廉洁教育馆为枢纽，用四个维度支撑九项任务群，把每一“廉”做成一次最小闭环：有载体、有责任人、有验收标准、有证据。重点不是活动数量，而是可复用的教育产品与有证据的育人成效。</p>
        <p style="color:#3b4a57">网站是项目的数字出口之一：它把课程、人物、制度与情景训练集中到一个可检索的入口，也是“数字科技助廉”这一廉的公开成果。</p>

        <h2 style="font-size:22px;margin:32px 0 16px">四维怎么分工</h2>
        <div class="timeline">
          ${DIMS.map(d => `<div class="tl-item"><b>${d.key}</b><span>${d.jiu.join(' · ')}</span></div>`).join('')}
        </div>
      </div>
      <div>
        <h2 style="font-size:22px;margin-bottom:16px">执行节奏</h2>
        <div class="timeline">
          <div class="tl-item"><b>基础重整期 · 2026.8</b><span>九廉任务书、活动 SOP、场馆路线、测评工具</span></div>
          <div class="tl-item"><b>集中试点期 · 2026.9—10</b><span>研学、讲堂、文创、数字原型、读书、宣誓首轮试点</span></div>
          <div class="tl-item"><b>全线贯通期 · 2026.11—12</b><span>补齐社会实践与情景实训，完成中期材料</span></div>
          <div class="tl-item"><b>迭代拓展期 · 2026.12—2027.2</b><span>修订课程与产品，第二轮重点模块与校外协同</span></div>
          <div class="tl-item"><b>结题凝练期 · 2027.3</b><span>数据复核、模式总结、结题答辩</span></div>
        </div>

        <h2 style="font-size:22px;margin:32px 0 16px">团队</h2>
        <div class="team-list">
          <div class="team-item"><b>孔志强</b><span>指导教师 · 政治方向与学术审核</span></div>
          <div class="team-item"><b>苏重天</b><span>项目负责人 · 场馆研学、社会实践</span></div>
          <div class="team-item"><b>余伯俊</b><span>内容与活动设计 · 讲堂、情景实训</span></div>
          <div class="team-item"><b>孟泽通</b><span>数据与数字产品 · 测评、廉洁AI</span></div>
          <div class="team-item"><b>洪雨蝶</b><span>视觉与传播 · 文创、光影</span></div>
          <div class="team-item"><b>陈承鑫</b><span>物资经费与合规 · 承诺宣誓</span></div>
        </div>

        <div class="callout" style="margin-top:28px;font-size:13.5px">
          <strong>内容声明：</strong>文章与情景脚本来自项目组《学生执行计划（四维九廉任务版）》与《情景实训悟廉 实施材料汇编》；人物事迹、法规条目取自公开资料，仅用于教学。法规以官方最新文本为准。
        </div>
      </div>
    </div>
  </section>`;
}

function notFound() {
  return `<section class="section"><div class="wrap" style="text-align:center;padding:80px 0">
    <h1 style="font-size:64px;color:var(--paper-3)">404</h1>
    <p class="muted">这个页面不存在，或者链接已经失效。</p>
    <a class="btn btn-line" href="#/home">回到首页</a>
  </div></section>`;
}

/* ---------------- 搜索 ---------------- */
function buildIndex() {
  const idx = [];
  ARTICLES.forEach(a => idx.push({ t: a.title, s: a.excerpt, href: '#/article/' + a.id, k: '文章 · ' + a.dim }));
  FIGURES.forEach(f => idx.push({ t: f.name, s: f.brief, href: '#/figures', k: '人物 · ' + f.tag }));
  RULES.forEach(r => idx.push({ t: r.name, s: r.points[0], href: '#/rules', k: '制度 · ' + r.tag }));
  SCENARIOS.forEach(s => idx.push({ t: s.title, s: s.sub, href: '#/scenario/' + s.id, k: '情景 · 实训' }));
  RESOURCES.forEach(r => r.items.forEach(i => idx.push({ t: i.t, s: i.d.slice(0, 60), href: '#/resources', k: '资源 · ' + r.title })));
  BOOKS.forEach(b => idx.push({ t: b.cat, s: b.items.slice(0, 3).join('、'), href: '#/resources', k: '书目' }));
  KB.forEach(k => idx.push({ t: k.q, s: k.a.slice(0, 60), href: k.link || '#/ai', k: '知识 · AI' }));
  return idx;
}
const SEARCH_INDEX = buildIndex();

function doSearch(q) {
  const box = $('#searchResults');
  const kw = q.trim().toLowerCase();
  if (!kw) { box.innerHTML = '<div class="sr-empty">输入关键词，搜索文章、人物、制度与情景</div>'; return; }
  const hits = SEARCH_INDEX.filter(i => (i.t + i.s + i.k).toLowerCase().includes(kw)).slice(0, 12);
  if (!hits.length) { box.innerHTML = '<div class="sr-empty">没有找到匹配内容，试试“红包”“评优”“数据”</div>'; return; }
  box.innerHTML = hits.map(h => `<a class="sr-item" href="${h.href}"><b>${h.t}</b><span>${h.k} · ${h.s}</span></a>`).join('');
}

function openSearch() {
  $('#searchOverlay').hidden = false;
  $('#searchInput').value = '';
  doSearch('');
  setTimeout(() => $('#searchInput').focus(), 30);
}
function closeSearch() { $('#searchOverlay').hidden = true; }

/* ---------------- 路由 ---------------- */
function render() {
  const { route, id, params } = parseHash();
  setNav(route);
  window.scrollTo({ top: 0, behavior: 'instant' });

  if (route === 'home') view.innerHTML = viewHome();
  else if (route === 'library') { view.innerHTML = viewLibrary(params); bindLibrary(); }
  else if (route === 'article') view.innerHTML = viewArticle(id);
  else if (route === 'figures') view.innerHTML = viewFigures();
  else if (route === 'resources') view.innerHTML = viewResources();
  else if (route === 'scenario') {
    if (id) { view.innerHTML = viewScenario(id); const s = byId(SCENARIOS, id); if (s) bindScenario(s); }
    else view.innerHTML = viewScenarioList();
  }
  else if (route === 'rules') { view.innerHTML = viewRules(); bindRules(); }
  else if (route === 'ai') { view.innerHTML = viewAI(); bindAI(); }
  else if (route === 'about') view.innerHTML = viewAbout();
  else view.innerHTML = notFound();

  document.title = (route === 'home' ? '青廉筑梦 · 廉洁知识导航' :
    { library: '知识库', figures: '人物事迹', resources: '学习资源', scenario: '情景实训', rules: '法规制度', ai: '廉洁AI', about: '关于项目', article: '文章' }[route] || '页面')
    + ' · 青廉筑梦';
}

function bindLibrary() {
  document.querySelectorAll('[data-dim]').forEach(b => b.addEventListener('click', () => {
    libState.dim = b.dataset.dim; libState.jiu = 'all';
    view.innerHTML = viewLibrary(); bindLibrary();
  }));
  document.querySelectorAll('[data-jiu]').forEach(b => b.addEventListener('click', () => {
    libState.jiu = b.dataset.jiu;
    view.innerHTML = viewLibrary(); bindLibrary();
  }));
}

/* ---------------- 启动 ---------------- */
window.addEventListener('hashchange', render);
window.addEventListener('scroll', () => {
  $('#header').classList.toggle('scrolled', window.scrollY > 8);
});
$('#searchBtn').addEventListener('click', openSearch);
$('#menuBtn').addEventListener('click', () => $('#nav').classList.toggle('open'));
$('#searchOverlay').addEventListener('click', e => { if (e.target.id === 'searchOverlay') closeSearch(); });
$('#searchInput').addEventListener('input', e => doSearch(e.target.value));
$('#searchResults').addEventListener('click', () => closeSearch());
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if (e.key === '/' && document.activeElement !== $('#searchInput')) { e.preventDefault(); openSearch(); }
});

render();

/* ===========================================================
   导览机模式（kiosk）
   启用方式：index.html?kiosk=1
   =========================================================== */
const KIOSK = new URLSearchParams(location.search).has('kiosk');

function initKiosk() {
  document.body.classList.add('kiosk');
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());

  const attract = document.createElement('div');
  attract.className = 'attract';
  attract.innerHTML = `
    <div class="attract-inner">
      <div class="attract-seal">廉</div>
      <h1>青廉筑梦 · 廉洁知识导航</h1>
      <p class="attract-sub">四维九廉 · 人物事迹 · 情景实训 · 法规制度 · 廉洁AI</p>
      <div class="attract-cta">轻触屏幕，开始参观</div>
      <div class="attract-foot">中南大学 · 大学生创新创业训练计划项目</div>
    </div>
    ${SITE.qrUrl ? `<div class="attract-qr"><img src="${SITE.qrImg}" alt="扫码访问"><span>手机上继续看<br>扫码打开</span></div>` : ''}`;
  document.body.appendChild(attract);

  let idleTimer = null;
  const IDLE_MS = 150000; // 150 秒无操作，回到欢迎页

  function showAttract() {
    attract.classList.add('show');
    location.hash = '#/home';
    window.scrollTo(0, 0);
  }
  function hideAttract() {
    attract.classList.remove('show');
    armIdle();
  }
  function armIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(showAttract, IDLE_MS);
  }

  attract.addEventListener('pointerdown', e => { e.preventDefault(); hideAttract(); });
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(ev =>
    document.addEventListener(ev, () => { if (!attract.classList.contains('show')) armIdle(); }, { passive: true })
  );

  // 隐藏出口：左上角 72px 内 3 秒连点 5 次 → 输入管理密码
  let taps = [];
  document.addEventListener('pointerdown', e => {
    if (e.clientX < 72 && e.clientY < 72) {
      const now = Date.now();
      taps = taps.filter(t => now - t < 3000).concat(now);
      if (taps.length >= 5) {
        taps = [];
        const code = prompt('请输入管理密码：');
        if (code === '2026') {
          clearTimeout(idleTimer);
          alert('导览已退出。维护完成后，重新运行「启动导览.bat」即可恢复。');
          window.close();
        }
      }
    }
  });

  showAttract();
}

if (KIOSK) initKiosk();
