// 玩具端预览页面JavaScript功能

// 全局变量
let currentMode = 'static'; // static, dynamic
let currentExpression = 'listening'; // listening, answering, waiting, idle
let agentConfig = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePreview();
});

// 初始化预览页面
function initializePreview() {
    // 获取URL参数中的智能体ID
    const urlParams = new URLSearchParams(window.location.search);
    const agentId = urlParams.get('id');
    
    if (agentId) {
        updateAgentInfo(agentId);
        loadAgentConfig(agentId);
    }
    
    // 设置默认显示
    showStaticMode();
}

// 更新智能体信息
function updateAgentInfo(agentId) {
    const agentNameElement = document.getElementById('previewAgentName');
    const agentIdElement = document.getElementById('previewAgentId');
    
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
    // 尝试从sessionStorage获取配置
    const storedConfig = sessionStorage.getItem('agentConfig');
    if (storedConfig) {
        agentConfig = JSON.parse(storedConfig);
        updateConfigDisplay(agentConfig);
        
        if (agentConfig.dynamicEnabled && agentConfig.resourcesComplete) {
            showDynamicMode();
        } else {
            showStaticMode();
        }
    } else {
        // 模拟从服务器获取配置
        agentConfig = getAgentConfig(agentId);
        updateConfigDisplay(agentConfig);
        
        if (agentConfig.dynamicEnabled && agentConfig.resourcesComplete) {
            showDynamicMode();
        } else {
            showStaticMode();
        }
    }
}

// 获取智能体配置（模拟数据）
function getAgentConfig(agentId) {
    // 模拟不同智能体的配置状态
    const configs = {
        '1001': { 
            dynamicEnabled: false, 
            resourcesComplete: false, 
            resources: {} 
        },
        '1002': { 
            dynamicEnabled: true, 
            resourcesComplete: false, 
            resources: {} 
        },
        '1003': { 
            dynamicEnabled: true, 
            resourcesComplete: true, 
            resources: {
                background: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM0Q0Y1RjAiLz4KPC9zdmc+',
                listening: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNFNzRDM0MiLz4KPC9zdmc+',
                answering: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiMyN0FFNjAiLz4KPC9zdmc+',
                waiting: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNGMzlDM0UiLz4KPC9zdmc+',
                idle: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM5NUExQTYiLz4KPC9zdmc+'
            }
        }
    };
    
    return configs[agentId] || { dynamicEnabled: false, resourcesComplete: false, resources: {} };
}

// 更新配置显示
function updateConfigDisplay(config) {
    const statusElement = document.getElementById('configStatus');
    const backgroundElement = document.getElementById('configBackground');
    const expressionsElement = document.getElementById('configExpressions');
    const completenessElement = document.getElementById('configCompleteness');
    
    if (statusElement) {
        statusElement.textContent = config.dynamicEnabled ? '开启' : '关闭';
        statusElement.className = `config-value ${config.dynamicEnabled ? 'enabled' : 'disabled'}`;
    }
    
    if (backgroundElement) {
        const hasBackground = config.resources && config.resources.background;
        backgroundElement.textContent = hasBackground ? '已上传' : '未上传';
        backgroundElement.className = `config-value ${hasBackground ? 'complete' : 'incomplete'}`;
    }
    
    if (expressionsElement) {
        const hasAllExpressions = config.resources && 
            config.resources.listening && 
            config.resources.answering && 
            config.resources.waiting && 
            config.resources.idle;
        expressionsElement.textContent = hasAllExpressions ? '已上传' : '未上传';
        expressionsElement.className = `config-value ${hasAllExpressions ? 'complete' : 'incomplete'}`;
    }
    
    if (completenessElement) {
        completenessElement.textContent = config.resourcesComplete ? '完整' : '不完整';
        completenessElement.className = `config-value ${config.resourcesComplete ? 'complete' : 'incomplete'}`;
    }
}

// 显示静态模式
function showStaticMode() {
    currentMode = 'static';
    
    const staticDisplay = document.getElementById('staticDisplay');
    const dynamicDisplay = document.getElementById('dynamicDisplay');
    const screenStatus = document.getElementById('screenStatus');
    
    if (staticDisplay && dynamicDisplay) {
        staticDisplay.style.display = 'flex';
        dynamicDisplay.style.display = 'none';
    }
    
    if (screenStatus) {
        screenStatus.textContent = '静态形象模式';
    }
}

