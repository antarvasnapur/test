/* ============================================================
   pagination.js — self-contained, no inline onclick
   Uses data-page attributes + event delegation.
   Works regardless of variable names or page depth.
   ============================================================ */
'use strict';

class Paginator {
  constructor({ containerId, paginationId, items = [], perPage = 10, renderFn }) {
    this.containerId  = containerId;
    this.paginationId = paginationId;
    this.items        = items;
    this.perPage      = perPage;
    this.renderFn     = renderFn;
    this.page         = 1;
    this._bindEvents();
  }

  _bindEvents() {
    const handler = (e) => {
      const btn = e.target.closest('[data-paginator-id]');
      if (!btn) return;
      if (btn.dataset.paginatorId !== this.paginationId) return;
      const target = parseInt(btn.dataset.page, 10);
      if (isNaN(target) || target < 1) return;
      const total = Math.ceil(this.items.length / this.perPage);
      if (target > total) return;
      this.page = target;
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => document.addEventListener('click', handler));
    } else {
      document.addEventListener('click', handler);
    }
  }

  setItems(items) { this.items = items; this.page = 1; this.render(); }

  goTo(p) {
    const total = Math.ceil(this.items.length / this.perPage);
    this.page = Math.max(1, Math.min(p, total));
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    const el = document.getElementById(this.containerId);
    if (!el) return;
    const start = (this.page - 1) * this.perPage;
    const slice = this.items.slice(start, start + this.perPage);
    el.innerHTML = slice.length
      ? slice.map(this.renderFn).join('')
      : '<div class="empty-state"><div class="empty-state-icon">📭</div><h3>No stories found</h3><p style="color:var(--text-m);font-size:.9rem">Try a different filter.</p></div>';
    this._renderPagination();
  }

  _renderPagination() {
    const el = document.getElementById(this.paginationId);
    if (!el) return;
    const total = Math.ceil(this.items.length / this.perPage);
    if (total <= 1) { el.innerHTML = ''; return; }

    const pid = this.paginationId;
    const cur = this.page;

    const show = new Set([1, total]);
    for (let i = Math.max(1, cur - 1); i <= Math.min(total, cur + 1); i++) show.add(i);
    const sorted = [...show].sort((a, b) => a - b);

    let html = '<div class="pagination-inner">';
    html += `<button class="page-btn" data-paginator-id="${pid}" data-page="${cur - 1}" ${cur === 1 ? 'disabled' : ''} aria-label="Previous">‹</button>`;

    let prev = 0;
    for (const n of sorted) {
      if (n - prev > 1) html += '<span class="page-ellipsis">…</span>';
      html += `<button class="page-btn${n === cur ? ' active' : ''}" data-paginator-id="${pid}" data-page="${n}" ${n === cur ? 'aria-current="page"' : ''}>${n}</button>`;
      prev = n;
    }

    html += `<button class="page-btn" data-paginator-id="${pid}" data-page="${cur + 1}" ${cur === total ? 'disabled' : ''} aria-label="Next">›</button>`;
    html += '</div>';
    el.innerHTML = html;
  }
}

window.Paginator = Paginator;
