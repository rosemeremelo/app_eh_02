// 1. Criamos a variável global que vai armazenar nossos empreendimentos
let bancoEmpreendimentos = [];

// 2. Quando a página carregar, tentamos buscar o que já está salvo no navegador
const dadosSalvos = localStorage.getItem('fiap_empreendimentos');

if (dadosSalvos) {
  // Se achou dados, usamos o JSON.parse para transformar o texto de volta em Array/Objeto
  bancoEmpreendimentos = JSON.parse(dadosSalvos);
}

let attendanceCount = 0;

// ==========================================
// GERENCIAMENTO DE ATENDIMENTOS EVOLUÍDO
// ==========================================

function abrirAtendimentosDoProjeto(nomeEmpresa, nomeResponsavel) {
  const blocoAtendimentos = document.getElementById('bloco-atendimentos');
  blocoAtendimentos.style.display = 'block';
  
  // Guarda o ID (nome) da empresa no nosso campo oculto para controle
  document.getElementById('projeto-ativo-id').value = nomeEmpresa;
  document.getElementById('projeto-atendimento-nome').innerText = `${nomeEmpresa} (Resp: ${nomeResponsavel})`;
  
  // Limpa a área de exibição
  const list = document.getElementById('attendanceList');
  list.innerHTML = '';

  // Busca o projeto no nosso banco de dados global
  const projeto = bancoEmpreendimentos.find(emp => emp.nomeEmpresa.trim() === nomeEmpresa.trim());
  
  // Se o projeto já tiver atendimentos salvos anteriormente, renderiza eles na tela!
  if (projeto && projeto.atendimentos && projeto.atendimentos.length > 0) {
    projeto.atendimentos.forEach((att, index) => {
      renderizarCardAtendimentoSalvo(att, index + 1);
    });
  } else {
    // Se não tiver nenhum, abre um em branco para iniciar o primeiro preenchimento
    addAttendance();
  }

  blocoAtendimentos.scrollIntoView({ behavior: 'smooth' });
}

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
          <input type="date" id="date-${seq}" class="att-data" value="2026-06-01" />
        </div>
        
        <div class="form-group">
          <label for="time-start-${seq}">Horário de Início *</label>
          <input type="time" id="time-start-${seq}" class="att-inicio" />
        </div>

        <div class="form-group">
          <label for="time-end-${seq}">Horário de Fim *</label>
          <input type="time" id="time-end-${seq}" class="att-fim" />
        </div>
        
        <div class="form-group">
          <label for="modalidade-${seq}">Modalidade *</label>
          <select id="modalidade-${seq}" class="att-modalidade">
            <option value="online" selected>Online</option>
            <option value="presencial">Presencial</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>
        
        <div class="form-group full">
          <label for="assunto-${seq}">Assunto da Mentoria *</label>
          <input type="text" id="assunto-${seq}" class="att-assunto" placeholder="Ex: Ajuste de Pitch, Validação Comercial, UX/UI..." />
        </div>

        <div class="form-group full">
          <label for="mentores-${seq}">Equipe de Mentores Vinculados *</label>
          <select id="mentores-${seq}" class="att-mentores" multiple style="height: 80px; padding: 5px;">
            <option value="1">Prof. Coordenador FIAP (Coordenador)</option>
            <option value="2">Aline Mendes (Mentor)</option>
            <option value="3">Rosemere Melo (Administrador)</option>
          </select>
        </div>
        
        <div class="form-group full">
          <label for="desc-${seq}">Descrição Detalhada das Ações Realizadas *</label>
          <textarea id="desc-${seq}" class="att-desc" placeholder="Relate as decisões tomadas..."></textarea>
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

