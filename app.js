const STORAGE_KEY = 'checklist-inspecao-v1';

const CHECKLIST_DEFAULT = [
  'Nível de óleo do motor',
  'Nível de água / radiador',
  'Vazamentos de óleo, combustível ou água',
  'Pneu dianteiro e traseiro',
  'Pressão dos pneus',
  'Desgaste dos pneus e calotas',
  'Freios e pedal de freio',
  'Sinalização: faróis, lanternas e setas',
  'Bateria e sistema elétrico',
  'Estado da cabine e espelhos',
  'Suspensão e amortecedores',
  'Direção e alinhamento',
  'Cinto de segurança e assentos',
  'Funcionamento geral do caminhão'
];

const DEFAULT_STATE = {
  currentUser: null,
  users: [
    { id: 1, name: 'Operador', username: 'operador', password: '1234', profile: 'operador' },
    { id: 2, name: 'Supervisor', username: 'supervisor', password: '1234', profile: 'supervisor' },
    { id: 3, name: 'Manutenção', username: 'manutencao', password: '1234', profile: 'manutencao' }
  ],
  equipments: [
    { id: 1, code: 'CAM-001', name: 'Caminhão Mercedes Actros', location: 'Frota A', plate: 'ABC-1234', km: 35290 },
    { id: 2, code: 'CAM-002', name: 'Caminhão Volvo FH', location: 'Frota B', plate: 'DEF-5678', km: 28740 },
    { id: 3, code: 'CAM-003', name: 'Caminhão Scania P420', location: 'Frota C', plate: 'GHI-9012', km: 41880 }
  ],
  inspections: []
};

const app = document.getElementById('app');

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(DEFAULT_STATE);

  try {
    return JSON.parse(saved);
  } catch (error) {
    return structuredClone(DEFAULT_STATE);
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleString('pt-BR');
}

function getProfileLabel(profile) {
  const labels = {
    operador: 'Operador',
    supervisor: 'Supervisor',
    manutencao: 'Manutenção'
  };
  return labels[profile] || profile;
}

function getStatusClass(status) {
  const classes = {
    conforme: 'conforme',
    nao_conforme: 'nao-conforme',
    pendente: 'pendente'
  };
  return classes[status] || 'pendente';
}

function getStatusLabel(status) {
  const labels = {
    conforme: 'Conforme',
    nao_conforme: 'Não conforme',
    pendente: 'Pendente'
  };
  return labels[status] || status;
}

function getInspectionSummary(inspection) {
  return inspection.items.filter((item) => item.status === 'nao_conforme').length;
}

function loginUser(event) {
  event.preventDefault();
  const form = event.target;
  const username = form.username.value.trim();
  const password = form.password.value.trim();

  if (!username || !password) {
    alert('Informe usuário e senha.');
    return;
  }

  const user = state.users.find((item) => item.username === username && item.password === password);

  if (!user) {
    alert('Credenciais inválidas.');
    return;
  }

  state.currentUser = user;
  saveState();
  renderApp();
}

function logoutUser() {
  state.currentUser = null;
  saveState();
  renderApp();
}

function addEquipment(event) {
  event.preventDefault();
  const form = event.target;
  const code = form.code.value.trim();
  const name = form.name.value.trim();
  const location = form.location.value.trim();
  const plate = form.plate.value.trim();
  const km = Number(form.km.value);

  if (!code || !name || !location || !plate) {
    alert('Preencha todos os campos do caminhão.');
    return;
  }

  state.equipments.push({
    id: Date.now(),
    code,
    name,
    location,
    plate,
    km: Number.isFinite(km) ? km : 0
  });

  saveState();
  form.reset();
  renderApp();
}

