let attendanceCount = 0;

function addAttendance() {
  attendanceCount++;
  const seq = attendanceCount;
  const list = document.getElementById('attendanceList');
  const id = `att-${seq}`;

  const div = document.createElement('div');
  div.className = 'attendance-entry';
  div.id = id;
  div.innerHTML = `
    <div class="entry-header">
      <span class="entry-seq">Atendimento #${seq}</span>
      <button class="btn-remove" onclick="removeAttendance('${id}')">✕ Remover</button>
    </div>
    <div class="entry-body">
      <div class="form-grid">
        <div class="form-group">
          <label>Data</label>
          <input type="date" />
        </div>
        <div class="form-group">
          <label>Horário</label>
          <input type="time" />
        </div>
        <div class="form-group">
          <label>Modalidade</label>
          <select>
            <option value="" disabled selected>Selecione…</option>
            <option value="presencial">Presencial</option>
            <option value="online">Online</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>
        <div class="form-group full">
          <label>Mentor(es)</label>
          <input type="text" placeholder="Nome(s) do(s) mentor(es)" />
        </div>
        <div class="form-group full">
          <label>Descrição Detalhada</label>
          <textarea placeholder="Descreva detalhadamente o que foi abordado neste atendimento…"></textarea>
        </div>
        <div class="form-group full">
          <label>Evidência do Atendimento (Fotos)</label>
          <label class="photo-upload-area" for="file-${seq}">
            <div class="upload-icon">📷</div>
            <p>Clique para selecionar fotos ou arraste aqui</p>
            <p style="font-size:0.75rem;opacity:0.6;margin-top:4px;">JPG, PNG, WEBP — múltiplas imagens aceitas</p>
            <input type="file" id="file-${seq}" accept="image/*" multiple onchange="handlePhotos(event,'preview-${seq}')" />
          </label>
          <div class="photo-preview" id="preview-${seq}"></div>
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

function handlePhotos(event, previewId) {
  const preview = document.getElementById(previewId);
  const files = Array.from(event.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const thumb = document.createElement('div');
      thumb.className = 'photo-thumb';
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = file.name;
      const btn = document.createElement('button');
      btn.className = 'remove-photo';
      btn.innerHTML = '✕';
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
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// Adiciona o primeiro atendimento automaticamente ao carregar
addAttendance();