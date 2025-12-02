// ═══════════════════════════════════════════════════════════════
// DOVEZI.JS - Sistem dovezi poze cu GPT API validation
// ═══════════════════════════════════════════════════════════════

let selectedFiles = [];
let currentEtapaUpload = null;

// ==========================================
// MODAL DOVEZI FUNCTIONS
// ==========================================

function deschideModalUpload(etapaId, etapaNume, checklist) {
    currentEtapaUpload = etapaId;
    selectedFiles = [];
    document.getElementById('modalDoveziTitle').textContent = 'Încarcă Poze';
    document.getElementById('modalDoveziSubtitle').textContent = etapaNume;
    document.getElementById('modalChecklist').innerHTML = '';
    document.getElementById('previewGrid').innerHTML = '';
    document.getElementById('aiResultContainer').innerHTML = '';
    document.getElementById('aiLoading').classList.remove('active');
    document.getElementById('btnTrimite').disabled = true;
    document.getElementById('modalDovezi').classList.add('active');
}

function inchideModalDovezi() {
    document.getElementById('modalDovezi').classList.remove('active');
    selectedFiles = [];
    currentEtapaUpload = null;
}

// ==========================================
// FILE HANDLING
// ==========================================

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    selectedFiles = files;
    const previewGrid = document.getElementById('previewGrid');
    previewGrid.innerHTML = '';
    
    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = 'preview-image';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button onclick="removeFile(${index})" style="position:absolute;top:5px;right:5px;background:rgba(239,68,68,0.9);color:white;border:none;width:25px;height:25px;border-radius:50%;cursor:pointer;">×</button>
            `;
            previewGrid.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
    
    document.getElementById('btnTrimite').disabled = false;
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    if (selectedFiles.length === 0) {
        document.getElementById('previewGrid').innerHTML = '';
        document.getElementById('btnTrimite').disabled = true;
    } else {
        // Re-render preview grid
        const event = { target: { files: selectedFiles } };
        handleFileSelect(event);
    }
}

// ==========================================
// UPLOAD CU GPT API VALIDATION
// ==========================================

function trimitePozeAI() {
    if (selectedFiles.length === 0) {
        alert('Selectează poze!');
        return;
    }
    
    document.getElementById('aiLoading').classList.add('active');
    document.getElementById('btnTrimite').disabled = true;
    
    // Progress bar animation
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        if (progress <= 90) {
            document.getElementById('progressFill').style.width = progress + '%';
            document.getElementById('progressFill').textContent = progress + '%';
        }
    }, 300);
    
    // Convert files to base64
    const promises = selectedFiles.map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({
                fileName: file.name,
                data: reader.result.split(',')[1],
                mimeType: file.type
            });
            reader.readAsDataURL(file);
        });
    });
    
    Promise.all(promises).then(poze => {
        // API call către backend care va folosi GPT API pentru validare
        apiCall('uploadPoze', {
            email: currentUser.code,
            evenimentId: currentRolDetalii.id,
            etapa: currentEtapaUpload,
            poze: JSON.stringify(poze)
        }, function(data) {
            clearInterval(progressInterval);
            document.getElementById('progressFill').style.width = '100%';
            document.getElementById('progressFill').textContent = '100%';
            
            setTimeout(() => {
                document.getElementById('aiLoading').classList.remove('active');
                
                if (data.success) {
                    // Success - poze validate de GPT API
                    document.getElementById('aiResultContainer').innerHTML = `
                        <div style="background:rgba(16,185,129,0.1);border:2px solid #10b981;border-radius:12px;padding:20px;margin:20px 0;">
                            <div style="font-size:40px;margin-bottom:10px;">✅</div>
                            <div style="font-size:20px;font-weight:700;color:#fff;">VALIDAT DE AI</div>
                            <div style="margin-top:10px;color:#94a3b8;font-size:14px;">
                                ${data.aiConfidence ? `Încredere: ${data.aiConfidence}%` : 'GPT API a validat pozele'}
                            </div>
                            <button class="btn-action primary" onclick="finalizareUpload()" style="width:100%;margin-top:15px;">✅ Finalizează</button>
                        </div>
                    `;
                } else {
                    // Error
                    document.getElementById('aiResultContainer').innerHTML = `
                        <div style="background:rgba(239,68,68,0.1);border:2px solid #ef4444;border-radius:12px;padding:20px;margin:20px 0;">
                            <div style="font-size:40px;margin-bottom:10px;">❌</div>
                            <div style="font-size:18px;font-weight:700;color:#fff;">RESPINS</div>
                            <div style="margin-top:10px;color:#fca5a5;font-size:14px;">
                                ${data.error || 'AI nu a putut valida pozele'}
                            </div>
                        </div>
                    `;
                    document.getElementById('btnTrimite').disabled = false;
                }
            }, 500);
        });
    });
}

function finalizareUpload() {
    inchideModalDovezi();
    incarcaDetaliiRol(currentRolDetalii.id);
}
