// 玩具端预览页面交互脚本

// 全局状态管理
const previewState = {
    agentName: '',
    agentId: '',
    isDynamicEnabled: false,
    uploadedFiles: {},
    isResourceComplete: false,
    currentDisplayMode: 'static', // static, dynamic
    currentEmotion: 'listening', // listening, speaking, standby, idle
    isAutoDemo: false,
    autoDemoInterval: null
};

// 表情切换顺序
const emotionSequence = ['listening', 'speaking', 'standby', 'idle'];
let emotionIndex = 0;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeToyPreview();
});

// 初始化玩具端预览页面
function initializeToyPreview() {
    // 从本地存储获取预览数据
    loadPreviewData();
    
    // 更新配置信息显示
    updateConfigInfo();
    
    // 初始化显示模式
    initializeDisplayMode();
    
    // 初始化控制按钮
    initializeControls();
    
    console.log('玩具端预览页面初始化完成');
}

// 加载预览数据
function loadPreviewData() {
    const previewDataStr = localStorage.getItem('previewData');
    
    if (previewDataStr) {
        const previewData = JSON.parse(previewDataStr);
        
        previewState.agentName = previewData.agentName;
        previewState.agentId = previewData.agentId;
        previewState.isDynamicEnabled = previewData.isDynamicEnabled;
        previewState.uploadedFiles = previewData.uploadedFiles || {};
        previewState.isResourceComplete = previewData.isResourceComplete;
        
        console.log('预览数据加载完成:', previewState);
    } else {
        // 使用默认数据
        previewState.agentName = '智能助手';
        previewState.agentId = '7522796173642266070';
        previewState.isDynamicEnabled = false;
        previewState.uploadedFiles = {};
        previewState.isResourceComplete = false;
        
        console.log('使用默认预览数据');
    }
}

// 更新配置信息显示
function updateConfigInfo() {
    // 更新智能体名称
    const agentNameElements = document.querySelectorAll('#toy-agent-name, #config-agent-name');
    agentNameElements.forEach(element => {
        if (element) element.textContent = previewState.agentName;
    });
    
    // 更新动态形象状态
    const dynamicStatusElement = document.getElementById('config-dynamic-status');
    if (dynamicStatusElement) {
        dynamicStatusElement.textContent = previewState.isDynamicEnabled ? '已开启' : '已关闭';
        dynamicStatusElement.style.color = previewState.isDynamicEnabled ? '#10b981' : '#ef4444';
    }
    
    // 更新资源完整性
    const resourceStatusElement = document.getElementById('config-resource-status');
    if (resourceStatusElement) {
        resourceStatusElement.textContent = previewState.isResourceComplete ? '完整' : '不完整';
        resourceStatusElement.style.color = previewState.isResourceComplete ? '#10b981' : '#ef4444';
    }
    
    // 更新加载策略
    const loadStrategyElement = document.getElementById('config-load-strategy');
    if (loadStrategyElement) {
        if (previewState.isDynamicEnabled && previewState.isResourceComplete) {
            loadStrategyElement.textContent = '动态形象优先';
            loadStrategyElement.style.color = '#10b981';
        } else {
            loadStrategyElement.textContent = '静态形象优先';
            loadStrategyElement.style.color = '#6b7280';
        }
    }
}

// 初始化显示模式
function initializeDisplayMode() {
    // 根据配置决定默认显示模式
    if (previewState.isDynamicEnabled && previewState.isResourceComplete) {
        previewState.currentDisplayMode = 'dynamic';
        document.querySelector('input[value="dynamic"]').checked = true;
        switchDisplayMode('dynamic');
    } else {
        previewState.currentDisplayMode = 'static';
        document.querySelector('input[value="static"]').checked = true;
        switchDisplayMode('static');
    }
    
    // 更新静态形象
    updateStaticAvatar();
    
    // 更新动态形象
    updateDynamicAvatar();
}

