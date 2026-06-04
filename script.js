let attendanceCount = 0;

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
          <input type="date" value="2026-06-01" />
        </div>
        
        <div class="form-group">
          <label>Horário de Início *</label>
          <input type="time" />
        </div>

        <div class="form-group">
          <label>Horário de Fim *</label>
          <input type="time" />
        </div>
        
        <div class="form-group">
          <label>Modalidade *</label>
          <select>
            <option value="online" selected>Online</option>
            <option value="presencial">Presencial</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>
        
        <div class="form-group full">
          <label>Assunto da Mentoria *</label>
          <input type="text" placeholder="Ex: Ajuste de Pitch, Validação Comercial, UX/UI..." />
        </div>

        <div class="form-group full">
          <label>Equipe de Mentores Vinculados * <span style="font-weight: normal; font-size: 0.75rem; color: #64748B;">(Segure CTRL para múltiplos)</span></label>
          <select multiple style="height: 80px; padding: 5px;">
            <option value="1">Prof. Coordenador FIAP (Coordenador)</option>
            <option value="2">Aline Mendes (Mentor)</option>
            <option value="3">Rosemere Melo (Administrador)</option>
          </select>
        </div>
        
        <div class="form-group full">
          <label>Descrição Detalhada das Ações Realizadas *</label>
          <textarea placeholder="Relate as decisões tomadas..."></textarea>
        </div>
        
        <div class="form-group full">
          <label>Evidências do Atendimento (Máximo 5 fotos)</label>
          <label class="photo-upload-area" for="file-${seq}">
            <input type="file" id="file-${seq}" accept="image/*" multiple onchange="handlePhotos(event, 'preview-${seq}')" />
            <div style="color: #64748B; font-size: 0.9rem;">
              <span style="background: #E2E8F0; padding: 5px 10px; border: 1px solid #CBD5E1; border-radius: 4px; color: #334155; margin-right: 8px; font-weight: bold;">Escolher Arquivos</span> Nenhum arquivo escolhido
            </div>
          </label>
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
  // 1. Capturar os elementos dos inputs do formulário unificado
  const nomeEmpresaInput = document.querySelector('input[placeholder="Nome fantasia ou marca"]');
  const cnpjInput = document.getElementById('cnpj');
  const telComInput = document.getElementById('tel-com');
  const enderecoInput = document.querySelector('input[placeholder="Rua, Número, Bairro"]');
  const demandaInput = document.querySelector('textarea[placeholder="O que buscam resolver?"]');
  
  const nomeRespInput = document.querySelector('input[placeholder="Nome completo"]');
  const cpfInput = document.getElementById('cpf');
  const emailInput = document.querySelector('input[placeholder="responsavel@email.com"]');
  const telPesInput = document.getElementById('tel-pes');

  // 2. Validação simples de campos obrigatórios
  if (!nomeEmpresaInput.value || !nomeRespInput.value || !emailInput.value) {
    alert("Por favor, preencha os campos obrigatórios (Nome da Empresa, Nome do Responsável e E-mail)!");
    return;
  }

  // 3. Tornar visível a seção de Banco de Empreendimentos se estiver oculta
  const secaoBanco = document.getElementById('secao-banco-empreendimentos');
  secaoBanco.style.display = 'block';

  // Guardar os valores em variáveis de texto limpas para passar com segurança na string do onclick
  const nomeEmpresaValor = nomeEmpresaInput.value.replace(/'/g, "\\'");
  const nomeRespValor = nomeRespInput.value.replace(/'/g, "\\'");

  // 4. Criar a estrutura HTML com o onclick CORRIGIDO chamando a função abrirAtendimentosDoProjeto
  const listaSalvos = document.getElementById('lista-empreendimentos-salvos');
  const novaLinha = document.createElement('div');
  novaLinha.className = 'empreendimento-linha';

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
      <button class="btn-abrir-atendimentos" type="button" onclick="abrirAtendimentosDoProjeto('${nomeEmpresaValor}', '${nomeRespValor}')">Abrir Atendimentos</button>
      <button class="btn-pdf-vermelho" type="button" title="Gerar PDF">📄</button>
    </div>
  `;

  // Adicionar o novo item ao final da lista do banco
  listaSalvos.appendChild(novaLinha);

  // 5. Exibir o Toast de Sucesso nativo da sua aplicação
  const toast = document.getElementById('toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }

  // 6. Limpar o formulário de qualificação para permitir novos cadastros
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
  // Captura o corpo do formulário e o botão
  const formBody = document.querySelector('.card-unificado .card-unificado-body');
  const btnMinimizar = document.getElementById('btn-minimizar-form');
  
  if (!formBody || !btnMinimizar) return;

  // Se estiver visível (ou se não houver estilo inline definido ainda), esconde
  if (formBody.style.display === '' || formBody.style.display === 'block') {
    formBody.style.display = 'none';
    btnMinimizar.innerText = '+ Expandir Formulário';
    
    // Altera a cor do botão para verde igual ao seu padrão visual quando recolhido
    btnMinimizar.style.backgroundColor = '#28a745'; 
  } else {
    // Se estiver escondido, mostra novamente
    formBody.style.display = 'block';
    btnMinimizar.innerText = '— Minimizar Formulário';
    
    // Restaura a cor original (deixe vazio se o estilo padrão já vier do CSS)
    btnMinimizar.style.backgroundColor = ''; 
  }
}

function abrirAtendimentosDoProjeto(nomeEmpresa, nomeResponsavel) {
  // 1. Mostra o bloco de atendimentos que estava escondido
  const blocoAtendimentos = document.getElementById('bloco-atendimentos');
  blocoAtendimentos.style.display = 'block';
  
  // 2. Atualiza textualmente o cabeçalho azul com os dados dinâmicos
  document.getElementById('projeto-atendimento-nome').innerText = `${nomeEmpresa} (Resp: ${nomeResponsavel})`;
  
  // 3. Limpa históricos anteriores que estavam abertos na tela antes de listar os novos
  document.getElementById('attendanceList').innerHTML = '';
  
  // 4. Cria automaticamente o primeiro card de atendimento em branco para começar a preencher
  addAttendance();
  
  // 5. Dá um foco visual rolando a página até o bloco de atendimentos
  blocoAtendimentos.scrollIntoView({ behavior: 'smooth' });
}