function createInspection(event) {
  event.preventDefault();
  const form = event.target;
  const equipmentId = Number(form.equipmentId.value);
  const equipment = state.equipments.find((item) => item.id === equipmentId);
  const plate = form.plate.value.trim();
  const driver = form.driver.value.trim();
  const km = Number(form.km.value);
  const inspectionDate = form.inspectionDate.value || new Date().toISOString();
  const obs = form.observacoes.value.trim();

  if (!equipment) {
    alert('Selecione um caminhão válido.');
    return;
  }

  if (!plate || !driver) {
    alert('Informe a placa e o motorista da inspeção.');
    return;
  }

  const baseItems = CHECKLIST_DEFAULT.map((label, index) => ({
    id: index + 1,
    name: label,
    status: 'pendente',
    ok: null,
    evidence: ''
  }));

  const inspection = {
    id: Date.now(),
    equipmentId: equipment.id,
    equipmentName: equipment.name,
    code: equipment.code,
    plate,
    driver,
    km: Number.isFinite(km) ? km : 0,
    inspectionDate,
    operatorId: state.currentUser.id,
    operatorName: state.currentUser.name,
    createdAt: new Date(inspectionDate).toISOString(),
    status: 'em_andamento',
    observations: obs,
    items: baseItems,
    nonConformities: []
  };

  state.inspections.unshift(inspection);
  saveState();
  form.reset();
  renderApp();
}

function updateChecklistStatus(inspectionId, itemId, value) {
  const inspection = state.inspections.find((item) => item.id === Number(inspectionId));
  if (!inspection) return;

  const item = inspection.items.find((entry) => entry.id === Number(itemId));
  if (!item) return;

  item.status = value;
  item.ok = value === 'conforme';
  saveState();
  renderApp();
}

function updateChecklistEvidence(inspectionId, itemId, value) {
  const inspection = state.inspections.find((item) => item.id === Number(inspectionId));
  if (!inspection) return;

  const item = inspection.items.find((entry) => entry.id === Number(itemId));
  if (!item) return;

  item.evidence = value;
  saveState();
}

function finaliseInspection(inspectionId) {
  const inspection = state.inspections.find((item) => item.id === Number(inspectionId));
  if (!inspection) return;

  const hasPending = inspection.items.some((item) => item.status === 'pendente');
  if (hasPending) {
    alert('Preencha todos os itens do checklist do caminhão antes de finalizar a inspeção.');
    return;
  }

  inspection.status = 'finalizada';
  inspection.finalizedAt = new Date().toISOString();
  inspection.nonConformities = inspection.items
    .filter((item) => item.status === 'nao_conforme')
    .map((item) => ({
      id: Date.now() + Math.random(),
      itemName: item.name,
      evidence: item.evidence || 'Sem evidência registrada.',
      status: 'Aberta'
    }));

  saveState();
  renderApp();
}