// 更新静态形象
function updateStaticAvatar() {
    const staticAvatarImg = document.getElementById('toy-static-avatar');
    if (staticAvatarImg) {
        const colors = {
            '7522796173642266070': '4F46E5',
            '7522796174255066070': '10B981',
            '7522796174255066071': 'F59E0B'
        };
        const color = colors[previewState.agentId] || '4F46E5';
        staticAvatarImg.src = `https://via.placeholder.com/200x200/${color}/white?text=AI`;
    }
}

// 更新动态形象
function updateDynamicAvatar() {
    // 更新背景图
    const backgroundImg = document.getElementById('toy-background-img');
    if (backgroundImg && previewState.uploadedFiles.background) {
        backgroundImg.src = previewState.uploadedFiles.background.url;
    }
    
    // 更新表情动图
    updateEmotionDisplay();
}

// 更新表情显示
function updateEmotionDisplay() {
    const emotionImg = document.getElementById('toy-emotion-img');
    const emotionStatus = document.getElementById('emotion-status');
    
    if (emotionImg && previewState.uploadedFiles[previewState.currentEmotion]) {
        emotionImg.src = previewState.uploadedFiles[previewState.currentEmotion].url;
    } else {
        // 使用占位图
        const emotionIcons = {
            'listening': '🎧',
            'speaking': '💬',
            'standby': '😊',
            'idle': '😴'
        };
        const icon = emotionIcons[previewState.currentEmotion] || '🎧';
        emotionImg.src = `https://via.placeholder.com/150x150/F59E0B/white?text=${encodeURIComponent(icon)}`;
    }
    
    if (emotionStatus) {
        const emotionNames = {
            'listening': '聆听状态',
            'speaking': '回答状态',
            'standby': '待机状态',
            'idle': '空闲状态'
        };
        emotionStatus.textContent = emotionNames[previewState.currentEmotion] || '聆听状态';
    }
}

// 切换显示模式
function switchDisplayMode(mode) {
    const staticDisplay = document.getElementById('toy-static-display');
    const dynamicDisplay = document.getElementById('toy-dynamic-display');
    const emotionControls = document.getElementById('emotion-controls');
    
    if (mode === 'static') {
        if (staticDisplay) staticDisplay.classList.add('active');
        if (dynamicDisplay) dynamicDisplay.classList.remove('active');
        if (emotionControls) emotionControls.style.display = 'none';
        
        previewState.currentDisplayMode = 'static';
        showToast('切换到静态形象显示', 'info');
        
    } else if (mode === 'dynamic') {
        if (!previewState.isDynamicEnabled || !previewState.isResourceComplete) {
            showToast('动态形象未配置完成，无法切换', 'warning');
            // 重置为静态模式
            document.querySelector('input[value="static"]').checked = true;
            return;
        }
        
        if (staticDisplay) staticDisplay.classList.remove('active');
        if (dynamicDisplay) dynamicDisplay.classList.add('active');
        if (emotionControls) emotionControls.style.display = 'block';
        
        previewState.currentDisplayMode = 'dynamic';
        showToast('切换到动态形象显示', 'info');
        
        // 更新动态形象
        updateDynamicAvatar();
    }
}

// 切换表情状态
function switchEmotion(emotion) {
    if (previewState.currentDisplayMode !== 'dynamic') {
        showToast('请先切换到动态形象模式', 'warning');
        return;
    }
    
    if (!previewState.uploadedFiles[emotion]) {
        showToast(`${getEmotionDisplayName(emotion)}资源未上传`, 'warning');
        return;
    }
    
    previewState.currentEmotion = emotion;
    updateEmotionDisplay();
    
    // 更新按钮状态
    const emotionButtons = document.querySelectorAll('.emotion-buttons .btn');
    emotionButtons.forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
    });
    
    event.target.classList.remove('btn-secondary');
    event.target.classList.add('btn-primary');
    
    showToast(`切换到${getEmotionDisplayName(emotion)}`, 'success');
}

