// 主页面交互脚本

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeMainPage();
});

// 初始化主页面
function initializeMainPage() {
    console.log('智能体管理平台初始化完成');
    
    // 初始化分页按钮
    initializePagination();
    
    // 初始化表格行悬停效果
    initializeTableHover();
}

// 打开形象管理页面
function openAvatarManagement(agentName) {
    // 存储当前智能体名称到本地存储
    localStorage.setItem('currentAgentName', agentName);
    localStorage.setItem('currentAgentId', getCurrentAgentId(agentName));
    
    // 显示提示
    showToast(`正在打开 ${agentName} 的形象管理页面...`, 'info');
    
    // 延迟跳转以显示提示
    setTimeout(() => {
        window.location.href = 'avatar-management.html';
    }, 1000);
}

// 根据智能体名称获取ID（模拟）
function getCurrentAgentId(agentName) {
    const agentIds = {
        '智能助手': '7522796173642266070',
        'SHGPT': '7522796174255066070',
        '测试助手': '7522796174255066071'
    };
    return agentIds[agentName] || '7522796173642266070';
}

// 初始化分页功能
function initializePagination() {
    const pageButtons = document.querySelectorAll('.page-btn');
    
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有活动状态
            pageButtons.forEach(btn => btn.classList.remove('active'));
            
            // 添加当前按钮的活动状态
            this.classList.add('active');
            
            // 模拟页面切换
            const pageNum = this.textContent;
            showToast(`切换到第 ${pageNum} 页`, 'info');
            
            // 这里可以添加实际的数据加载逻辑
            loadPageData(pageNum);
        });
    });
    
    // 设置第一页为默认活动页
    if (pageButtons.length > 0) {
        pageButtons[0].classList.add('active');
    }
}

// 加载页面数据（模拟）
function loadPageData(pageNum) {
    console.log(`加载第 ${pageNum} 页数据`);
    
    // 模拟加载延迟
    const tableBody = document.querySelector('.agent-table tbody');
    if (tableBody) {
        tableBody.style.opacity = '0.5';
        
        setTimeout(() => {
            tableBody.style.opacity = '1';
            console.log(`第 ${pageNum} 页数据加载完成`);
        }, 500);
    }
}

// 初始化表格悬停效果
function initializeTableHover() {
    const tableRows = document.querySelectorAll('.agent-table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(2px)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// 搜索功能
function performSearch() {
    const searchInputs = document.querySelectorAll('.breadcrumb input, .breadcrumb select');
    let searchParams = {};
    
    searchInputs.forEach(input => {
        if (input.value) {
            searchParams[input.name || input.id] = input.value;
        }
    });
    
    console.log('搜索参数:', searchParams);
    showToast('搜索功能执行中...', 'info');
    
    // 模拟搜索结果
    setTimeout(() => {
        showToast('搜索完成', 'success');
    }, 1500);
}

// 重置搜索
function resetSearch() {
    const searchInputs = document.querySelectorAll('.breadcrumb input, .breadcrumb select');
    
    searchInputs.forEach(input => {
        input.value = '';
    });
    
    showToast('搜索条件已重置', 'info');
    
    // 重新加载数据
    loadPageData(1);
}

// 新增智能体
function addNewAgent() {
    showToast('新增智能体功能开发中...', 'warning');
}

// 批量操作
function batchOperation() {
    showToast('批量操作功能开发中...', 'warning');
}

// 导入/导出
function importExport() {
    showToast('导入/导出功能开发中...', 'warning');
}

// 编辑智能体
function editAgent(agentName) {
    showToast(`编辑 ${agentName} 功能开发中...`, 'warning');
}

// 使用设置
function agentSettings(agentName) {
    showToast(`${agentName} 使用设置功能开发中...`, 'warning');
}

// 显示提示消息
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) {
        // 如果没有toast元素，创建一个
        const newToast = document.createElement('div');
        newToast.id = 'toast';
        newToast.className = 'toast';
        document.body.appendChild(newToast);
    }
    
    const toastElement = document.getElementById('toast');
    toastElement.textContent = message;
    toastElement.className = `toast ${type}`;
    
    // 显示toast
    setTimeout(() => {
        toastElement.classList.add('show');
    }, 100);
    
    // 3秒后隐藏toast
    setTimeout(() => {
        toastElement.classList.remove('show');
    }, 3000);
}

// 侧边栏导航点击事件
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // 添加当前项的活动状态
            this.classList.add('active');
            
            const navText = this.querySelector('span').textContent;
            if (navText !== '智能体列表') {
                showToast(`${navText} 功能开发中...`, 'warning');
            }
        });
    });
});

// 导出全局函数供HTML调用
window.openAvatarManagement = openAvatarManagement;
window.performSearch = performSearch;
window.resetSearch = resetSearch;
window.addNewAgent = addNewAgent;
window.batchOperation = batchOperation;
window.importExport = importExport;
window.editAgent = editAgent;
window.agentSettings = agentSettings;