function renderLogin() {
  app.innerHTML = `
    <div class="login-screen">
      <div class="login-box">
        <h2>Checklist de Inspeção de Caminhões</h2>
        <p>Faça login para registrar inspeções, verificar itens críticos e acompanhar ocorrências da frota.</p>

        <form id="loginForm">
          <div class="form-row">
            <label for="username">Usuário</label>
            <select id="username" name="username">
              <option value="">Selecione</option>
              ${state.users
                .map(
                  (user) => `
                    <option value="${user.username}">${user.name} (${getProfileLabel(user.profile)})</option>
                  `
                )
                .join('')}
            </select>
          </div>

          <div class="form-row">
            <label for="password">Senha</label>
            <input id="password" name="password" type="password" placeholder="Digite a senha" />
          </div>

          <button type="submit" class="primary-btn" style="width: 100%;">Entrar</button>
        </form>

        <div class="mt-2">
          <strong>Credenciais de teste:</strong>
          <div class="preview-list">
            <div class="preview-item"><span>operador</span><span>1234</span></div>
            <div class="preview-item"><span>supervisor</span><span>1234</span></div>
            <div class="preview-item"><span>manutencao</span><span>1234</span></div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('loginForm').addEventListener('submit', loginUser);
}

function renderDashboard() {
  const totalInspecoes = state.inspections.length;
  const emAndamento = state.inspections.filter((item) => item.status === 'em_andamento').length;
  const finalizadas = state.inspections.filter((item) => item.status === 'finalizada').length;
  const ocorrencias = state.inspections.reduce(
    (acc, item) => acc + item.items.filter((entry) => entry.status === 'nao_conforme').length,
    0
  );

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <h1>Checklist de Inspeção de Caminhões</h1>
        <div class="user-badge">
          <span class="user-pill">${state.currentUser.name} · ${getProfileLabel(state.currentUser.profile)}</span>
          <button class="logout-btn" id="logoutBtn">Sair</button>
        </div>
      </header>

      <section class="stats-grid">
        <div class="stat-card">
          <span class="label">Caminhões</span>
          <span class="value">${state.equipments.length}</span>
        </div>
        <div class="stat-card">
          <span class="label">Inspeções</span>
          <span class="value">${totalInspecoes}</span>
        </div>
        <div class="stat-card">
          <span class="label">Em andamento</span>
          <span class="value">${emAndamento}</span>
        </div>
        <div class="stat-card">
          <span class="label">Ocorrências</span>
          <span class="value">${ocorrencias}</span>
        </div>
      </section>

      <main class="layout">
        <section class="panel">
          <h2>Cadastro de caminhão</h2>
          <form id="equipmentForm">
            <div class="form-row">
              <label for="code">Código</label>
              <input id="code" name="code" type="text" placeholder="Ex.: CAM-010" />
            </div>

            <div class="form-row">
              <label for="name">Modelo / nome</label>
              <input id="name" name="name" type="text" placeholder="Ex.: Caminhão Volvo FH" />
            </div>

            <div class="form-row">
              <label for="plate">Placa</label>
              <input id="plate" name="plate" type="text" placeholder="Ex.: ABC-1234" />
            </div>

            <div class="form-row">
              <label for="location">Localização / frota</label>
              <input id="location" name="location" type="text" placeholder="Ex.: Frota A" />
            </div>

            <div class="form-row">
              <label for="km">KM atual</label>
              <input id="km" name="km" type="number" min="0" placeholder="Ex.: 35000" />
            </div>

            <button type="submit" class="primary-btn">Cadastrar caminhão</button>
          </form>

          <div class="mt-2">
            <h3>Frota</h3>
            <div class="list">
              ${
                state.equipments.length
                  ? state.equipments
                      .map(
                        (equipment) => `
                          <div class="list-item">
                            <header>
                              <h4>${equipment.name}</h4>
                              <span class="tag conforme">${equipment.code}</span>
                            </header>
                            <div>${equipment.location}</div>
                          </div>
                        `
                      )
                      .join('')
                  : '<div class="empty-state">Nenhum caminhão cadastrado.</div>'
              }
            </div>
          </div>
        </section>

        <section class="panel">
          <h2>Nova inspeção do caminhão</h2>
          <form id="inspectionForm">
            <div class="form-row">
              <label for="equipmentId">Caminhão</label>
              <select id="equipmentId" name="equipmentId">
                <option value="">Selecione</option>
                ${state.equipments
                  .map(
                    (equipment) => `
                      <option value="${equipment.id}">${equipment.code} - ${equipment.name}</option>
                    `
                  )
                  .join('')}
              </select>
            </div>

            <div class="form-row">
              <label for="plate">Placa</label>
              <input id="plate" name="plate" type="text" placeholder="Ex.: ABC-1234" />
            </div>

            <div class="form-row">
              <label for="driver">Motorista</label>
              <input id="driver" name="driver" type="text" placeholder="Ex.: João da Silva" />
            </div>

            <div class="form-row">
              <label for="km">KM atual</label>
              <input id="km" name="km" type="number" min="0" placeholder="Ex.: 35000" />
            </div>

            <div class="form-row">
              <label for="inspectionDate">Data da inspeção</label>
              <input id="inspectionDate" name="inspectionDate" type="date" />
            </div>

            <div class="form-row">
              <label for="observacoes">Observações gerais</label>
              <textarea id="observacoes" name="observacoes" placeholder="Informe observações relevantes da inspeção"></textarea>
            </div>

            <button type="submit" class="primary-btn">Criar inspeção</button>
          </form>

          <div class="mt-2">
            <h3>Checklist da frota em andamento</h3>
            ${
              state.inspections.filter((inspection) => inspection.status === 'em_andamento').length
                ? state.inspections
                    .filter((inspection) => inspection.status === 'em_andamento')
                    .map(
                      (inspection) => `
                        <div class="list-item" style="margin-bottom: 12px;">
                          <header>
                            <h4>${inspection.equipmentName}</h4>
                            <span class="tag pendente">Em andamento</span>
                          </header>
                          <div><strong>Placa:</strong> ${inspection.plate || '—'}</div>
                          <div><strong>Motorista:</strong> ${inspection.driver || '—'}</div>
                          <div><strong>KM:</strong> ${inspection.km || 0}</div>
                          <div><strong>Data:</strong> ${formatDate(inspection.inspectionDate || inspection.createdAt)}</div>
                          <div class="checklist">
                            ${inspection.items
                              .map(
                                (item) => `
                                  <div class="item-card">
                                    <div class="item-header">
                                      <h4>${item.name}</h4>
                                    </div>

                                    <div class="radio-group">
                                      <label class="radio-option">
                                        <input type="radio" name="status-${inspection.id}-${item.id}" value="conforme" ${item.status === 'conforme' ? 'checked' : ''} onchange="updateChecklistStatus(${inspection.id}, ${item.id}, 'conforme')" />
                                        OK
                                      </label>
                                      <label class="radio-option">
                                        <input type="radio" name="status-${inspection.id}-${item.id}" value="nao_conforme" ${item.status === 'nao_conforme' ? 'checked' : ''} onchange="updateChecklistStatus(${inspection.id}, ${item.id}, 'nao_conforme')" />
                                        Não OK
                                      </label>
                                      <label class="radio-option">
                                        <input type="radio" name="status-${inspection.id}-${item.id}" value="pendente" ${item.status === 'pendente' ? 'checked' : ''} onchange="updateChecklistStatus(${inspection.id}, ${item.id}, 'pendente')" />
                                        Pendente
                                      </label>
                                    </div>

                                    <div class="form-row" style="margin-top: 12px;">
                                      <label>Observação do item</label>
                                      <textarea placeholder="Descreva se o item está ok ou o problema encontrado" onchange="updateChecklistEvidence(${inspection.id}, ${item.id}, this.value)">${item.evidence || ''}</textarea>
                                    </div>
                                  </div>
                                `
                              )
                              .join('')}
                          </div>

                          <div class="form-actions">
                            <button type="button" class="primary-btn" onclick="finaliseInspection(${inspection.id})">Finalizar inspeção</button>
                          </div>
                        </div>
                      `
                    )
                    .join('')
                : '<div class="empty-state">Nenhuma inspeção de caminhão em aberto.</div>'
            }
          </div>
        </section>

        <aside class="panel">
          <h2>Histórico</h2>
          <div class="list">
            ${
              state.inspections.length
                ? state.inspections
                    .slice(0, 8)
                    .map(
                      (inspection) => `
                        <div class="list-item">
                          <header>
                            <h4>${inspection.equipmentName}</h4>
                            <span class="tag ${inspection.status === 'finalizada' ? 'conforme' : 'pendente'}">
                              ${inspection.status === 'finalizada' ? 'Finalizada' : 'Em andamento'}
                            </span>
                          </header>
                          <div><strong>Operador:</strong> ${inspection.operatorName}</div>
                          <div><strong>Placa:</strong> ${inspection.plate || '—'}</div>
                          <div><strong>Motorista:</strong> ${inspection.driver || '—'}</div>
                          <div><strong>KM:</strong> ${inspection.km || 0}</div>
                          <div><strong>Data:</strong> ${formatDate(inspection.inspectionDate || inspection.createdAt)}</div>
                          <div><strong>Ocorrências:</strong> ${getInspectionSummary(inspection)}</div>
                        </div>
                      `
                    )
                    .join('')
                : '<div class="empty-state">Nenhuma inspeção de caminhão registrada.</div>'
            }
          </div>
        </aside>
      </main>
    </div>
  `;

  document.getElementById('logoutBtn').addEventListener('click', logoutUser);
  document.getElementById('equipmentForm').addEventListener('submit', addEquipment);
  document.getElementById('inspectionForm').addEventListener('submit', createInspection);
}

function renderApp() {
  if (!state.currentUser) {
    renderLogin();
    return;
  }

  renderDashboard();
}

document.addEventListener('DOMContentLoaded', renderApp);
