// 工具切换功能
document.addEventListener('DOMContentLoaded', function() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    const toolSections = document.querySelectorAll('.tool-section');

    // 设置默认显示的工具
    document.getElementById('number-tool').classList.remove('hidden');  // 确保进制转换工具显示
    document.querySelector('.tool-btn[data-tool="number"]').classList.add('active');  // 设置默认按钮为激活状态

    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            toolButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            button.classList.add('active');

            // 隐藏所有工具区域
            toolSections.forEach(section => section.classList.add('hidden'));
            // 显示选中的工具区域
            const toolId = button.getAttribute('data-tool');
            document.getElementById(`${toolId}-tool`).classList.remove('hidden');
        });
    });
});

// 输入验证和过滤功能
function validateInput(input, type) {
    const value = input.value;
    let filteredValue = '';
    
    switch(type) {
        case 'binary':
            // 只允许0和1
            filteredValue = value.replace(/[^01]/g, '');
            break;
        case 'decimal':
            // 只允许数字，不允许小数点
            filteredValue = value.replace(/[^0-9]/g, '');
            break;
        case 'hex':
            // 只允许0-9和a-f（不区分大小写）
            filteredValue = value.replace(/[^0-9a-fA-F]/g, '');
            break;
        case 'float':
            // 允许数字和小数点，但确保只有一个小数点
            filteredValue = value.replace(/[^0-9.]/g, '');
            // 确保只有一个小数点
            const parts = filteredValue.split('.');
            if (parts.length > 2) {
                filteredValue = parts[0] + '.' + parts.slice(1).join('');
            }
            break;
    }
    
    // 如果过滤后的值与原值不同，更新输入框
    if (filteredValue !== value) {
        input.value = filteredValue;
    }
    
    return filteredValue;
}

// 进制转换功能
function convertNumber() {
    const binaryInput = document.getElementById('binaryInput');
    const decimalInput = document.getElementById('decimalInput');
    const hexInput = document.getElementById('hexInput');
    
    // 获取当前输入框的值（经过验证和过滤）
    const binaryValue = validateInput(binaryInput, 'binary');
    const decimalValue = validateInput(decimalInput, 'decimal');
    const hexValue = validateInput(hexInput, 'hex');
    
    // 确定哪个输入框被修改
    const activeInput = document.activeElement;
    
    try {
        let decimal;
        
        // 根据当前输入框计算十进制值
        if (activeInput === binaryInput && binaryValue) {
            decimal = parseInt(binaryValue, 2);
            if (isNaN(decimal)) throw new Error('无效的二进制数');
            decimalInput.value = decimal;
            hexInput.value = decimal.toString(16).toUpperCase();
        } else if (activeInput === decimalInput && decimalValue) {
            decimal = parseInt(decimalValue, 10);
            if (isNaN(decimal)) throw new Error('无效的十进制数');
            binaryInput.value = decimal.toString(2);
            hexInput.value = decimal.toString(16).toUpperCase();
        } else if (activeInput === hexInput && hexValue) {
            decimal = parseInt(hexValue, 16);
            if (isNaN(decimal)) throw new Error('无效的十六进制数');
            binaryInput.value = decimal.toString(2);
            decimalInput.value = decimal;
        }
    } catch (error) {
        // 如果转换失败，清空其他输入框
        if (activeInput !== binaryInput) binaryInput.value = '';
        if (activeInput !== decimalInput) decimalInput.value = '';
        if (activeInput !== hexInput) hexInput.value = '';
    }
}

// 速度单位转换功能
function convertSpeed() {
    const mpsInput = document.getElementById('mpsInput');
    const kmhInput = document.getElementById('kmhInput');
    const mphInput = document.getElementById('mphInput');
    
    // 获取当前输入框的值（经过验证和过滤）
    const mpsValue = validateInput(mpsInput, 'float');
    const kmhValue = validateInput(kmhInput, 'float');
    const mphValue = validateInput(mphInput, 'float');
    
    // 确定哪个输入框被修改
    const activeInput = document.activeElement;
    
    try {
        let mps;  // 使用米/秒作为中间单位
        
        // 根据当前输入框计算米/秒值
        if (activeInput === mpsInput && mpsValue) {
            mps = parseFloat(mpsValue);
            if (isNaN(mps)) throw new Error('无效的数值');
            kmhInput.value = (mps * 3.6).toFixed(2);
            mphInput.value = (mps / 0.44704).toFixed(2);
        } else if (activeInput === kmhInput && kmhValue) {
            mps = parseFloat(kmhValue) / 3.6;
            if (isNaN(mps)) throw new Error('无效的数值');
            mpsInput.value = mps.toFixed(2);
            mphInput.value = (mps / 0.44704).toFixed(2);
        } else if (activeInput === mphInput && mphValue) {
            mps = parseFloat(mphValue) * 0.44704;
            if (isNaN(mps)) throw new Error('无效的数值');
            mpsInput.value = mps.toFixed(2);
            kmhInput.value = (mps * 3.6).toFixed(2);
        }
    } catch (error) {
        // 如果转换失败，清空其他输入框
        if (activeInput !== mpsInput) mpsInput.value = '';
        if (activeInput !== kmhInput) kmhInput.value = '';
        if (activeInput !== mphInput) mphInput.value = '';
    }
}

