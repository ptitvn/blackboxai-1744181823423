// Global variables
let currentUser = null;
let budgets = [];
let categories = [];
let transactions = [];

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateUI();
});

loginBtn.addEventListener('click', showLoginForm);
registerBtn.addEventListener('click', showRegisterForm);

// Data Management
function loadData() {
    // Load data from localStorage
    const userData = localStorage.getItem('currentUser');
    const budgetsData = localStorage.getItem('budgets');
    const categoriesData = localStorage.getItem('categories');
    const transactionsData = localStorage.getItem('transactions');

    if (userData) currentUser = JSON.parse(userData);
    if (budgetsData) budgets = JSON.parse(budgetsData);
    if (categoriesData) categories = JSON.parse(categoriesData);
    if (transactionsData) transactions = JSON.parse(transactionsData);
}

function saveData() {
    // Save data to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('budgets', JSON.stringify(budgets));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// UI Updates
function updateUI() {
    if (currentUser) {
        // User is logged in
        loginBtn.textContent = 'Đăng xuất';
        registerBtn.style.display = 'none';
        loginBtn.removeEventListener('click', showLoginForm);
        loginBtn.addEventListener('click', logout);
    } else {
        // User is logged out
        loginBtn.textContent = 'Đăng nhập';
        registerBtn.style.display = 'inline-block';
        loginBtn.removeEventListener('click', logout);
        loginBtn.addEventListener('click', showLoginForm);
    }
}

// Authentication Functions
function showLoginForm() {
    // Create login modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">Đăng nhập</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="loginForm" class="space-y-4">
                <div>
                    <label for="loginEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="loginEmail" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label for="loginPassword" class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                    <input type="password" id="loginPassword" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Đăng nhập</button>
            </form>
            <p class="text-center mt-4 text-sm text-gray-600">
                Chưa có tài khoản? 
                <a href="#" class="text-blue-600 hover:underline" onclick="showRegisterForm()">Đăng ký ngay</a>
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const loginForm = modal.querySelector('#loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        login(email, password);
    });
}

function showRegisterForm() {
    // Create register modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">Đăng ký</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="registerForm" class="space-y-4">
                <div>
                    <label for="registerEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="registerEmail" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label for="registerPassword" class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                    <input type="password" id="registerPassword" required minlength="6"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label for="registerConfirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                    <input type="password" id="registerConfirmPassword" required
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Đăng ký</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const registerForm = modal.querySelector('#registerForm');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        register(email, password, confirmPassword);
    });
}

function login(email, password) {
    // Simple validation
    if (!email || !password) {
        alert('Vui lòng nhập đầy đủ email và mật khẩu');
        return;
    }

    // Check if user exists (in a real app, this would be a server call)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        saveData();
        updateUI();
        alert('Đăng nhập thành công!');
        // Remove all modals
        document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
        // Redirect to home page
        window.location.href = 'index.html';
    } else {
        alert('Email hoặc mật khẩu không đúng');
    }
}

function register(email, password, confirmPassword) {
    // Validation
    if (!email || !password || !confirmPassword) {
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Email không đúng định dạng');
        return;
    }

    if (password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự');
        return;
    }

    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp');
        return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) {
        alert('Email đã được đăng ký');
        return;
    }

    // Create new user
    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Đăng ký thành công! Vui lòng đăng nhập');
    // Remove register modal and show login modal
    document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
    showLoginForm();
}

function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        currentUser = null;
        saveData();
        updateUI();
        alert('Đăng xuất thành công');
        window.location.href = 'index.html';
    }
}

// Budget Management Functions
function showBudgetForm() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">Thêm ngân sách tháng</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="budgetForm" class="space-y-4">
                <div>
                    <label for="budgetMonth" class="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
                    <input type="month" id="budgetMonth" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label for="budgetAmount" class="block text-sm font-medium text-gray-700 mb-1">Số tiền (VND)</label>
                    <input type="number" id="budgetAmount" required min="0"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Lưu ngân sách</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const budgetForm = modal.querySelector('#budgetForm');
    budgetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const month = document.getElementById('budgetMonth').value;
        const amount = parseFloat(document.getElementById('budgetAmount').value);
        addBudget(month, amount);
    });
}

