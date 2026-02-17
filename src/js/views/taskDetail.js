// ===== TASK DETAIL VIEW =====
// Single task view with PDFs and documents.

const TaskDetailView = (() => {

  const template = `
    <button id="backToList" class="secondary" style="margin-bottom:12px">
      &larr; Terug naar lijst
    </button>
    <div id="taskDetail"></div>
    <div class="card">
      <div class="section-title">PDFs</div>
      <div id="pdfs" class="hint">&mdash;</div>
    </div>
    <div class="card">
      <div class="section-title">Documenten</div>
      <div id="docContainer" class="hint">Project gegevens laden...</div>
    </div>
  `;

  function mount() {
    document.getElementById("backToList").addEventListener("click", () => {
      Router.showView("tasks");
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Render task detail card ──

  function render(task) {
    const el = document.getElementById("taskDetail");
    if (!el) return;
    el.innerHTML = "";

    if (!task || !task.id) {
      el.innerHTML = '<div class="hint">Geen taak data.</div>';
      return;
    }

    const card = document.createElement("div");
    card.className = "task-detail";

    if (task.project_name) {
      const proj = document.createElement("div");
      proj.className = "task-detail-project";
      proj.textContent = task.project_name;
      card.appendChild(proj);
    }

    const nameRow = document.createElement("div");
    nameRow.className = "task-detail-name";
    nameRow.textContent = task.name || task.display_name || "Task";
    if (task.order_number) nameRow.textContent += ` \u2022 ${task.order_number}`;
    card.appendChild(nameRow);

    const grid = document.createElement("div");
    grid.className = "task-detail-grid";

    let dateStr = task.date || "";
    if (!dateStr && task.planned_date_begin) {
      dateStr = String(task.planned_date_begin).split(" ")[0];
    }

    if (dateStr) {
      grid.innerHTML += `
        <div class="task-detail-item">
          <span class="detail-label">Datum</span>
          <span class="detail-value">${formatDateLabel(dateStr)}</span>
        </div>`;
    }

    if (task.project_leader) {
      grid.innerHTML += `
        <div class="task-detail-item">
          <span class="detail-label">Projectleider</span>
          <span class="detail-value">${escapeHtml(task.project_leader)}</span>
        </div>`;
    }

    if (task.address_name || task.address_full) {
      grid.innerHTML += `
        <div class="task-detail-item">
          <span class="detail-label">Adres</span>
          <span class="detail-value">
            ${task.address_name ? `<strong>${escapeHtml(task.address_name)}</strong>` : ""}
            ${task.address_full ? `<br>${escapeHtml(task.address_full)}` : ""}
          </span>
        </div>`;
    }

    if (grid.children.length > 0) card.appendChild(grid);

    if (task.description) {
      const desc = document.createElement("div");
      desc.className = "task-detail-description";

      const label = document.createElement("div");
      label.className = "detail-label";
      label.textContent = "Omschrijving";
      desc.appendChild(label);

      const content = document.createElement("div");
      content.className = "detail-description-content";
      content.innerHTML = task.description;
      desc.appendChild(content);

      card.appendChild(desc);
    }

    el.appendChild(card);
  }

  // ── Render PDFs ──

  function renderPdfs(pdfs) {
    const el = document.getElementById("pdfs");
    if (!el) return;
    el.innerHTML = "";

    if (!pdfs || pdfs.length === 0) {
      el.className = "hint";
      el.textContent = "Geen PDFs.";
      return;
    }

    el.className = "";

    pdfs.forEach((p, i) => {
      const name = p.name || `PDF ${i + 1}`;

      const row = document.createElement("div");
      row.className = "pdf-row";

      const info = document.createElement("div");
      const nameDiv = document.createElement("div");
      nameDiv.className = "pdf-name";
      nameDiv.textContent = name;
      info.appendChild(nameDiv);

      const meta = document.createElement("div");
      meta.className = "pdf-meta";
      meta.textContent = p.mimetype || "application/pdf";
      info.appendChild(meta);

      row.appendChild(info);

      const btns = document.createElement("div");
      btns.style.cssText = "display:flex;gap:8px";

      const viewBtn = document.createElement("button");
      viewBtn.textContent = "Bekijk";
      viewBtn.className = "secondary btn-sm";
      viewBtn.addEventListener("click", () => viewPdf(p.data));
      btns.appendChild(viewBtn);

      const dlBtn = document.createElement("button");
      dlBtn.textContent = "Download";
      dlBtn.className = "btn-sm";
      dlBtn.addEventListener("click", () => downloadPdf(p.data, name));
      btns.appendChild(dlBtn);

      row.appendChild(btns);
      el.appendChild(row);
    });
  }

  // ── Register (no tab — accessed via task list, not nav) ──

  Router.register("taskDetail", { template, mount });

  return { render, renderPdfs };
})();
