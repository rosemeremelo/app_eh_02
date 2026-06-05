let attendanceCount = 0;
// Banco de dados em memória para armazenar os projetos e seus respectivos atendimentos
const bancoProjetos = {};

function addAttendance() {
  attendanceCount++;
  const seq = attendanceCount;
  const list = document.getElementById('attendanceList');
  const id = `att-${seq}`;

  // Formata o número sequencial com dois dígitos (ex: 01, 02, 03...)
  const numeroFormatado = String(seq).padStart(2, '0');

  const div = document.createElement('div');
  div.className = 'attendance-entry';
  div.id = id;
  
  div.innerHTML = `
    <div class="registro-preenchimento-header">
      <span class="registro-status-titulo">${numeroFormatado} - REGISTRO EM PREENCHIMENTO</span>
      <button type="button" class="btn-excluir-formulario" onclick="removeAttendance('${id}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        Excluir Formulário
      </button>
    </div>
    
    <div class="entry-body">
      <div class="form-grid">
        
        <div class="form-group">
          <label>Data *</label>
          <input type="date" class="att-data" value="2026-06-01" />
        </div>
        
        <div class="form-group">
          <label>Horário de Início *</label>
          <input type="time" class="att-inicio" />
        </div>

        <div class="form-group">
          <label>Horário de Fim *</label>
          <input type="time" class="att-fim" />
        </div>
        
        <div class="form-group">
          <label>Modalidade *</label>
          <select class="att-modalidade">
            <option value="Online" selected>Online</option>
            <option value="Presencial">Presencial</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>
        
        <div class="form-group full">
          <label>Assunto da Mentoria *</label>
          <input type="text" class="att-assunto" placeholder="Ex: Ajuste de Pitch, Validação Comercial, UX/UI..." />
        </div>

        <div class="form-group full">
          <label>Equipe de Mentores Vinculados * <small style="color:#64748B; font-weight:normal;">(Digite o nome e aperte Enter para adicionar)</small></label>
          <div class="mentores-wrapper">
            <div class="mentores-tags-container" id="mentores-tags-container-${id}">
              <input type="text" id="input-mentor-manual" placeholder="Ex: Prof. Carlos Silva..." onkeydown="handleMentorInput(event, '${id}')">
            </div>
          </div>
        </div>
        
        <div class="form-group full">
          <label>Descrição Detalhada das Ações Realizadas *</label>
          <textarea class="att-descricao" placeholder="Relate as decisões tomadas..."></textarea>
        </div>
        
        <div class="form-group full">
          <label>Evidências do Atendimento (Máximo 5 fotos)</label>
          <label class="photo-upload-area">
            <input type="file" accept="image/*" multiple onchange="updateFileLabel(this)">
            <span class="photo-upload-label">📸 Clique para selecionar fotos ou arraste aqui</span>
            <small style="color: #64748B;">JPG, PNG, WEBP — múltiplas imagens aceitas</small>
          </label>
        </div>

      </div>
    </div>
  `;

  list.appendChild(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Suporte para o campo de tags manual de mentores
function handleMentorInput(event, idContainer) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const input = event.target;
    const nomeMentor = input.value.trim();
    const container = document.getElementById(`mentores-tags-container-${idContainer}`);
    
    if (nomeMentor !== '') {
      const span = document.createElement('span');
      span.className = 'mentor-tag';
      span.style.cssText = "background:#e2e8f0; padding:4px 8px; border-radius:4px; margin-right:5px; font-size:12px; display:inline-flex; align-items:center; gap:5px;";
      span.innerHTML = `${nomeMentor} <b style="cursor:pointer;color:#ef4444;" onclick="this.parentNode.remove()">✕</b>`;
      container.insertBefore(span, input);
      input.value = '';
    }
  }
}

function removeAttendance(id) {
  const el = document.getElementById(id);
  if (el) { 
    el.style.opacity = '0'; 
    el.style.transform = 'scale(0.97)'; 
    el.style.transition = '0.2s'; 
    setTimeout(() => el.remove(), 200); 
  }
}

