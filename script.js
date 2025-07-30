// 主页面JavaScript功能

// 全局变量
let currentAgentId = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// 初始化页面
function initializePage() {
    // 设置字符计数器
    setupCharCounters();
    
    // 设置文件上传事件
    setupFileUploads();
    
    // 设置表单验证
    setupFormValidation();
}

// 设置字符计数器
function setupCharCounters() {
    const inputs = document.querySelectorAll('input[type="text"], textarea');
    inputs.forEach(input => {
        const maxLength = input.getAttribute('maxlength');
        if (maxLength) {
            const charCount = input.parentNode.querySelector('.char-count');
            if (charCount) {
                input.addEventListener('input', function() {
                    charCount.textContent = `${this.value.length}/${maxLength}`;
                });
            }
        }
    });
}

// 设置文件上传事件
function setupFileUploads() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    uploadAreas.forEach(area => {
        area.addEventListener('click', function() {
            const fileInput = this.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.click();
            }
        });
        
        // 拖拽上传
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

// 设置表单验证
function setupFormValidation() {
    const form = document.getElementById('addAgentForm');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

// 验证字段
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // 移除之前的错误状态
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
    
    // 验证必填字段
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, '此字段为必填项');
        return false;
    }
    
    // 验证特定字段
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, '请输入有效的邮箱地址');
        return false;
    }
    
    return true;
}

// 显示字段错误
function showFieldError(field, message) {
    field.classList.add('error');
    let errorMessage = field.parentNode.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        field.parentNode.appendChild(errorMessage);
    }
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// 清除字段错误
function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

// 验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 显示新增模态框
function showAddModal() {
    const modal = document.getElementById('addModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('addModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // 重置表单
        const form = document.getElementById('addAgentForm');
        if (form) {
            form.reset();
            // 清除错误状态
            const errorFields = form.querySelectorAll('.error');
            errorFields.forEach(field => {
                field.classList.remove('error');
            });
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(message => {
                message.style.display = 'none';
            });
        }
    }
}

// 编辑智能体
function editAgent(agentId) {
    currentAgentId = agentId;
    console.log('编辑智能体:', agentId);
    // 这里可以跳转到编辑页面或显示编辑模态框
    alert(`编辑智能体 ID: ${agentId}`);
}

// 使用设置
function usageSettings(agentId) {
    currentAgentId = agentId;
    console.log('使用设置:', agentId);
    // 这里可以跳转到使用设置页面
    alert(`使用设置 ID: ${agentId}`);
}

// 搜索功能
function searchAgents() {
    const nameInput = document.querySelector('.search-input');
    const categorySelect = document.querySelector('.search-select');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const category = categorySelect ? categorySelect.value : '';
    
    console.log('搜索条件:', { name, category });
    // 这里可以执行搜索逻辑
}

// 重置搜索
function resetSearch() {
    const nameInput = document.querySelector('.search-input');
    const categorySelect = document.querySelector('.search-select');
    
    if (nameInput) nameInput.value = '';
    if (categorySelect) categorySelect.value = '';
    
    console.log('重置搜索条件');
    // 这里可以重新加载数据
}

// 分页功能
function goToPage(pageNumber) {
    console.log('跳转到页面:', pageNumber);
    // 这里可以执行分页逻辑
}

// 同步功能
function syncAgents() {
    console.log('同步智能体数据');
    // 这里可以执行同步逻辑
    alert('正在同步智能体数据...');
}

// 使用设置功能
function openUsageSettings() {
    console.log('打开使用设置');
    // 这里可以打开使用设置页面
    alert('打开使用设置');
}

// AI生成图片
function generateAIImage() {
    console.log('AI生成图片');
    // 这里可以调用AI生成图片的API
    alert('正在生成AI图片...');
}

// 润色文本
function polishText() {
    const textarea = document.querySelector('textarea[placeholder*="智能体能力说明与限制"]');
    if (textarea) {
        console.log('润色文本:', textarea.value);
        // 这里可以调用文本润色的API
        alert('正在润色文本...');
    }
}

// 点击模态框外部关闭
window.addEventListener('click', function(event) {
    const modal = document.getElementById('addModal');
    if (event.target === modal) {
        closeModal();
    }
});

// 键盘事件处理
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// 导出功能（可选）
window.editAgent = editAgent;
window.usageSettings = usageSettings;
window.showAddModal = showAddModal;
window.closeModal = closeModal;