// 角度弧度转换功能
function convertAngle() {
    const degreeInput = document.getElementById('degreeInput');
    const radianInput = document.getElementById('radianInput');
    
    // 获取当前输入框的值（经过验证和过滤）
    const degreeValue = validateInput(degreeInput, 'float');
    const radianValue = validateInput(radianInput, 'float');
    
    // 确定哪个输入框被修改
    const activeInput = document.activeElement;
    
    try {
        // 根据当前输入框计算转换值
        if (activeInput === degreeInput && degreeValue) {
            const degree = parseFloat(degreeValue);
            if (isNaN(degree)) throw new Error('无效的数值');
            radianInput.value = (degree * Math.PI / 180).toFixed(4);
        } else if (activeInput === radianInput && radianValue) {
            const radian = parseFloat(radianValue);
            if (isNaN(radian)) throw new Error('无效的数值');
            degreeInput.value = (radian * 180 / Math.PI).toFixed(4);
        }
    } catch (error) {
        // 如果转换失败，清空其他输入框
        if (activeInput !== degreeInput) degreeInput.value = '';
        if (activeInput !== radianInput) radianInput.value = '';
    }
}

// 经纬度转换功能
function convertCoordinate() {
    const degreeInput = document.getElementById('degreeInput');
    const secondInput = document.getElementById('secondInput');
    const millisecondInput = document.getElementById('millisecondInput');
    const subsecondInput = document.getElementById('subsecondInput');
    const mcodeInput = document.getElementById('mcodeInput');
    
    // 获取当前输入框的值（经过验证和过滤）
    const degreeValue = validateInput(degreeInput, 'float');
    const secondValue = validateInput(secondInput, 'float');
    const millisecondValue = validateInput(millisecondInput, 'float');
    const subsecondValue = validateInput(subsecondInput, 'float');
    const mcodeValue = validateInput(mcodeInput, 'float');
    
    // 确定哪个输入框被修改
    const activeInput = document.activeElement;
    
    try {
        let totalSeconds;  // 使用秒作为中间单位
        
        // 根据当前输入框计算总秒数
        if (activeInput === degreeInput && degreeValue) {
            totalSeconds = parseFloat(degreeValue) * 3600;  // 度转秒
            updateAllInputs(totalSeconds);
        } else if (activeInput === secondInput && secondValue) {
            totalSeconds = parseFloat(secondValue);
            updateAllInputs(totalSeconds);
        } else if (activeInput === millisecondInput && millisecondValue) {
            totalSeconds = parseFloat(millisecondValue) / 1000;
            updateAllInputs(totalSeconds);
        } else if (activeInput === subsecondInput && subsecondValue) {
            totalSeconds = parseFloat(subsecondValue) / 2560;
            updateAllInputs(totalSeconds);
        } else if (activeInput === mcodeInput && mcodeValue) {
            totalSeconds = parseFloat(mcodeValue) * 3600 / 2560;  // mcode转秒
            updateAllInputs(totalSeconds);
        }
    } catch (error) {
        // 如果转换失败，清空其他输入框
        if (activeInput !== degreeInput) degreeInput.value = '';
        if (activeInput !== secondInput) secondInput.value = '';
        if (activeInput !== millisecondInput) millisecondInput.value = '';
        if (activeInput !== subsecondInput) subsecondInput.value = '';
        if (activeInput !== mcodeInput) mcodeInput.value = '';
    }
}

// 更新所有输入框的值
function updateAllInputs(totalSeconds) {
    const degreeInput = document.getElementById('degreeInput');
    const secondInput = document.getElementById('secondInput');
    const millisecondInput = document.getElementById('millisecondInput');
    const subsecondInput = document.getElementById('subsecondInput');
    const mcodeInput = document.getElementById('mcodeInput');
    
    // 更新各个单位的值
    degreeInput.value = (totalSeconds / 3600).toFixed(6);
    secondInput.value = totalSeconds.toFixed(6);
    millisecondInput.value = (totalSeconds * 1000).toFixed(6);
    subsecondInput.value = (totalSeconds * 2560).toFixed(6);
    mcodeInput.value = (totalSeconds * 2560 / 3600).toFixed(6);
}

// 添加实时转换事件监听
document.getElementById('binaryInput').addEventListener('input', convertNumber);
document.getElementById('decimalInput').addEventListener('input', convertNumber);
document.getElementById('hexInput').addEventListener('input', convertNumber);

document.getElementById('mpsInput').addEventListener('input', convertSpeed);
document.getElementById('kmhInput').addEventListener('input', convertSpeed);
document.getElementById('mphInput').addEventListener('input', convertSpeed);

document.getElementById('degreeInput').addEventListener('input', convertAngle);
document.getElementById('radianInput').addEventListener('input', convertAngle);

// 添加经纬度转换的事件监听
document.getElementById('degreeInput').addEventListener('input', convertCoordinate);
document.getElementById('secondInput').addEventListener('input', convertCoordinate);
document.getElementById('millisecondInput').addEventListener('input', convertCoordinate);
document.getElementById('subsecondInput').addEventListener('input', convertCoordinate);
document.getElementById('mcodeInput').addEventListener('input', convertCoordinate); 