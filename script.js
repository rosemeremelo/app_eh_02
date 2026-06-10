// 1. Criamos a variável global que vai armazenar nossos empreendimentos
let bancoEmpreendimentos = [];

// 2. Quando a página carregar, tentamos buscar o que já está salvo no navegador
const dadosSalvos = localStorage.getItem('fiap_empreendimentos');

if (dadosSalvos) {
  // Se achou dados, usamos o JSON.parse para transformar o texto de volta em Array/Objeto
  bancoEmpreendimentos = JSON.parse(dadosSalvos);
}

let attendanceCount = 0;

function addAttendance() {
  attendanceCount++;
  const seq = attendanceCount;
  const list = document.getElementById('attendanceList');
  const id = `att-${seq}`;
  const numeroFormatado = String(seq).padStart(2, '0');

  const div = document.createElement('div');
  div.className = 'attendance-entry';
  div.id = id;

  div.innerHTML = `
    <div class="registro-preenchimento-header">
      <span class="registro-status-titulo">${numeroFormatado} - REGISTRO EM PREENCHIMENTO</span>
      <button type="button" class="btn-excluir-formulario" onclick="removeAttendance('${id}')">
        Excluir Formulário
      </button>
    </div>
    
    <div class="entry-body">
      <div class="form-grid">
        <div class="form-group">
          <label for="date-${seq}">Data *</label>
          <input type="date" id="date-${seq}" value="2026-06-01" />
        </div>
        
        <div class="form-group">
          <label for="time-start-${seq}">Horário de Início *</label>
          <input type="time" id="time-start-${seq}" />
        </div>

        <div class="form-group">
          <label for="time-end-${seq}">Horário de Fim *</label>
          <input type="time" id="time-end-${seq}" />
        </div>
        
        <div class="form-group">
          <label for="modalidade-${seq}">Modalidade *</label>
          <select id="modalidade-${seq}">
            <option value="online" selected>Online</option>
            <option value="presencial">Presencial</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>
        
        <div class="form-group full">
          <label for="assunto-${seq}">Assunto da Mentoria *</label>
          <input type="text" id="assunto-${seq}" placeholder="Ex: Ajuste de Pitch, Validação Comercial, UX/UI..." />
        </div>

        <div class="form-group full">
          <label for="mentores-${seq}">Equipe de Mentores Vinculados *</label>
          <select id="mentores-${seq}" multiple style="height: 80px; padding: 5px;">
            <option value="1">Prof. Coordenador FIAP (Coordenador)</option>
            <option value="2">Aline Mendes (Mentor)</option>
            <option value="3">Rosemere Melo (Administrador)</option>
          </select>
        </div>
        
        <div class="form-group full">
          <label for="desc-${seq}">Descrição Detalhada das Ações Realizadas *</label>
          <textarea id="desc-${seq}" placeholder="Relate as decisões tomadas..."></textarea>
        </div>
        
        <div class="form-group full">
          <label>Evidências do Atendimento (Máximo 5 fotos)</label>
          <div class="photo-upload-container">
            <label class="photo-upload-area" for="file-${seq}">
              <input type="file" id="file-${seq}" accept="image/*" multiple onchange="handlePhotos(event, 'preview-${seq}'); updateFileLabel(this);" />
              <span class="photo-upload-label">📸 Clique para selecionar fotos ou arraste aqui</span>
              <small style="color: #64748B;">JPG, PNG, WEBP — múltiplas imagens aceitas</small>
            </label>
          </div>
          <div class="photo-preview" id="preview-${seq}" style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;"></div>
        </div>
      </div>
    </div>
  `;

  list.appendChild(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

  // Validação
  if (!nomeEmpresaInput.value || !nomeRespInput.value || !emailInput.value) {
    alert("Por favor, preencha os campos obrigatórios (Nome da Empresa, Nome do Responsável e E-mail)!");
    return;
  }

  // Criar o objeto de dados organizado
  const novoEmpreendimento = {
    nomeEmpresa: nomeEmpresaInput.value,
    cnpj: cnpjInput.value || 'Não informado',
    endereco: enderecoInput.value || 'Não informado',
    demanda: demandaInput.value || 'Não informada',
    nomeResponsavel: nomeRespInput.value,
    cpf: cpfInput.value || 'Não informado',
    email: emailInput.value,
    telefone: telComInput.value || telPesInput.value || 'Não informado'
  };

  // Adiciona o novo objeto ao nosso array global
  bancoEmpreendimentos.push(novoEmpreendimento);

  // Salva a lista atualizada no localStorage
  localStorage.setItem('fiap_empreendimentos', JSON.stringify(bancoEmpreendimentos));

  // Renderiza a tela novamente para mostrar o novo item
  renderizarListaEmpreendimentos();

  // Exibir o Toast de Sucesso
  const toast = document.getElementById('toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }

  // Limpar os campos do formulário
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
  document.getElementById('projeto-atendimento-nome').innerText = `${nomeEmpresa} (Resp: ${nomeResponsavel})`;
  document.getElementById('attendanceList').innerHTML = '';
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

function renderizarListaEmpreendimentos() {
  const listaSalvos = document.getElementById('lista-empreendimentos-salvos');
  const secaoBanco = document.getElementById('secao-banco-empreendimentos');
  
  if (bancoEmpreendimentos.length === 0) {
    secaoBanco.style.display = 'none';
    return;
  }

  secaoBanco.style.display = 'block';
  listaSalvos.innerHTML = '';

  bancoEmpreendimentos.forEach(emp => {
    const nomeEmpresaValor = emp.nomeEmpresa.replace(/'/g, "\\'");
    const nomeRespValor = emp.nomeResponsavel.replace(/'/g, "\\'");

    const novaLinha = document.createElement('div');
    novaLinha.className = 'empreendimento-linha';

    novaLinha.innerHTML = `
       <div class="empresa-info">
         <h4>${emp.nomeEmpresa}</h4>
         <p>CNPJ: ${emp.cnpj}</p>
         <a class="link-detalhes" style="cursor:pointer;" onclick="verDetalhesDoCadastro('${nomeEmpresaValor}')">👁 Ver Detalhes do Cadastro</a>
       </div>
       <div class="resp-info">
         <p style="font-weight: 500; color: #334155;">${emp.nomeResponsavel}</p>
         <p>CPF: ${emp.cpf}</p>
       </div>
       <div class="contato-info">
         <p>${emp.email}</p>
         <p>${emp.telefone}</p>
       </div>
       <div class="col-acao-botoes">
         <button class="btn-abrir-atendimentos" type="button" onclick="abrirAtendimentosDoProjeto('${nomeEmpresaValor}', '${nomeRespValor}')">Abrir Atendimentos</button>
         <button class="btn-pdf-vermelho" type="button" title="Gerar PDF">📄</button>
       </div>
     `;
    listaSalvos.appendChild(novaLinha);
  });
}

// ==========================================
// VISUALIZAÇÃO DETALHADA DO CADASTRO (CORRIGIDO)
// ==========================================

function verDetalhesDoCadastro(nomeChave) {
  // Correção: Busca no array correto (bancoEmpreendimentos) usando o nome da empresa
  const projeto = bancoEmpreendimentos.find(emp => emp.nomeEmpresa.trim() === nomeChave.trim());

  if (!projeto) {
    alert("Erro: Dados do cadastro não foram localizados.");
    return;
  }

  const modalDetalhes = document.createElement('div');
  modalDetalhes.id = 'modal-detalhes-cadastro';
  
  modalDetalhes.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 10000; font-family: 'DM Sans', Arial, sans-serif;
  `;

  modalDetalhes.innerHTML = `
    <div style="background: #FFFFFF; width: 90%; max-width: 600px; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); overflow: hidden;">
      
      <div style="background: #111827; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #F5C200;">
        <h3 style="color: #FFFFFF; margin: 0; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">👁 DETALHES DO CADASTRO</h3>
        <button onclick="document.getElementById('modal-detalhes-cadastro').remove()" style="background: transparent; border: none; color: #9CA3AF; font-size: 20px; cursor: pointer;">✕</button>
      </div>

      <div style="padding: 24px; max-height: 70vh; overflow-y: auto; text-align: left;">
        
        <h4 style="color: #111827; border-left: 4px solid #F5C200; padding-left: 8px; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; font-weight: bold;">Dados do Empreendimento</h4>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 15px; margin-bottom: 20px; font-size: 13px; line-height: 1.5; color: #334155;">
          <p style="margin: 0 0 8px 0;"><strong>Nome da Empresa / Projeto:</strong> <span style="color: #111827; font-weight: 600;">${projeto.nomeEmpresa}</span></p>
          <p style="margin: 0 0 8px 0;"><strong>CNPJ:</strong> ${projeto.cnpj}</p>
          <p style="margin: 0 0 8px 0;"><strong>Endereço:</strong> ${projeto.endereco}</p>
          <p style="margin: 8px 0 0 0; padding-top: 8px; border-top: 1px dashed #E2E8F0;"><strong>Demanda Inicial:</strong><br><span style="color: #475569; display: block; margin-top: 4px; white-space: pre-line;">${projeto.demanda}</span></p>
        </div>

        <h4 style="color: #111827; border-left: 4px solid #F5C200; padding-left: 8px; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; font-weight: bold;">Dados do Empreendedor</h4>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 15px; font-size: 13px; line-height: 1.5; color: #334155;">
          <p style="margin: 0 0 8px 0;"><strong>Nome do Responsável:</strong> <span style="color: #111827; font-weight: 600;">${projeto.nomeResponsavel}</span></p>
          <p style="margin: 0 0 8px 0;"><strong>CPF:</strong> ${projeto.cpf}</p>
          <p style="margin: 0 0 8px 0;"><strong>E-mail:</strong> <a href="mailto:${projeto.email}" style="color: #0284c7; text-decoration: none;">${projeto.email}</a></p>
          <p style="margin: 0;"><strong>Telefone de Contato:</strong> ${projeto.telefone}</p>
        </div>

      </div>

      <div style="background: #F1F5F9; padding: 12px 24px; text-align: right; border-top: 1px solid #E2E8F0;">
        <button onclick="document.getElementById('modal-detalhes-cadastro').remove()" style="background: #475569; color: #FFFFFF; border: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer;">
          Fechar Visualização
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(modalDetalhes);
}

// Execuções Iniciais Obrigatórias ao Carregar a Página
addAttendance();
renderizarListaEmpreendimentos();