// Nova função auxiliar para desenhar na tela os atendimentos que já foram salvos no passado
function renderizarCardAtendimentoSalvo(att, numero) {
  const list = document.getElementById('attendanceList');
  const numeroFormatado = String(numero).padStart(2, '0');
  const div = document.createElement('div');
  div.className = 'attendance-entry';
  div.style.borderLeft = '4px solid #28a745'; // Borda verde indicando que está salvo seguro

  // Monta as miniaturas de evidências que foram salvas em formato string
  let fotosHtml = '';
  if (att.fotos && att.fotos.length > 0) {
    att.fotos.forEach(fotoBase64 => {
      fotosHtml += `
        <div class="photo-thumb" style="position: relative; width: 80px; height: 80px;">
          <img src="${fotoBase64}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" alt="Evidência Registrada" />
        </div>`;
    });
  } else {
    fotosHtml = '<span style="color: #94A3B8; font-style: italic; font-size: 13px;">Nenhuma evidência anexada.</span>';
  }

  div.innerHTML = `
    <div class="registro-preenchimento-header" style="background: #f0fdf4;">
      <span class="registro-status-titulo" style="color: #16a34a;">✅ ${numeroFormatado} - ATENDIMENTO SALVO E REGISTRADO</span>
    </div>
    <div class="entry-body" style="background: #fafafa; opacity: 0.95;">
      <div class="form-grid">
        <div class="form-group"><strong>Data:</strong> <p>${att.data}</p></div>
        <div class="form-group"><strong>Início:</strong> <p>${att.inicio}</p></div>
        <div class="form-group"><strong>Fim:</strong> <p>${att.fim}</p></div>
        <div class="form-group"><strong>Modalidade:</strong> <p style="text-transform: capitalize;">${att.modalidade}</p></div>
        <div class="form-group full"><strong>Assunto:</strong> <p>${att.assunto}</p></div>
        <div class="form-group full"><strong>Descrição:</strong> <p style="white-space: pre-line;">${att.descricao}</p></div>
        <div class="form-group full">
          <strong>Evidências Registradas:</strong>
          <div style="display: flex; gap: 10px; margin-top: 8px; flex-wrap: wrap;">${fotosHtml}</div>
        </div>
      </div>
    </div>
  `;
  list.appendChild(div);
}

function finalizeAttendance() {
  const nomeEmpresaAtiva = document.getElementById('projeto-ativo-id').value;
  
  if (!nomeEmpresaAtiva) {
    alert("Nenhum projeto ativo selecionado para salvar.");
    return;
  }

  // Localiza o projeto no nosso array global
  const projetoIndex = bancoEmpreendimentos.findIndex(emp => emp.nomeEmpresa.trim() === nomeEmpresaAtiva.trim());

  if (projetoIndex === -1) {
    alert("Erro ao localizar o empreendimento ativo.");
    return;
  }

  // Captura todos os blocos de atendimento que estão abertos na tela
  const cardsAtendimento = document.querySelectorAll('#attendanceList .attendance-entry');
  const atendimentosColetados = [];

  cardsAtendimento.forEach(card => {
    // Captura os inputs de dentro do card, ignorando se for um card puramente estático já salvo
    const inputData = card.querySelector('.att-data');
    if (!inputData) return; // Se for um já gravado, pula

    const inputInicio = card.querySelector('.att-inicio').value;
    const inputFim = card.querySelector('.att-fim').value;
    const inputModalidade = card.querySelector('.att-modalidade').value;
    const inputAssunto = card.querySelector('.att-assunto').value;
    const inputDesc = card.querySelector('.att-desc').value;

    // Varre e guarda as fotos anexadas (que já estão convertidas em base64 no preview)
    const imagensDoCard = card.querySelectorAll('.photo-preview img');
    const fotosDoCard = [];
    imagensDoCard.forEach(img => {
      fotosDoCard.push(img.src);
    });

    // Validação mínima de preenchimento dos campos obrigatórios
    if (!inputAssunto || !inputDesc) {
      return; 
    }

    atendimentosColetados.push({
      data: inputData.value,
      inicio: inputInicio || '--:--',
      fim: inputFim || '--:--',
      modalidade: inputModalidade,
      assunto: inputAssunto,
      descricao: inputDesc,
      fotos: fotosDoCard
    });
  });

  // Se o projeto nunca teve a lista de atendimentos iniciada, criamos ela vazia
  if (!bancoEmpreendimentos[projetoIndex].atendimentos) {
    bancoEmpreendimentos[projetoIndex].atendimentos = [];
  }

  // Junta os novos atendimentos preenchidos aos já existentes do projeto
  bancoEmpreendimentos[projetoIndex].atendimentos = [
    ...bancoEmpreendimentos[projetoIndex].atendimentos, 
    ...atendimentosColetados
  ];

  // Salva de forma definitiva no LocalStorage corporativo do navegador
  localStorage.setItem('fiap_empreendimentos', JSON.stringify(bancoEmpreendimentos));

  alert("Histórico de atendimentos salvo e sincronizado com sucesso com o banco de dados corporativo!");
  
  // Atualiza a visualização reabrindo o bloco para exibir os cards travados como salvos
  abrirAtendimentosDoProjeto(bancoEmpreendimentos[projetoIndex].nomeEmpresa, bancoEmpreendimentos[projetoIndex].nomeResponsavel);
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
    telefone: telComInput.value || telPesInput.value || 'Não informado',
    atendimentos: [] // Inicializa a lista de atendimentos vazia
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
renderizarListaEmpreendimentos();