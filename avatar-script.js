// 形象管理页面交互脚本

// 全局状态管理
const avatarState = {
    currentAgentName: '',
    currentAgentId: '',
    isDynamicEnabled: false,
    uploadedFiles: {
        background: null,
        listening: null,
        speaking: null,
        standby: null,
        idle: null
    },
    currentPanel: 'static' // static, disabled, enabled
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeAvatarManagement();
});

// 初始化形象管理页面
function initializeAvatarManagement() {
    // 从本地存储获取当前智能体信息
    avatarState.currentAgentName = localStorage.getItem('currentAgentName') || '智能助手';
    avatarState.currentAgentId = localStorage.getItem('currentAgentId') || '7522796173642266070';
    
    // 更新页面显示的智能体名称
    updateAgentName();
    
    // 初始化面板状态
    showPanel('static');
    
    // 初始化文件上传事件
    initializeFileUploads();
    
    // 初始化开关状态同步
    initializeToggleSync();
    
    console.log('形象管理页面初始化完成');
}

// 更新页面显示的智能体名称
function updateAgentName() {
    const agentNameElement = document.getElementById('current-agent-name');
    if (agentNameElement) {
        agentNameElement.textContent = avatarState.currentAgentName;
    }
    
    // 更新静态形象图片（模拟根据智能体ID获取不同图片）
    const staticAvatarImg = document.getElementById('static-avatar-img');
    if (staticAvatarImg) {
        const colors = {
            '7522796173642266070': '4F46E5',
            '7522796174255066070': '10B981',
            '7522796174255066071': 'F59E0B'
        };
        const color = colors[avatarState.currentAgentId] || '4F46E5';
        staticAvatarImg.src = `https://via.placeholder.com/120x120/${color}/white?text=AI`;
    }
}

// 切换动态形象开关
function toggleDynamicAvatar() {
    const toggles = document.querySelectorAll('#dynamic-toggle, #dynamic-toggle-2, #dynamic-toggle-3');
    
    // 获取当前开关状态
    const currentToggle = event.target;
    const isEnabled = currentToggle.checked;
    
    // 同步所有开关状态
    toggles.forEach(toggle => {
        toggle.checked = isEnabled;
    });
    
    avatarState.isDynamicEnabled = isEnabled;
    
    if (isEnabled) {
        showPanel('enabled');
        showToast('动态形象已开启，请上传所需资源', 'info');
    } else {
        showPanel('disabled');
        showToast('动态形象已关闭', 'warning');
        
        // 清空已上传的文件
        clearUploadedFiles();
    }
    
    updateSaveButtonState();
}

// 显示指定面板
function showPanel(panelType) {
    const panels = {
        'static': document.getElementById('static-avatar-panel'),
        'disabled': document.getElementById('dynamic-disabled-panel'),
        'enabled': document.getElementById('dynamic-enabled-panel')
    };
    
    // 隐藏所有面板
    Object.values(panels).forEach(panel => {
        if (panel) panel.classList.remove('active');
    });
    
    // 显示指定面板
    if (panels[panelType]) {
        panels[panelType].classList.add('active');
        avatarState.currentPanel = panelType;
        
        console.log(`切换到面板: ${panelType}`);
    }
}

// 初始化文件上传事件
function initializeFileUploads() {
    const uploadTypes = ['background', 'listening', 'speaking', 'standby', 'idle'];
    
    uploadTypes.forEach(type => {
        const uploadInput = document.getElementById(`${type}-upload`);
        if (uploadInput) {
            uploadInput.addEventListener('change', (event) => {
                handleFileUpload(event.target, type);
            });
        }
    });
}

// 处理文件上传
function handleFileUpload(input, type) {
    const file = input.files[0];
    if (!file) return;
    
    // 验证文件类型
    const allowedTypes = type === 'background' ? 
        ['image/jpeg', 'image/png', 'image/jpg'] : 
        ['image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
        showToast(`${type === 'background' ? '背景图' : '表情动图'}格式不正确`, 'error');
        input.value = '';
        return;
    }
    
    // 验证文件大小（2MB限制）
    if (file.size > 2 * 1024 * 1024) {
        showToast('文件大小不能超过2MB', 'error');
        input.value = '';
        return;
    }
    
    // 读取文件并显示预览
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewContainer = document.getElementById(`${type}-preview`);
        if (previewContainer) {
            // 清空原有内容
            previewContainer.innerHTML = '';
            
            // 创建图片预览
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = `${type}预览`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            
            previewContainer.appendChild(img);
            previewContainer.classList.add('has-file');
            
            // 存储文件信息
            avatarState.uploadedFiles[type] = {
                file: file,
                url: e.target.result,
                name: file.name
            };
            
            showToast(`${getTypeDisplayName(type)}上传成功`, 'success');
            
            // 更新保存按钮状态
            updateSaveButtonState();
            
            // 更新配置状态提示
            updateConfigStatus();
        }
    };
    
    reader.readAsDataURL(file);
}

// 获取类型显示名称
function getTypeDisplayName(type) {
    const names = {
        'background': '背景图',
        'listening': '聆听表情',
        'speaking': '回答表情',
        'standby': '待机表情',
        'idle': '空闲表情'
    };
    return names[type] || type;
}