function finalizeAttendance() {
  const projetoNomeAtivo = document.getElementById('projeto-atendimento-nome').getAttribute('data-projeto-key');
  
  if (!projetoNomeAtivo || !bancoProjetos[projetoNomeAtivo]) {
    alert("Nenhum projeto ativo selecionado para sincronizar!");
    return;
  }

  const entries = document.querySelectorAll('.attendance-list .attendance-entry');
  const atendimentosSalvos = [];

  entries.forEach(entry => {
    const tagElements = entry.querySelectorAll('.mentor-tag');
    const mentoresArray = [];
    tagElements.forEach(tag => {
      mentoresArray.push(tag.textContent.replace('✕', '').trim());
    });

    const dados = {
      data: entry.querySelector('.att-data').value,
      inicio: entry.querySelector('.att-inicio').value,
      fim: entry.querySelector('.att-fim').value,
      modalidade: entry.querySelector('.att-modalidade').value,
      assunto: entry.querySelector('.att-assunto').value,
      mentores: mentoresArray.join(', '),
      descricao: entry.querySelector('.att-descricao').value
    };
    atendimentosSalvos.push(dados);
  });

  bancoProjetos[projetoNomeAtivo].atendimentos = atendimentosSalvos;
  alert("Atendimentos salvos e sincronizados com sucesso com o banco de dados corporativo!");
}

function handlePhotos(event, previewId) {
  const preview = document.getElementById(previewId);
  if (!preview) return;
  const files = Array.from(event.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const thumb = document.createElement('div');
      thumb.className = 'photo-thumb';
      thumb.style.position = 'relative';
      thumb.style.width = '80px';
      thumb.style.height = '80px';
      
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = file.name;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '4px';
      
      const btn = document.createElement('button');
      btn.className = 'remove-photo';
      btn.innerHTML = '✕';
      btn.style.position = 'absolute';
      btn.style.top = '2px';
      btn.style.right = '2px';
      btn.style.background = 'rgba(229, 62, 62, 0.9)';
      btn.style.color = 'white';
      btn.style.border = 'none';
      btn.style.borderRadius = '50%';
      btn.style.width = '18px';
      btn.style.height = '18px';
      btn.style.cursor = 'pointer';
      btn.style.fontSize = '10px';
      
      btn.onclick = () => thumb.remove();
      thumb.appendChild(img);
      thumb.appendChild(btn);
      preview.appendChild(thumb);
    };
    reader.readAsDataURL(file);
  });
  event.target.value = '';
}

// Máscara: CNPJ
document.getElementById('cnpj').addEventListener('input', function() {
  let v = this.value.replace(/\D/g,'');
  v = v.replace(/^(\d{2})(\d)/,'$1.$2');
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/,'$1.$2.$3');
  v = v.replace(/\.(\d{3})(\d)/,'.$1/$2');
  v = v.replace(/(\d{4})(\d)/,'$1-$2');
  this.value = v;
});