// 显示动态模式
function showDynamicMode() {
    if (!agentConfig || !agentConfig.resourcesComplete) {
        alert('动态形象资源不完整，无法切换到动态模式');
        return;
    }
    
    currentMode = 'dynamic';
    
    const staticDisplay = document.getElementById('staticDisplay');
    const dynamicDisplay = document.getElementById('dynamicDisplay');
    const screenStatus = document.getElementById('screenStatus');
    
    if (staticDisplay && dynamicDisplay) {
        staticDisplay.style.display = 'none';
        dynamicDisplay.style.display = 'flex';
    }
    
    if (screenStatus) {
        screenStatus.textContent = '动态形象模式';
    }
    
    // 设置背景和默认表情
    setBackgroundImage();
    setExpression('listening');
}

// 设置背景图片
function setBackgroundImage() {
    if (!agentConfig || !agentConfig.resources || !agentConfig.resources.background) {
        return;
    }
    
    const backgroundLayer = document.getElementById('backgroundLayer');
    if (backgroundLayer) {
        backgroundLayer.style.backgroundImage = `url(${agentConfig.resources.background})`;
    }
}

// 设置表情
function setExpression(expressionType) {
    if (!agentConfig || !agentConfig.resources) {
        return;
    }
    
    const expressionUrl = agentConfig.resources[expressionType];
    if (!expressionUrl) {
        return;
    }
    
    const expressionLayer = document.getElementById('expressionLayer');
    const expressionState = document.getElementById('expressionState');
    
    if (expressionLayer) {
        // 添加切换动画
        expressionLayer.classList.add('changing');
        
        setTimeout(() => {
            expressionLayer.style.backgroundImage = `url(${expressionUrl})`;
            expressionLayer.classList.remove('changing');
        }, 250);
    }
    
    if (expressionState) {
        const stateTexts = {
            'listening': '聆听状态',
            'answering': '回答状态',
            'waiting': '待机状态',
            'idle': '空闲状态'
        };
        expressionState.textContent = stateTexts[expressionType] || '未知状态';
    }
    
    currentExpression = expressionType;
}

// 模拟聆听状态
function simulateListening() {
    if (currentMode === 'dynamic') {
        setExpression('listening');
    } else {
        alert('当前为静态模式，请先切换到动态模式');
    }
}

// 模拟回答状态
function simulateAnswering() {
    if (currentMode === 'dynamic') {
        setExpression('answering');
    } else {
        alert('当前为静态模式，请先切换到动态模式');
    }
}

// 模拟待机状态
function simulateWaiting() {
    if (currentMode === 'dynamic') {
        setExpression('waiting');
    } else {
        alert('当前为静态模式，请先切换到动态模式');
    }
}

// 模拟空闲状态
function simulateIdle() {
    if (currentMode === 'dynamic') {
        setExpression('idle');
    } else {
        alert('当前为静态模式，请先切换到动态模式');
    }
}

// 切换到静态模式
function switchToStaticMode() {
    showStaticMode();
}

// 切换到动态模式
function switchToDynamicMode() {
    showDynamicMode();
}

// 返回形象管理页面
function goBack() {
    window.location.href = 'image-management.html' + window.location.search;
}

// 自动表情切换演示（可选功能）
function startAutoExpressionDemo() {
    if (currentMode !== 'dynamic') {
        return;
    }
    
    const expressions = ['listening', 'answering', 'waiting', 'idle'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
        setExpression(expressions[currentIndex]);
        currentIndex = (currentIndex + 1) % expressions.length;
    }, 2000);
    
    // 5秒后停止演示
    setTimeout(() => {
        clearInterval(interval);
    }, 10000);
}

// 导出函数到全局作用域
window.simulateListening = simulateListening;
window.simulateAnswering = simulateAnswering;
window.simulateWaiting = simulateWaiting;
window.simulateIdle = simulateIdle;
window.switchToStaticMode = switchToStaticMode;
window.switchToDynamicMode = switchToDynamicMode;
window.goBack = goBack;