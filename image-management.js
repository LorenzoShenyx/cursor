// 形象管理页面JavaScript功能

// 全局变量
let currentState = 'static'; // static, dynamic-off, dynamic-on
let uploadedFiles = {
    background: null,
    listening: null,
    answering: null,
    waiting: null,
    idle: null
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeImageManagement();
});

// 初始化形象管理页面
function initializeImageManagement() {
    // 获取URL参数中的智能体ID
    const urlParams = new URLSearchParams(window.location.search);
    const agentId = urlParams.get('id');
    
    if (agentId) {
        updateAgentInfo(agentId);
        loadAgentConfig(agentId);
    }
    
    // 设置上传区域点击事件
    setupUploadAreas();
    
    // 设置拖拽上传
    setupDragAndDrop();
}

// 更新智能体信息
function updateAgentInfo(agentId) {
    const agentNameElement = document.getElementById('agentName');
    const agentIdElement = document.getElementById('agentId');
    
    // 模拟从服务器获取智能体信息
    const agentInfo = getAgentInfo(agentId);
    
    if (agentNameElement) {
        agentNameElement.textContent = agentInfo.name;
    }
    if (agentIdElement) {
        agentIdElement.textContent = `ID: ${agentId}`;
    }
}

// 获取智能体信息（模拟数据）
function getAgentInfo(agentId) {
    const agents = {
        '1001': { name: '123123', category: '心理疏导' },
        '1002': { name: 'dndjdk', category: '教育辅导' },
        '1003': { name: '葫芦娃730', category: '娱乐陪伴' }
    };
    return agents[agentId] || { name: '未知智能体', category: '未知分类' };
}

// 加载智能体配置
function loadAgentConfig(agentId) {
    // 模拟从服务器获取配置
    const config = getAgentConfig(agentId);
    
    if (config.dynamicEnabled) {
        if (config.resourcesComplete) {
            switchToState('dynamic-on');
            loadUploadedResources(config.resources);
        } else {
            switchToState('dynamic-off');
        }
    } else {
        switchToState('static');
    }
}

// 获取智能体配置（模拟数据）
function getAgentConfig(agentId) {
    // 模拟不同智能体的配置状态
    const configs = {
        '1001': { dynamicEnabled: false, resourcesComplete: false, resources: {} },
        '1002': { dynamicEnabled: true, resourcesComplete: false, resources: {} },
        '1003': { dynamicEnabled: true, resourcesComplete: true, resources: {
            background: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM0Q0Y1RjAiLz4KPC9zdmc+',
            listening: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNFNzRDM0MiLz4KPC9zdmc+',
            answering: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiMyN0FFNjAiLz4KPC9zdmc+',
            waiting: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNGMzlDM0UiLz4KPC9zdmc+',
            idle: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM5NUExQTYiLz4KPC9zdmc+'
        }}
    };
    
    return configs[agentId] || { dynamicEnabled: false, resourcesComplete: false, resources: {} };
}

// 加载已上传的资源
function loadUploadedResources(resources) {
    if (resources.background) {
        uploadedFiles.background = resources.background;
        showUploadedFile('background', resources.background);
    }
    if (resources.listening) {
        uploadedFiles.listening = resources.listening;
        showUploadedFile('listening', resources.listening);
    }
    if (resources.answering) {
        uploadedFiles.answering = resources.answering;
        showUploadedFile('answering', resources.answering);
    }
    if (resources.waiting) {
        uploadedFiles.waiting = resources.waiting;
        showUploadedFile('waiting', resources.waiting);
    }
    if (resources.idle) {
        uploadedFiles.idle = resources.idle;
        showUploadedFile('idle', resources.idle);
    }
    
    checkResourceCompleteness();
}

// 设置上传区域点击事件
function setupUploadAreas() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    uploadAreas.forEach(area => {
        area.addEventListener('click', function() {
            const fileInput = this.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.click();
            }
        });
    });
}

// 设置拖拽上传
function setupDragAndDrop() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        area.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const fileInput = this.querySelector('input[type="file"]');
                if (fileInput) {
                    fileInput.files = files;
                    fileInput.dispatchEvent(new Event('change'));
                }
            }
        });
    });
}

// 切换到静态形象状态
function switchToStatic() {
    switchToState('static');
    // 关闭动态形象开关
    const toggle = document.getElementById('dynamicToggle');
    if (toggle) {
        toggle.checked = false;
    }
}

// 切换到动态形象状态
function switchToDynamic() {
    switchToState('dynamic-off');
    // 开启动态形象开关
    const toggle = document.getElementById('dynamicToggle');
    if (toggle) {
        toggle.checked = true;
    }
}

// 切换动态面板状态
function switchToState(state) {
    // 隐藏所有状态
    const states = document.querySelectorAll('.panel-state');
    states.forEach(s => s.style.display = 'none');
    
    // 显示目标状态
    const targetState = document.querySelector(`[data-state="${state}"]`);
    if (targetState) {
        targetState.style.display = 'block';
        currentState = state;
    }
}