function addBudget(month, amount) {
    if (!month || !amount) {
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
    }

    if (amount <= 0) {
        alert('Số tiền phải lớn hơn 0');
        return;
    }

    // Check if budget for this month already exists
    const existingBudget = budgets.find(b => b.month === month && b.userEmail === currentUser.email);
    if (existingBudget) {
        if (confirm('Ngân sách cho tháng này đã tồn tại. Bạn có muốn cập nhật?')) {
            existingBudget.amount = amount;
            existingBudget.remaining = amount - calculateSpentAmount(month);
            saveData();
            alert('Cập nhật ngân sách thành công');
            document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
            renderBudgets();
        }
        return;
    }

    const newBudget = {
        id: Date.now(),
        userEmail: currentUser.email,
        month,
        amount,
        remaining: amount,
        createdAt: new Date().toISOString()
    };

    budgets.push(newBudget);
    saveData();
    alert('Thêm ngân sách thành công');
    document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
    renderBudgets();
}

function calculateSpentAmount(month) {
    return transactions
        .filter(t => t.month === month && t.userEmail === currentUser.email)
        .reduce((sum, t) => sum + t.amount, 0);
}

function renderBudgets() {
    const budgetList = document.getElementById('budgetList');
    if (!budgetList) return;

    const userBudgets = budgets.filter(b => b.userEmail === currentUser.email);
    
    if (userBudgets.length === 0) {
        budgetList.innerHTML = '<p class="text-gray-500">Chưa có ngân sách nào được thiết lập</p>';
        return;
    }

    budgetList.innerHTML = userBudgets.map(budget => `
        <div class="bg-white rounded-lg shadow p-4 mb-4">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold">${formatMonth(budget.month)}</h4>
                    <p class="text-sm text-gray-600">Tổng ngân sách: ${formatCurrency(budget.amount)}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold ${budget.remaining < 0 ? 'text-red-600' : 'text-green-600'}">
                        Còn lại: ${formatCurrency(budget.remaining)}
                    </p>
                    <p class="text-sm text-gray-600">Đã chi: ${formatCurrency(budget.amount - budget.remaining)}</p>
                </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                <button onclick="editBudget('${budget.id}')" class="text-blue-600 hover:text-blue-800 text-sm">
                    <i class="fas fa-edit mr-1"></i> Sửa
                </button>
                <button onclick="deleteBudget('${budget.id}')" class="text-red-600 hover:text-red-800 text-sm">
                    <i class="fas fa-trash-alt mr-1"></i> Xóa
                </button>
            </div>
        </div>
    `).join('');
}

function formatMonth(monthString) {
    const [year, month] = monthString.split('-');
    const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                       'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function editBudget(budgetId) {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">Sửa ngân sách</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="editBudgetForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
                    <p class="font-medium">${formatMonth(budget.month)}</p>
                </div>
                <div>
                    <label for="editBudgetAmount" class="block text-sm font-medium text-gray-700 mb-1">Số tiền (VND)</label>
                    <input type="number" id="editBudgetAmount" value="${budget.amount}" required min="0"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Cập nhật</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const editForm = modal.querySelector('#editBudgetForm');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('editBudgetAmount').value);
        updateBudget(budgetId, amount);
    });
}

function updateBudget(budgetId, amount) {
    if (!amount || amount <= 0) {
        alert('Số tiền phải lớn hơn 0');
        return;
    }

    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return;

    budget.amount = amount;
    budget.remaining = amount - calculateSpentAmount(budget.month);
    saveData();
    alert('Cập nhật ngân sách thành công');
    document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
    renderBudgets();
}

function deleteBudget(budgetId) {
    if (!confirm('Bạn có chắc chắn muốn xóa ngân sách này?')) return;

    const index = budgets.findIndex(b => b.id === budgetId);
    if (index !== -1) {
        budgets.splice(index, 1);
        saveData();
        alert('Xóa ngân sách thành công');
        renderBudgets();
    }
}

// Category Management Functions
function showCategoryForm() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">Thêm danh mục</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="categoryForm" class="space-y-4">
                <div>
                    <label for="categoryName" class="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
                    <input type="text" id="categoryName" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label for="categoryBudget" class="block text-sm font-medium text-gray-700 mb-1">Ngân sách (VND)</label>
                    <input type="number" id="categoryBudget" required min="0"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Lưu danh mục</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const categoryForm = modal.querySelector('#categoryForm');
    categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('categoryName').value;
        const budget = parseFloat(document.getElementById('categoryBudget').value);
        addCategory(name, budget);
    });
}

function addCategory(name, budget) {
    if (!name || !budget) {
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
    }

    if (budget <= 0) {
        alert('Ngân sách phải lớn hơn 0');
        return;
    }

    const newCategory = {
        id: Date.now(),
        userEmail: currentUser.email,
        name,
        budget,
        spent: 0,
        createdAt: new Date().toISOString()
    };

    categories.push(newCategory);
    saveData();
    alert('Thêm danh mục thành công');
    document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
    renderCategories();
}

