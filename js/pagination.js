// pagination.js — Generic client-side pagination

function createPagination(items, perPage, renderFn, containerId, paginationId) {
  const container = document.getElementById(containerId);
  const paginationEl = document.getElementById(paginationId);
  if (!container) return;

  let currentPage = 1;
  const totalPages = Math.ceil(items.length / perPage);

  function render() {
    const start = (currentPage - 1) * perPage;
    const slice = items.slice(start, start + perPage);
    container.innerHTML = slice.map(renderFn).join('');
    renderPagination();
    window.scrollTo({ top: container.offsetTop - 80, behavior: 'smooth' });
  }

  function renderPagination() {
    if (!paginationEl || totalPages <= 1) return;
    let html = '';

    html += `<button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹ पिछला</button>`;

    const range = getPageRange(currentPage, totalPages);
    range.forEach(p => {
      if (p === '...') {
        html += `<span class="page-btn" style="cursor:default;color:var(--text-light)">…</span>`;
      } else {
        html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="changePage(${p})">${p}</button>`;
      }
    });

    html += `<button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>अगला ›</button>`;
    paginationEl.innerHTML = html;
  }

  function getPageRange(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const range = [1];
    if (current > 3) range.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) range.push(i);
    if (current < total - 2) range.push('...');
    range.push(total);
    return range;
  }

  window.changePage = function (page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    render();
  };

  render();
}

window.createPagination = createPagination;
