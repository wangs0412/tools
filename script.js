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
    const degreeInput = document.getElementById('angleDegreeInput');
    const radianInput = document.getElementById('angleRadianInput');
    
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

const SECONDS_PER_DEGREE = 3600.0;
const MILLI_PER_SECOND = 1000.0;
const MICRO2560_PER_SECOND = 2560.0;

// 经纬度转换功能
function convertCoordinate() {
    const degreeInput = document.getElementById('coordDegreeInput');
    const secondInput = document.getElementById('secondInput');
    const millisecondInput = document.getElementById('millisecondInput');
    const subsecondInput = document.getElementById('subsecondInput');
    
    // 确定哪个输入框被修改
    const activeInput = document.activeElement;
    
    try {
        let lon2560, lat2560;  // 使用1/2560秒作为中间单位
        
        // 根据当前输入框计算总秒数
        if (activeInput === degreeInput) {
            const value = validateCoordinateInput(degreeInput, 'float');
            if (value) {
                const [deg1, deg2] = value.split(' ').map(Number);
                lon2560 = deg1 * SECONDS_PER_DEGREE * MICRO2560_PER_SECOND;
                lat2560 = deg2 * SECONDS_PER_DEGREE * MICRO2560_PER_SECOND;
                updateAllInputs(lon2560, lat2560);
            }
        } else if (activeInput === secondInput) {
            const value = validateCoordinateInput(secondInput, 'float');
            if (value) {
                const [sec1, sec2] = value.split(' ').map(Number);
                lon2560 = sec1 * MICRO2560_PER_SECOND;
                lat2560 = sec2 * MICRO2560_PER_SECOND;
                updateAllInputs(lon2560, lat2560);
            }
        } else if (activeInput === millisecondInput) {
            const value = validateCoordinateInput(millisecondInput, 'decimal');
            if (value) {
                const [ms1, ms2] = value.split(' ').map(Number);
                lon2560 = (ms1 / MILLI_PER_SECOND) * MICRO2560_PER_SECOND;
                lat2560 = (ms2 / MILLI_PER_SECOND) * MICRO2560_PER_SECOND;
                updateAllInputs(lon2560, lat2560);
            }
        } else if (activeInput === subsecondInput) {
            const value = validateCoordinateInput(subsecondInput, 'decimal');
            if (value) {
                const [ss1, ss2] = value.split(' ').map(Number);
                lon2560 = ss1;
                lat2560 = ss2;
                updateAllInputs(lon2560, lat2560);
            }
        }
    } catch (error) {
        // 如果转换失败，清空其他输入框
        if (activeInput !== degreeInput) degreeInput.value = '';
        if (activeInput !== secondInput) secondInput.value = '';
        if (activeInput !== millisecondInput) millisecondInput.value = '';
        if (activeInput !== subsecondInput) subsecondInput.value = '';
    }
}

// 验证经纬度输入
function validateCoordinateInput(input, type) {
    let value = input.value;
    
    // 预处理输入值
    // 1. 去除前后空格
    value = value.trim();
    // 2. 将多个空格替换为单个空格
    value = value.replace(/\s+/g, ' ');
    
    let filteredValue = '';
    
    // 分割输入值
    const parts = value.split(' ');
    if (parts.length !== 2) {
        return '';  // 如果不是两组数字，返回空字符串
    }
    
    // 验证每组数字
    const validatedParts = parts.map(part => {
        let filteredPart = '';
        switch(type) {
            case 'float':
                // 允许数字和小数点，但确保只有一个小数点
                filteredPart = part.replace(/[^0-9.]/g, '');
                const decimalParts = filteredPart.split('.');
                if (decimalParts.length > 2) {
                    filteredPart = decimalParts[0] + '.' + decimalParts.slice(1).join('');
                }
                // 限制小数位数为6位
                if (decimalParts.length === 2) {
                    filteredPart = decimalParts[0] + '.' + decimalParts[1].slice(0, 6);
                }
                break;
            case 'decimal':
                // 只允许数字
                filteredPart = part.replace(/[^0-9]/g, '');
                break;
        }
        return filteredPart;
    });
    
    // 组合验证后的值
    filteredValue = validatedParts.join(' ');
    
    // 如果过滤后的值与原值不同，更新输入框
    if (filteredValue !== value) {
        input.value = filteredValue;
    }
    
    return filteredValue;
}

// 更新所有输入框的值
function updateAllInputs(lon2560, lat2560) {
    const degreeInput = document.getElementById('coordDegreeInput');
    const secondInput = document.getElementById('secondInput');
    const millisecondInput = document.getElementById('millisecondInput');
    const subsecondInput = document.getElementById('subsecondInput');
    
    // 更新各个单位的值
    degreeInput.value = `${(lon2560 / SECONDS_PER_DEGREE / MICRO2560_PER_SECOND).toFixed(6)} ${(lat2560 / SECONDS_PER_DEGREE / MICRO2560_PER_SECOND).toFixed(6)}`;
    secondInput.value = `${(lon2560 / MICRO2560_PER_SECOND).toFixed(4)} ${(lat2560 / MICRO2560_PER_SECOND).toFixed(4)}`;
    millisecondInput.value = `${Math.floor(lon2560 / MICRO2560_PER_SECOND * 1000)} ${Math.floor(lat2560 / MICRO2560_PER_SECOND * 1000)}`;
    subsecondInput.value = `${Math.floor(lon2560)} ${Math.floor(lat2560)}`;
}

// 添加实时转换事件监听
document.getElementById('binaryInput').addEventListener('input', convertNumber);
document.getElementById('decimalInput').addEventListener('input', convertNumber);
document.getElementById('hexInput').addEventListener('input', convertNumber);

document.getElementById('mpsInput').addEventListener('input', convertSpeed);
document.getElementById('kmhInput').addEventListener('input', convertSpeed);
document.getElementById('mphInput').addEventListener('input', convertSpeed);

document.getElementById('angleDegreeInput').addEventListener('input', convertAngle);
document.getElementById('angleRadianInput').addEventListener('input', convertAngle);

// 添加经纬度转换的事件监听
document.getElementById('coordDegreeInput').addEventListener('input', convertCoordinate);
document.getElementById('secondInput').addEventListener('input', convertCoordinate);
document.getElementById('millisecondInput').addEventListener('input', convertCoordinate);
document.getElementById('subsecondInput').addEventListener('input', convertCoordinate); 