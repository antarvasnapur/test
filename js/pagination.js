/* ===== PAGINATION.JS ===== */

class Paginator {
  constructor(options) {
    this.container = document.getElementById(options.containerId);
    this.paginationEl = document.getElementById(options.paginationId);
    this.items = options.items || [];
    this.perPage = options.perPage || 10;
    this.currentPage = 1;
    this.renderFn = options.renderFn;
    this.onPageChange = options.onPageChange;
  }

  get totalPages() {
    return Math.ceil(this.items.length / this.perPage);
  }

  get currentItems() {
    const start = (this.currentPage - 1) * this.perPage;
    return this.items.slice(start, start + this.perPage);
  }

  setItems(items) {
    this.items = items;
    this.currentPage = 1;
    this.render();
  }

  goTo(page) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.render();
    if (this.container) {
      this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (this.onPageChange) this.onPageChange(page);
  }

  render() {
    if (this.container && this.renderFn) {
      this.container.innerHTML = this.currentItems.map(this.renderFn).join('');
    }
    this.renderPagination();
  }

  renderPagination() {
    if (!this.paginationEl || this.totalPages <= 1) {
      if (this.paginationEl) this.paginationEl.innerHTML = '';
      return;
    }
    const p = this.currentPage;
    const total = this.totalPages;
    let pages = [];
    const range = (from, to) => {
      for (let i = from; i <= to; i++) pages.push(i);
    };
    if (total <= 7) {
      range(1, total);
    } else {
      pages.push(1);
      if (p > 3) pages.push('...');
      const start = Math.max(2, p - 1);
      const end = Math.min(total - 1, p + 1);
      range(start, end);
      if (p < total - 2) pages.push('...');
      pages.push(total);
    }
    this.paginationEl.innerHTML = `
      <button class="page-btn" ${p === 1 ? 'disabled' : ''} data-page="${p - 1}">
        ← Prev
      </button>
      ${pages.map(pg => pg === '...'
        ? `<span class="page-btn" style="cursor:default">…</span>`
        : `<button class="page-btn ${pg === p ? 'active' : ''}" data-page="${pg}">${pg}</button>`
      ).join('')}
      <button class="page-btn" ${p === total ? 'disabled' : ''} data-page="${p + 1}">
        Next →
      </button>`;
    this.paginationEl.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const pg = parseInt(btn.dataset.page);
        if (!isNaN(pg)) this.goTo(pg);
      });
    });
  }
}

window.Paginator = Paginator;