// 获取表情显示名称
function getEmotionDisplayName(emotion) {
    const names = {
        'listening': '聆听状态',
        'speaking': '回答状态',
        'standby': '待机状态',
        'idle': '空闲状态'
    };
    return names[emotion] || emotion;
}

// 切换自动演示
function toggleAutoDemo() {
    const autoDemoBtn = document.getElementById('auto-demo-btn');
    
    if (previewState.isAutoDemo) {
        // 停止自动演示
        clearInterval(previewState.autoDemoInterval);
        previewState.isAutoDemo = false;
        
        if (autoDemoBtn) {
            autoDemoBtn.textContent = '开始演示';
            autoDemoBtn.classList.remove('btn-primary');
            autoDemoBtn.classList.add('btn-secondary');
        }
        
        showToast('自动演示已停止', 'info');
        
    } else {
        // 开始自动演示
        if (previewState.currentDisplayMode !== 'dynamic') {
            showToast('请先切换到动态形象模式', 'warning');
            return;
        }
        
        if (!previewState.isResourceComplete) {
            showToast('动态形象资源不完整，无法演示', 'warning');
            return;
        }
        
        previewState.isAutoDemo = true;
        emotionIndex = 0;
        
        // 立即切换到第一个表情
        switchEmotionAuto(emotionSequence[emotionIndex]);
        
        // 设置定时器，每3秒切换一次表情
        previewState.autoDemoInterval = setInterval(() => {
            emotionIndex = (emotionIndex + 1) % emotionSequence.length;
            switchEmotionAuto(emotionSequence[emotionIndex]);
        }, 3000);
        
        if (autoDemoBtn) {
            autoDemoBtn.textContent = '停止演示';
            autoDemoBtn.classList.remove('btn-secondary');
            autoDemoBtn.classList.add('btn-primary');
        }
        
        showToast('自动演示已开始', 'success');
    }
}

// 自动切换表情（不显示提示）
function switchEmotionAuto(emotion) {
    previewState.currentEmotion = emotion;
    updateEmotionDisplay();
    
    // 更新按钮状态
    const emotionButtons = document.querySelectorAll('.emotion-buttons .btn');
    emotionButtons.forEach((btn, index) => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
        
        if (btn.textContent.includes(getEmotionButtonText(emotion))) {
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
        }
    });
}

// 获取表情按钮文本
function getEmotionButtonText(emotion) {
    const texts = {
        'listening': '聆听',
        'speaking': '回答',
        'standby': '待机',
        'idle': '空闲'
    };
    return texts[emotion] || emotion;
}

// 初始化控制按钮
function initializeControls() {
    // 如果动态形象未配置完成，禁用相关控制
    if (!previewState.isDynamicEnabled || !previewState.isResourceComplete) {
        const dynamicRadio = document.querySelector('input[value="dynamic"]');
        if (dynamicRadio) {
            dynamicRadio.disabled = true;
        }
        
        const emotionButtons = document.querySelectorAll('.emotion-buttons .btn');
        emotionButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
    }
}

// 返回形象管理页面
function goBackToAvatarManagement() {
    showToast('返回形象管理页面...', 'info');
    
    // 停止自动演示
    if (previewState.isAutoDemo) {
        clearInterval(previewState.autoDemoInterval);
        previewState.isAutoDemo = false;
    }
    
    setTimeout(() => {
        window.location.href = 'avatar-management.html';
    }, 1000);
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

// 页面卸载时清理定时器
window.addEventListener('beforeunload', function() {
    if (previewState.autoDemoInterval) {
        clearInterval(previewState.autoDemoInterval);
    }
});

// 导出全局函数供HTML调用
window.switchDisplayMode = switchDisplayMode;
window.switchEmotion = switchEmotion;
window.toggleAutoDemo = toggleAutoDemo;
window.goBackToAvatarManagement = goBackToAvatarManagement;