// 切换动态形象开关
function toggleDynamic() {
    const toggle = document.getElementById('dynamicToggle');
    if (toggle && toggle.checked) {
        switchToState('dynamic-on');
    } else {
        switchToState('dynamic-off');
    }
}

// 处理背景图上传
function handleBackgroundUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (validateImageFile(file)) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedFiles.background = e.target.result;
                showUploadedFile('background', e.target.result);
                checkResourceCompleteness();
            };
            reader.readAsDataURL(file);
        } else {
            alert('请上传有效的图片文件（PNG、JPEG、JPG格式，不超过5MB）');
        }
    }
}

// 处理表情动图上传
function handleExpressionUpload(event, type) {
    const file = event.target.files[0];
    if (file) {
        if (validateImageFile(file)) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedFiles[type] = e.target.result;
                showUploadedFile(type, e.target.result);
                checkResourceCompleteness();
            };
            reader.readAsDataURL(file);
        } else {
            alert('请上传有效的图片文件（PNG、JPEG、JPG格式，不超过5MB）');
        }
    }
}

// 验证图片文件
function validateImageFile(file) {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
        return false;
    }
    
    if (file.size > maxSize) {
        return false;
    }
    
    return true;
}

// 显示已上传的文件
function showUploadedFile(type, dataUrl) {
    const placeholder = document.getElementById(`${type}Placeholder`);
    const preview = document.getElementById(`${type}Preview`);
    const image = document.getElementById(`${type}Image`);
    
    if (placeholder && preview && image) {
        placeholder.style.display = 'none';
        preview.style.display = 'flex';
        image.src = dataUrl;
    }
}

// 移除背景图
function removeBackground() {
    uploadedFiles.background = null;
    const placeholder = document.getElementById('backgroundPlaceholder');
    const preview = document.getElementById('backgroundPreview');
    
    if (placeholder && preview) {
        placeholder.style.display = 'flex';
        preview.style.display = 'none';
    }
    
    checkResourceCompleteness();
}

// 移除表情动图
function removeExpression(type) {
    uploadedFiles[type] = null;
    const placeholder = document.getElementById(`${type}Placeholder`);
    const preview = document.getElementById(`${type}Preview`);
    
    if (placeholder && preview) {
        placeholder.style.display = 'flex';
        preview.style.display = 'none';
    }
    
    checkResourceCompleteness();
}

// 检查资源完整性
function checkResourceCompleteness() {
    const hasBackground = uploadedFiles.background !== null;
    const hasListening = uploadedFiles.listening !== null;
    const hasAnswering = uploadedFiles.answering !== null;
    const hasWaiting = uploadedFiles.waiting !== null;
    const hasIdle = uploadedFiles.idle !== null;
    
    const isComplete = hasBackground && hasListening && hasAnswering && hasWaiting && hasIdle;
    
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.disabled = !isComplete;
    }
    
    return isComplete;
}

// 保存动态形象配置
function saveDynamicConfig() {
    if (!checkResourceCompleteness()) {
        showErrorModal('请上传背景图和4个表情动图');
        return;
    }
    
    // 模拟保存到服务器
    console.log('保存动态形象配置:', uploadedFiles);
    
    // 显示成功消息
    alert('动态形象配置保存成功！');
    
    // 更新配置状态
    currentState = 'dynamic-on';
    
    // 可以在这里跳转到预览页面
    // openPreview();
}

// 显示错误模态框
function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const messageElement = document.getElementById('errorMessage');
    
    if (modal && messageElement) {
        messageElement.textContent = message;
        modal.style.display = 'block';
    }
}

// 关闭错误模态框
function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 打开预览页面
function openPreview() {
    const urlParams = new URLSearchParams(window.location.search);
    const agentId = urlParams.get('id');
    
    if (agentId) {
        // 传递配置信息到预览页面
        const config = {
            dynamicEnabled: currentState === 'dynamic-on',
            resourcesComplete: checkResourceCompleteness(),
            resources: uploadedFiles
        };
        
        // 将配置存储到sessionStorage
        sessionStorage.setItem('agentConfig', JSON.stringify(config));
        
        // 跳转到预览页面
        window.open(`preview.html?id=${agentId}`, '_blank');
    }
}

// 返回列表页面
function goBack() {
    window.location.href = 'index.html';
}

// 点击模态框外部关闭
window.addEventListener('click', function(event) {
    const modal = document.getElementById('errorModal');
    if (event.target === modal) {
        closeErrorModal();
    }
});

// 键盘事件处理
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeErrorModal();
    }
});

// 导出函数到全局作用域
window.switchToStatic = switchToStatic;
window.switchToDynamic = switchToDynamic;
window.toggleDynamic = toggleDynamic;
window.handleBackgroundUpload = handleBackgroundUpload;
window.handleExpressionUpload = handleExpressionUpload;
window.removeBackground = removeBackground;
window.removeExpression = removeExpression;
window.saveDynamicConfig = saveDynamicConfig;
window.closeErrorModal = closeErrorModal;
window.openPreview = openPreview;
window.goBack = goBack;