function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;

    const userCategories = categories.filter(c => c.userEmail === currentUser.email);
    
    if (userCategories.length === 0) {
        categoryList.innerHTML = '<p class="text-gray-500">Chưa có danh mục nào được thiết lập</p>';
        return;
    }

    categoryList.innerHTML = userCategories.map(category => `
        <div class="bg-white rounded-lg shadow p-4 mb-4">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold">${category.name}</h4>
                    <p class="text-sm text-gray-600">Ngân sách: ${formatCurrency(category.budget)}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold ${category.spent > category.budget ? 'text-red-600' : 'text-green-600'}">
                        Đã chi: ${formatCurrency(category.spent)}
                    </p>
                    <p class="text-sm text-gray-600">Còn lại: ${formatCurrency(category.budget - category.spent)}</p>
                </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                <button onclick="editCategory('${category.id}')" class="text-blue-600 hover:text-blue-800 text-sm">
                    <i class="fas fa-edit mr-1"></i> Sửa
                </button>
                <button onclick="deleteCategory('${category.id}')" class="text-red-600 hover:text-red-800 text-sm">
                    <i class="fas fa-trash-alt mr-1"></i> Xóa
                </button>
            </div>
        </div>
    `).join('');
}

function editCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">Sửa danh mục</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="editCategoryForm" class="space-y-4">
                <div>
                    <label for="editCategoryName" class="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
                    <input type="text" id="editCategoryName" value="${category.name}" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label for="editCategoryBudget" class="block text-sm font-medium text-gray-700 mb-1">Ngân sách (VND)</label>
                    <input type="number" id="editCategoryBudget" value="${category.budget}" required min="0"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Cập nhật</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const editForm = modal.querySelector('#editCategoryForm');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('editCategoryName').value;
        const budget = parseFloat(document.getElementById('editCategoryBudget').value);
        updateCategory(categoryId, name, budget);
    });
}

function updateCategory(categoryId, name, budget) {
    if (!name || !budget) {
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
    }

    if (budget <= 0) {
        alert('Ngân sách phải lớn hơn 0');
        return;
    }

    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    category.name = name;
    category.budget = budget;
    saveData();
    alert('Cập nhật danh mục thành công');
    document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
    renderCategories();
}

function deleteCategory(categoryId) {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    const index = categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
        categories.splice(index, 1);
        saveData();
        alert('Xóa danh mục thành công');
        renderCategories();
    }
}

// Transaction Functions
function showTransactionForm() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">Thêm giao dịch</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="transactionForm" class="space-y-4">
                <div>
                    <label for="transactionDate" class="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                    <input type="date" id="transactionDate" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label for="transactionCategory" class="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select id="transactionCategory" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Chọn danh mục</option>
                        ${categories.filter(c => c.userEmail === currentUser?.email).map(c => 
                            `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label for="transactionAmount" class="block text-sm font-medium text-gray-700 mb-1">Số tiền (VND)</label>
                    <input type="number" id="transactionAmount" required min="0"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label for="transactionNote" class="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <input type="text" id="transactionNote" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Lưu giao dịch</button>
            </form>
        </div>
    `;
    
    // Set default date to today
    document.getElementById('transactionDate').valueAsDate = new Date();
    
    document.body.appendChild(modal);
    
    const transactionForm = modal.querySelector('#transactionForm');
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('transactionDate').value;
        const categoryId = document.getElementById('transactionCategory').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const note = document.getElementById('transactionNote').value;
        addTransaction(date, categoryId, amount, note);
    });
}

function addTransaction(date, categoryId, amount, note) {
    if (!date || !categoryId || !amount) {
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
    }

    if (amount <= 0) {
        alert('Số tiền phải lớn hơn 0');
        return;
    }

    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const month = date.substring(0, 7); // Get YYYY-MM format
    
    const newTransaction = {
        id: Date.now(),
        userEmail: currentUser.email,
        date,
        month,
        categoryId,
        categoryName: category.name,
        amount,
        note: note || '',
        createdAt: new Date().toISOString()
    };

    // Update category spent amount
    category.spent += amount;
    
    // Update budget remaining amount
    const budget = budgets.find(b => b.month === month && b.userEmail === currentUser.email);
    if (budget) {
        budget.remaining -= amount;
    }

    transactions.push(newTransaction);
    saveData();
    alert('Thêm giao dịch thành công');
    document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
    renderTransactions();
    renderCategories();
    renderBudgets();
}

