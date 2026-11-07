/* ===========================================================
   廉洁AI · 检索式问答（第一阶段）
   不生成新内容，只在知识库中检索最相关条目并给出出处。
   =========================================================== */

const AI = (() => {
  const STOP = new Set(['的','了','是','吗','呢','吧','啊','我','你','他','她','它','我们','你们','什么','怎么','如何','为什么','请问','一下','可以','能否','告诉','哪些','哪个','这个','那个','以及','还有','关于','有没有','是不是','应该','需要']);
  const PUNCT = /[\s，。！？、；：“”‘’（）《》【】·…—,.!?;:"'()\[\]<>\/\\|`~@#$%^&*+=_]+/g;

  function tokenize(text) {
    const s = String(text).toLowerCase().replace(PUNCT, ' ').trim();
    const tokens = new Set();
    // 拉丁词 / 数字
    (s.match(/[a-z0-9_]{2,}/g) || []).forEach(w => tokens.add(w));
    // 中文：单字 + 二元组（去掉停用词与纯停用组合）
    const cjk = s.match(/[\u4e00-\u9fa5]+/g) || [];
    for (const seg of cjk) {
      for (let i = 0; i < seg.length; i++) {
        if (!STOP.has(seg[i])) tokens.add(seg[i]);
        if (i + 1 < seg.length) {
          const bi = seg.slice(i, i + 2);
          if (!(STOP.has(seg[i]) && STOP.has(seg[i + 1]))) tokens.add(bi);
        }
        if (i + 2 < seg.length) tokens.add(seg.slice(i, i + 3));
      }
    }
    return [...tokens].filter(t => !STOP.has(t));
  }

  function score(queryTokens, entry) {
    const tags = entry.tags || [];
    const qText = entry.q || '';
    const aText = entry.a || '';
    let s = 0;
    for (const t of queryTokens) {
      if (tags.some(tag => tag.includes(t) || t.includes(tag))) s += 6;
      if (qText.includes(t)) s += 3;
      if (aText.includes(t)) s += 1.2;
    }
    // 长度归一，避免长条目通吃
    return s / Math.sqrt(1 + queryTokens.length * 0.15);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function renderAnswer(entry, scoreValue) {
    const link = entry.link
      ? `<a href="${entry.link}">${entry.link.includes('scenario') ? '进入情景实训' : entry.link.includes('figures') ? '查看人物事迹' : entry.link.includes('rules') ? '查看法规制度' : entry.link.includes('about') ? '了解项目' : '阅读原文'} →</a>`
      : '';
    const conf = scoreValue > 26 ? '高' : scoreValue > 14 ? '中' : '低';
    return `
      <div>${escapeHtml(entry.a)}</div>
      <div class="cite">依据：知识库条目「${escapeHtml(entry.q)}」 · 匹配度${conf}${link ? ' · ' + link : ''}</div>`;
  }

  function answer(query) {
    const q = String(query || '').trim();
    if (!q) return null;

    // 轻量意图
    if (/^(你好|您好|hi|hello|在吗)/i.test(q)) {
      return { html: '你好。我是廉洁AI，一个基于项目知识库的检索式问答助手。<br>你可以问我：什么是微腐败、评优时室友是候选人怎么办、实验数据异常值能不能删、患者送红包怎么拒绝。' };
    }
    if (/(你是谁|你是什么|介绍一下自己|你能做什么)/.test(q)) {
      return { html: '我是“青廉筑梦”项目的第一阶段数字产品：<b>检索式知识问答</b>。我不生成新内容，只在 47 条知识条目中检索最相关的答案，并给出出处链接。<br>这样做的原因是：廉洁领域容错率低，能追溯比“说得漂亮”更重要。' };
    }
    if (/^(谢谢|感谢|多谢|thanks)/i.test(q)) {
      return { html: '不客气。如果答案不合适，可以换一种问法，或者到<a href="#/library">知识库</a>按维度浏览。' };
    }

    const tokens = tokenize(q);
    if (!tokens.length) return { html: '我没有识别到有效关键词，换个说法试试？例如：“评优时室友是候选人怎么办”。' };

    const ranked = KB
      .map(e => ({ e, s: score(tokens, e) }))
      .sort((a, b) => b.s - a.s);

    const best = ranked[0];
    if (!best || best.s < 5) {
      return {
        html: '这个问题我暂时没有找到足够匹配的条目。你可以试试这些问法：<br>· 评优时室友是候选人怎么办<br>· 实验数据异常值能不能删<br>· 患者家属送红包怎么拒绝<br>· 什么是四维九廉',
        weak: true
      };
    }

    const second = ranked[1];
    let html = renderAnswer(best.e, best.s);
    if (second && second.s > best.s * 0.72 && second.s > 8) {
      html += `<div class="cite">相关条目：「${escapeHtml(second.e.q)}」${second.e.link ? ` · <a href="${second.e.link}">查看</a>` : ''}</div>`;
    }
    return { html };
  }

  return { answer, tokenize };
})();