// 更新保存按钮状态
function updateSaveButtonState() {
    const saveBtn = document.getElementById('save-btn');
    if (!saveBtn) return;
    
    const isComplete = checkResourceComplete();
    saveBtn.disabled = !isComplete;
    
    if (isComplete) {
        saveBtn.textContent = '保存配置';
        saveBtn.classList.remove('btn-secondary');
        saveBtn.classList.add('btn-primary');
    } else {
        saveBtn.textContent = '请完成资源上传';
        saveBtn.classList.remove('btn-primary');
        saveBtn.classList.add('btn-secondary');
    }
}

// 检查资源完整性
function checkResourceComplete() {
    if (!avatarState.isDynamicEnabled) return false;
    
    const requiredFiles = ['background', 'listening', 'speaking', 'standby', 'idle'];
    return requiredFiles.every(type => avatarState.uploadedFiles[type] !== null);
}

// 更新配置状态提示
function updateConfigStatus() {
    const statusElement = document.getElementById('config-status');
    if (!statusElement) return;
    
    const missingFiles = [];
    const requiredFiles = ['background', 'listening', 'speaking', 'standby', 'idle'];
    
    requiredFiles.forEach(type => {
        if (!avatarState.uploadedFiles[type]) {
            missingFiles.push(getTypeDisplayName(type));
        }
    });
    
    if (missingFiles.length === 0) {
        statusElement.innerHTML = '<i class="icon-info">✅</i><span>所有资源已上传完成</span>';
        statusElement.className = 'status-message success';
    } else {
        statusElement.innerHTML = `<i class="icon-info">ℹ️</i><span>还需上传：${missingFiles.join('、')}</span>`;
        statusElement.className = 'status-message info';
    }
}

// 保存配置
function saveConfiguration() {
    if (!checkResourceComplete()) {
        showToast('请先上传所有必需的资源文件', 'error');
        return;
    }
    
    // 模拟保存过程
    const saveBtn = document.getElementById('save-btn');
    const originalText = saveBtn.textContent;
    
    saveBtn.disabled = true;
    saveBtn.textContent = '保存中...';
    
    // 模拟API调用
    setTimeout(() => {
        // 保存成功
        showToast('动态形象配置保存成功！', 'success');
        
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
        
        // 更新本地存储
        const configData = {
            agentId: avatarState.currentAgentId,
            agentName: avatarState.currentAgentName,
            isDynamicEnabled: true,
            uploadedFiles: avatarState.uploadedFiles,
            configTime: new Date().toISOString()
        };
        
        localStorage.setItem(`avatarConfig_${avatarState.currentAgentId}`, JSON.stringify(configData));
        
        console.log('配置已保存:', configData);
        
    }, 2000);
}

// 预览玩具屏幕效果
function previewToyScreen() {
    // 保存当前配置到本地存储以供预览页面使用
    const previewData = {
        agentName: avatarState.currentAgentName,
        agentId: avatarState.currentAgentId,
        isDynamicEnabled: avatarState.isDynamicEnabled,
        uploadedFiles: avatarState.uploadedFiles,
        isResourceComplete: checkResourceComplete()
    };
    
    localStorage.setItem('previewData', JSON.stringify(previewData));
    
    showToast('正在打开玩具端预览...', 'info');
    
    setTimeout(() => {
        window.location.href = 'toy-preview.html';
    }, 1000);
}

// 返回智能体列表
function goBack() {
    showToast('返回智能体列表...', 'info');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// 清空已上传的文件
function clearUploadedFiles() {
    Object.keys(avatarState.uploadedFiles).forEach(type => {
        avatarState.uploadedFiles[type] = null;
        
        // 重置预览容器
        const previewContainer = document.getElementById(`${type}-preview`);
        if (previewContainer) {
            previewContainer.classList.remove('has-file');
            previewContainer.innerHTML = `
                <div class="upload-placeholder">
                    <i class="icon-upload">${getUploadIcon(type)}</i>
                    <span>${getUploadText(type)}</span>
                    <input type="file" id="${type}-upload" accept="${getAcceptType(type)}" onchange="handleFileUpload(this, '${type}')">
                </div>
            `;
        }
    });
    
    updateSaveButtonState();
    updateConfigStatus();
}

// 获取上传图标
function getUploadIcon(type) {
    const icons = {
        'background': '📁',
        'listening': '🎧',
        'speaking': '💬',
        'standby': '😊',
        'idle': '😴'
    };
    return icons[type] || '📁';
}

// 获取上传文本
function getUploadText(type) {
    const texts = {
        'background': '点击上传背景图',
        'listening': '上传聆听动图',
        'speaking': '上传回答动图',
        'standby': '上传待机动图',
        'idle': '上传空闲动图'
    };
    return texts[type] || '点击上传';
}

// 获取接受的文件类型
function getAcceptType(type) {
    return type === 'background' ? 'image/*' : 'image/gif';
}

// 初始化开关状态同步
function initializeToggleSync() {
    const toggles = document.querySelectorAll('#dynamic-toggle, #dynamic-toggle-2, #dynamic-toggle-3');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', toggleDynamicAvatar);
    });
}

// 显示提示消息
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) {
        const newToast = document.createElement('div');
        newToast.id = 'toast';
        newToast.className = 'toast';
        document.body.appendChild(newToast);
    }
    
    const toastElement = document.getElementById('toast');
    toastElement.textContent = message;
    toastElement.className = `toast ${type}`;
    
    setTimeout(() => {
        toastElement.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toastElement.classList.remove('show');
    }, 3000);
}

// 导出全局函数供HTML调用
window.toggleDynamicAvatar = toggleDynamicAvatar;
window.handleFileUpload = handleFileUpload;
window.saveConfiguration = saveConfiguration;
window.previewToyScreen = previewToyScreen;
window.goBack = goBack;