function renderTransactions() {
    const transactionList = document.getElementById('transactionList');
    if (!transactionList) return;

    const userTransactions = transactions
        .filter(t => t.userEmail === currentUser.email)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (userTransactions.length === 0) {
        transactionList.innerHTML = '<p class="text-gray-500">Chưa có giao dịch nào</p>';
        return;
    }

    transactionList.innerHTML = userTransactions.map(transaction => `
        <div class="bg-white rounded-lg shadow p-4 mb-4">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold">${transaction.categoryName}</h4>
                    <p class="text-sm text-gray-600">${formatDate(transaction.date)}</p>
                    ${transaction.note ? `<p class="text-sm text-gray-600 mt-1">${transaction.note}</p>` : ''}
                </div>
                <div class="text-right">
                    <p class="font-bold text-red-600">-${formatCurrency(transaction.amount)}</p>
                </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-200 flex justify-end">
                <button onclick="deleteTransaction('${transaction.id}')" class="text-red-600 hover:text-red-800 text-sm">
                    <i class="fas fa-trash-alt mr-1"></i> Xóa
                </button>
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function deleteTransaction(transactionId) {
    if (!confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) return;

    const index = transactions.findIndex(t => t.id === transactionId);
    if (index !== -1) {
        const transaction = transactions[index];
        
        // Update category spent amount
        const category = categories.find(c => c.id === transaction.categoryId);
        if (category) {
            category.spent -= transaction.amount;
        }
        
        // Update budget remaining amount
        const budget = budgets.find(b => b.month === transaction.month && b.userEmail === currentUser.email);
        if (budget) {
            budget.remaining += transaction.amount;
        }

        transactions.splice(index, 1);
        saveData();
        alert('Xóa giao dịch thành công');
        renderTransactions();
        renderCategories();
        renderBudgets();
    }
}

// Statistics Functions
function renderStatistics() {
    renderSummaryCards();
    renderSpendingChart();
}

function renderSummaryCards() {
    const currentMonth = new Date().toISOString().substring(0, 7);
    
    // Monthly spending
    const monthlySpent = transactions
        .filter(t => t.month === currentMonth && t.userEmail === currentUser.email)
        .reduce((sum, t) => sum + t.amount, 0);
    
    // Monthly budget
    const monthlyBudget = budgets.find(b => b.month === currentMonth && b.userEmail === currentUser.email)?.amount || 0;
    
    // Categories spending
    const categoriesSpent = categories
        .filter(c => c.userEmail === currentUser.email)
        .reduce((sum, c) => sum + c.spent, 0);
    
    document.getElementById('summaryCards').innerHTML = `
        <div class="bg-white rounded-lg shadow p-6">
            <h4 class="font-bold text-gray-600 mb-2">Chi tiêu tháng này</h4>
            <p class="text-2xl font-bold ${monthlySpent > monthlyBudget ? 'text-red-600' : 'text-green-600'}">
                ${formatCurrency(monthlySpent)}
            </p>
            <p class="text-sm text-gray-500 mt-1">${formatCurrency(monthlyBudget)} ngân sách</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <h4 class="font-bold text-gray-600 mb-2">Ngân sách còn lại</h4>
            <p class="text-2xl font-bold ${(monthlyBudget - monthlySpent) < 0 ? 'text-red-600' : 'text-green-600'}">
                ${formatCurrency(monthlyBudget - monthlySpent)}
            </p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <h4 class="font-bold text-gray-600 mb-2">Tổng chi tiêu</h4>
            <p class="text-2xl font-bold text-blue-600">
                ${formatCurrency(categoriesSpent)}
            </p>
        </div>
    `;
}

function renderSpendingChart() {
    const ctx = document.getElementById('spendingChart');
    if (!ctx) return;

    const currentMonth = new Date().toISOString().substring(0, 7);
    const monthTransactions = transactions
        .filter(t => t.month === currentMonth && t.userEmail === currentUser.email);
    
    const categorySpending = {};
    monthTransactions.forEach(t => {
        if (!categorySpending[t.categoryName]) {
            categorySpending[t.categoryName] = 0;
        }
        categorySpending[t.categoryName] += t.amount;
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categorySpending),
            datasets: [{
                data: Object.values(categorySpending),
                backgroundColor: [
                    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                    '#EC4899', '#14B8A6', '#F97316', '#64748B', '#84CC16'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    if (currentUser) {
        renderBudgets();
        renderCategories();
        renderTransactions();
        renderStatistics();
    }
});