// Máscara: CPF
document.getElementById('cpf').addEventListener('input', function() {
  let v = this.value.replace(/\D/g,'');
  v = v.replace(/(\d{3})(\d)/,'$1.$2');
  v = v.replace(/(\d{3})(\d)/,'$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/,'$1-$2');
  this.value = v;
});

// Máscara para Telefones
function phoneMask(el) {
  if (!el) return;
  el.addEventListener('input', function() {
    let v = this.value.replace(/\D/g,'');
    if (v.length <= 10) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3');
    else v = v.replace(/^(\d{2})(\d{1})(\d{4})(\d{0,4})/,'($1) $2 $3-$4');
    this.value = v.trim().replace(/-$/,'');
  });
}
phoneMask(document.getElementById('tel-com'));
phoneMask(document.getElementById('tel-pes'));

function submitForm() {
  const nomeEmpresaInput = document.querySelector('input[placeholder="Nome fantasia ou marca"]');
  const cnpjInput = document.getElementById('cnpj');
  const telComInput = document.getElementById('tel-com');
  const enderecoInput = document.querySelector('input[placeholder="Rua, Número, Bairro"]');
  const demandaInput = document.querySelector('textarea[placeholder="O que buscam resolver?"]');
  
  const nomeRespInput = document.querySelector('input[placeholder="Nome completo"]');
  const cpfInput = document.getElementById('cpf');
  const emailInput = document.querySelector('input[placeholder="responsavel@email.com"]');
  const telPesInput = document.getElementById('tel-pes');

  if (!nomeEmpresaInput.value || !nomeRespInput.value || !emailInput.value) {
    alert("Por favor, preencha os campos obrigatórios (Nome da Empresa, Nome do Responsável e E-mail)!");
    return;
  }

  const projetoKey = nomeEmpresaInput.value.trim();

  bancoProjetos[projetoKey] = {
    nome: nomeEmpresaInput.value,
    cnpj: cnpjInput.value || 'Não informado',
    telefoneComercial: telComInput.value || 'Não informado',
    endereco: enderecoInput.value || 'Não informado',
    demandaInicial: demandaInput.value || 'Não informada',
    responsavelNome: nomeRespInput.value,
    responsavelCpf: cpfInput.value || 'Não informado',
    responsavelEmail: emailInput.value,
    responsavelTelefone: telPesInput.value || 'Não informado',
    atendimentos: []
  };

  const secaoBanco = document.getElementById('secao-banco-empreendimentos');
  secaoBanco.style.display = 'block';

  // ESCAPE DE SEGURANÇA: Garante strings limpas para passar como parâmetros das funções HTML
  const nomeEmpresaValor = nomeEmpresaInput.value.replace(/'/g, "\\'").trim();
  const nomeRespValor = nomeRespInput.value.replace(/'/g, "\\'").trim();

  const listaSalvos = document.getElementById('lista-empreendimentos-salvos');
  const novaLinha = document.createElement('div');
  novaLinha.className = 'empreendimento-linha';

  // CORREÇÃO CRÍTICA: Envolver os parâmetros literais com aspas escapadas (\"...\") para evitar quebra de strings com espaços
  novaLinha.innerHTML = `
    <div class="empresa-info">
      <h4>${nomeEmpresaInput.value}</h4>
      <p>CNPJ: ${cnpjInput.value || 'Não informado'}</p>
      <a class="link-detalhes">👁 Ver Detalhes do Cadastro</a>
    </div>
    <div class="resp-info">
      <p style="font-weight: 500; color: #334155;">${nomeRespInput.value}</p>
      <p>CPF: ${cpfInput.value || 'Não informado'}</p>
    </div>
    <div class="contato-info">
      <p>${emailInput.value}</p>
      <p>${telComInput.value || telPesInput.value || 'Não informado'}</p>
    </div>
    <div class="col-acao-botoes">
      <button class="btn-abrir-atendimentos" type="button" onclick="abrirAtendimentosDoProjeto(\"${nomeEmpresaValor}\", \"${nomeRespValor}\")">Abrir Atendimentos</button>
      <button class="btn-pdf-vermelho" type="button" onclick="gerarPdfConsolidado(\"${nomeEmpresaValor}\")" title="Gerar PDF">📄</button>
    </div>
  `;

  listaSalvos.appendChild(novaLinha);

  const toast = document.getElementById('toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }

  nomeEmpresaInput.value = '';
  cnpjInput.value = '';
  telComInput.value = '';
  enderecoInput.value = '';
  demandaInput.value = '';
  nomeRespInput.value = '';
  cpfInput.value = '';
  emailInput.value = '';
  telPesInput.value = '';
}

// Adiciona o primeiro atendimento automaticamente ao carregar
addAttendance();

function toggleFormulario() {
  const formBody = document.querySelector('.card-unificado .card-unificado-body');
  const btnMinimizar = document.getElementById('btn-minimizar-form');
  
  if (!formBody || !btnMinimizar) return;

  if (formBody.style.display === '' || formBody.style.display === 'block') {
    formBody.style.display = 'none';
    btnMinimizar.innerText = '+ Expandir Formulário';
    btnMinimizar.style.backgroundColor = '#28a745'; 
  } else {
    formBody.style.display = 'block';
    btnMinimizar.innerText = '— Minimizar Formulário';
    btnMinimizar.style.backgroundColor = ''; 
  }
}

function abrirAtendimentosDoProjeto(nomeEmpresa, nomeResponsavel) {
  const blocoAtendimentos = document.getElementById('bloco-atendimentos');
  blocoAtendimentos.style.display = 'block';
  
  const headerNome = document.getElementById('projeto-atendimento-nome');
  headerNome.innerText = `${nomeEmpresa} (Resp: ${nomeResponsavel})`;
  headerNome.setAttribute('data-projeto-key', nomeEmpresa.trim());
  
  document.getElementById('attendanceList').innerHTML = '';
  addAttendance();
  blocoAtendimentos.scrollIntoView({ behavior: 'smooth' });
}

function updateFileLabel(input) {
  const labelSpan = input.parentNode.querySelector('.photo-upload-label');
  const filesCount = input.files.length;
  
  if (filesCount === 0) {
    labelSpan.innerHTML = "📸 Clique para selecionar fotos ou arraste aqui";
  } else if (filesCount === 1) {
    labelSpan.innerHTML = "✅ 1 foto selecionada";
  } else {
    labelSpan.innerHTML = `✅ ${filesCount} fotos selecionadas`;
  }
}

// REVISÃO COMPLETA E CORREÇÃO DO ENGINE DO PDF
function gerarPdfConsolidado(projetoKey) {
  const projeto = bancoProjetos[projetoKey.trim()]; 

  if (!projeto) {
    alert("Dados do projeto não localizados para emissão do relatório!");
    return;
  }

  const elementoPdf = document.createElement('div');
  elementoPdf.id = 'container-temporario-pdf'; 
  
  elementoPdf.style.cssText = `
    position: fixed;
    bottom: 0;
    right: 0;
    width: 210mm;
    min-height: 297mm;
    padding: 25mm;
    background-color: #FFFFFF !important;
    color: #111827 !important;
    font-family: Arial, sans-serif !important;
    z-index: -99999;
    opacity: 1 !important;
    display: block !important;
    visibility: visible !important;
    box-sizing: border-box;
  `;

  // Montagem estruturada do HTML Interno (Garante Empreendimento + Empreendedor + Histórico)
  let htmlDocumento = `
    <div style="border-bottom: 3px solid #F5C200; padding-bottom: 15px; margin-bottom: 25px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td>
            <h1 style="font-size: 22px; margin: 0; color: #111827; text-transform: uppercase; font-family: Arial, sans-serif; font-weight: bold;">Relatório de Acompanhamento</h1>
            <p style="font-size: 12px; margin: 4px 0 0 0; color: #4B5563;">Escritório Híbrido — Colorama · UFR</p>
          </td>
          <td style="text-align: right; font-size: 12px; color: #6B7280; vertical-align: middle;">
            <strong>Emitido em:</strong> ${new Date().toLocaleDateString('pt-BR')}
          </td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 14px; background: #111827; padding: 6px 10px; color: #FFFFFF; margin: 0 0 12px 0; border-left: 4px solid #F5C200; text-transform: uppercase; letter-spacing: 0.5px; font-family: Arial, sans-serif;">1. Dados do Empreendimento</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: Arial, sans-serif;">
        <tr>
          <td style="padding: 5px 0; font-weight: bold; width: 25%;">Razão/Nome Fantasia:</td>
          <td style="padding: 5px 0; color: #374151;">${projeto.nome}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-weight: bold;">CNPJ:</td>
          <td style="padding: 5px 0; color: #374151;">${projeto.cnpj}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-weight: bold;">Telefone Comercial:</td>
          <td style="padding: 5px 0; color: #374151;">${projeto.telefoneComercial}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-weight: bold;">Endereço Corporativo:</td>
          <td style="padding: 5px 0; color: #374151;">${projeto.endereco}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-weight: bold; vertical-align: top;">Demanda Inicial:</td>
          <td style="padding: 5px 0; color: #374151; line-height: 1.4; white-space: pre-line;">${projeto.demandaInicial}</td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 14px; background: #111827; padding: 6px 10px; color: #FFFFFF; margin: 0 0 12px 0; border-left: 4px solid #F5C200; text-transform: uppercase; letter-spacing: 0.5px; font-family: Arial, sans-serif;">2. Dados do Empreendedor (Responsável)</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: Arial, sans-serif;">
        <tr>
          <td style="padding: 5px 0; font-weight: bold; width: 25%;">Nome do Responsável:</td>
          <td style="padding: 5px 0; color: #374151;">${projeto.responsavelNome}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-weight: bold;">CPF:</td>
          <td style="padding: 5px 0; color: #374151;">${projeto.responsavelCpf}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-weight: bold;">E-mail de Contato:</td>
          <td style="padding: 5px 0; color: #374151;">${projeto.responsavelEmail}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-weight: bold;">Telefone Pessoal:</td>
          <td style="padding: 5px 0; color: #374151;">${projeto.responsavelTelefone}</td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom: 15px;">
      <h2 style="font-size: 14px; background: #111827; padding: 6px 10px; color: #FFFFFF; margin: 0 0 15px 0; border-left: 4px solid #F5C200; text-transform: uppercase; letter-spacing: 0.5px; font-family: Arial, sans-serif;">3. Histórico de Atendimentos Realizados</h2>
  `;

  if (!projeto.atendimentos || projeto.atendimentos.length === 0) {
    htmlDocumento += `
      <div style="border: 1px dashed #CBD5E1; padding: 15px; text-align: center; border-radius: 6px;">
        <p style="font-size: 12px; color: #6B7280; font-style: italic; margin: 0;">
          Nenhum registro de atendimento foi vinculado a este projeto. Certifique-se de clicar no botão verde "Finalizar e Sincronizar Atendimentos" antes de gerar este PDF.
        </p>
      </div>
    `;
  } else {
    projeto.atendimentos.forEach((atendimento, index) => {
      htmlDocumento += `
        <div style="border: 1px solid #CBD5E1; border-radius: 6px; padding: 15px; margin-bottom: 15px; background: #F8FAFC; page-break-inside: avoid; font-family: Arial, sans-serif;">
          <table style="width: 100%; border-collapse: collapse; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 8px;">
            <tr>
              <td style="font-size: 12px; font-weight: bold; color: #111827;">
                Sessão de Atendimento #${String(index + 1).padStart(2, '0')} — Modalidade: ${atendimento.modalidade}
              </td>
              <td style="text-align: right; font-size: 11px; color: #64748B;">
                <strong>Data:</strong> ${atendimento.data} | <strong>Horário:</strong> ${atendimento.inicio} às ${atendimento.fim}
              </td>
            </tr>
          </table>
          
          <div style="font-size: 12px; margin-bottom: 6px;">
            <strong>Assunto Principal:</strong> <span style="color: #1E293B; font-weight: 600;">${atendimento.assunto || 'Não especificado'}</span>
          </div>

          <div style="font-size: 12px; margin-bottom: 8px;">
            <strong>Corpo de Mentores:</strong> <span style="color: #334155;">${atendimento.mentores || 'Sem mentores alocados'}</span>
          </div>
          
          <div style="font-size: 12px; line-height: 1.4; margin-top: 8px;">
            <strong>Relatório Técnico das Ações Realizadas:</strong><br>
            <div style="color: #475569; margin-top: 4px; white-space: pre-line; background: #FFFFFF; padding: 8px; border: 1px solid #E2E8F0; border-radius: 4px;">${atendimento.descricao || 'Nenhum detalhe técnico inserido.'}</div>
          </div>
        </div>
      `;
    });
  }

  htmlDocumento += `</div>`; 
  elementoPdf.innerHTML = htmlDocumento;
  document.body.appendChild(elementoPdf);

  const opcoes = {
    margin:       15,
    filename:     `Relatorio_Consolidado_${projeto.nome.replace(/\s+/g, '_')}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      scrollY: 0,
      scrollX: 0
    },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Temporizador para sincronismo assíncrono perfeito do canvas
  setTimeout(() => {
    html2pdf()
      .set(opcoes)
      .from(elementoPdf)
      .save()
      .then(() => {
        const removerElementofalso = document.getElementById('container-temporario-pdf');
        if (removerElementofalso) removerElementofalso.remove();
      })
      .catch((erro) => {
        console.error("Erro interno ao processar folha:", erro);
      });
  }, 500);
}