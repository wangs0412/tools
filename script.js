// 全局变量
let currentMap = null;
let currentMarker = null;

// 工具切换功能
document.addEventListener('DOMContentLoaded', function() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    const toolSections = document.querySelectorAll('.tool-section');

    // 设置默认显示的工具
    document.getElementById('number-tool').classList.remove('hidden');
    document.querySelector('.tool-btn[data-tool="number"]').classList.add('active');

    // 查看地图按钮点击事件
    document.getElementById('viewOnMap').addEventListener('click', function() {
        // 获取输入的经纬度
        const coordInput = document.getElementById('coordDegreeInput').value.trim();
        if (!coordInput) {
            alert('请输入经纬度');
            return;
        }

        // 解析经纬度
        const [lng, lat] = coordInput.split(' ').map(Number);
        if (isNaN(lat) || isNaN(lng)) {
            alert('请输入有效的经纬度');
            return;
        }

        // 切换到地图页面
        document.querySelector('.tool-btn[data-tool="map"]').click();

        // 更新地图位置
        updateMapPosition(lat, lng);
    });

    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            const toolId = button.getAttribute('data-tool');
            
            // 移除所有按钮的active类
            toolButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            button.classList.add('active');

            // 控制时间显示和tools-container的显示/隐藏
            const datetimeInfo = document.getElementById('datetime-info');
            const toolsContainer = document.querySelector('.tools-container');
            const map = document.getElementById('map');
            
            if (toolId === 'map') {
                datetimeInfo.style.display = 'none';
                toolsContainer.style.display = 'none';
                map.classList.remove('hidden');
                if (!currentMap) {
                    initMap(39.9042, 116.4074); // 默认显示北京
                }
            } else {
                datetimeInfo.style.display = 'block';
                toolsContainer.style.display = 'block';
                map.classList.add('hidden');

                // 显示对应的工具区域
                const toolSections = toolsContainer.querySelectorAll('.tool-section');
                toolSections.forEach(section => {
                    if (section.id === `${toolId}-tool`) {
                        section.classList.remove('hidden');
                    } else {
                        section.classList.add('hidden');
                    }
                });
            }
        });
    });

    initRGBTool();
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

// 时间信息显示功能
let currentWeekNumber = 0;
let isHoliday = false;
let holidayInfo = '';

// 获取节假日信息的函数
async function fetchHolidayInfo() {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        const response = await fetch(`https://timor.tech/api/holiday/info/${dateStr}`);
        if (!response.ok) {
            throw new Error('API请求失败');
        }
        const data = await response.json();
        
        if (data.code === 0) {
            isHoliday = data.holiday !== null;
            holidayInfo = isHoliday ? ` · ${data.holiday.name}` : '';
        }
    } catch (error) {
        console.error('获取节假日信息失败，使用本地时间:', error);
        isHoliday = false;
        holidayInfo = '';
    }
}

function updateDateTimeInfo() {
    const now = new Date();
    // 使用Intl.DateTimeFormat来确保正确显示本地时间
    const formatter = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    const dateTime = {};
    parts.forEach(part => {
        dateTime[part.type] = part.value;
    });
    
    const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const week = weekDays[now.getDay()];
    
    // 计算周数（本地计算）
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const firstDay = yearStart.getDay();
    const days = Math.floor((now - yearStart) / (24 * 60 * 60 * 1000));
    currentWeekNumber = Math.floor((days + firstDay) / 7) + 1;
    
    const info = `${dateTime.year}年${dateTime.month}月${dateTime.day}日 ${dateTime.hour}:${dateTime.minute}:${dateTime.second} CST<br>${week}${holidayInfo}<br>第${currentWeekNumber}周`;
    document.getElementById('datetime-info').innerHTML = info;
}

// 初始化时获取节假日信息
fetchHolidayInfo();
// 每小时更新一次节假日信息
setInterval(fetchHolidayInfo, 3600000);
// 每秒更新时间显示
setInterval(updateDateTimeInfo, 1000);
updateDateTimeInfo();

// 初始化地图
function initMap(lat, lng) {
    try {
        // 创建地图实例
        const map = L.map('map').setView([lat, lng], 12);

        // 添加高德地图图层
        const normalLayer = L.tileLayer('https://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
            subdomains: ['01', '02', '03', '04'],
            attribution: '高德地图',
            maxZoom: 18,
            minZoom: 3
        });

        const satelliteLayer = L.tileLayer('https://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
            subdomains: ['01', '02', '03', '04'],
            attribution: '高德地图',
            maxZoom: 18,
            minZoom: 3
        });

        // 添加Google Maps图层
        const googleNormalLayer = L.tileLayer('https://wkmap.wangs.blog/maps/vt?lyrs=m&x={x}&y={y}&z={z}', {
            subdomains: ['0', '1', '2', '3'],
            attribution: 'Google Maps',
            maxZoom: 20,
            minZoom: 3
        });

        const googleSatelliteLayer = L.tileLayer('https://wkmap.wangs.blog/maps/vt?lyrs=s&x={x}&y={y}&z={z}', {
            subdomains: ['0', '1', '2', '3'],
            attribution: 'Google Maps',
            maxZoom: 20,
            minZoom: 3
        });

        const googleTerrainLayer = L.tileLayer('https://wkmap.wangs.blog/maps/vt?lyrs=p&x={x}&y={y}&z={z}', {
            subdomains: ['0', '1', '2', '3'],
            attribution: 'Google Maps',
            maxZoom: 20,
            minZoom: 3
        });

        const googleHybridLayer = L.tileLayer('https://wkmap.wangs.blog/maps/vt?lyrs=y&x={x}&y={y}&z={z}', {
            subdomains: ['0', '1', '2', '3'],
            attribution: 'Google Maps',
            maxZoom: 20,
            minZoom: 3
        });

        // 默认显示普通地图
        normalLayer.addTo(map);

        // 添加标记
        const marker = L.marker([lat, lng]).addTo(map)
            .bindPopup(`经纬度: ${lat}, ${lng}`)
            .openPopup();

        // 添加图层控制
        const baseMaps = {
            "高德街道图": normalLayer,
            "高德卫星图": satelliteLayer,
            "Google街道图": googleNormalLayer,
            "Google卫星图": googleSatelliteLayer,
            "Google地形图": googleTerrainLayer,
            "Google混合图": googleHybridLayer
        };

        L.control.layers(baseMaps).addTo(map);

        // 添加比例尺
        L.control.scale().addTo(map);

        // 添加点击事件监听器
        map.on('click', function(e) {
            const clickedLat = e.latlng.lat.toFixed(6);
            const clickedLng = e.latlng.lng.toFixed(6);
            
            // 更新标记位置
            if (currentMarker) {
                currentMarker.setLatLng([clickedLat, clickedLng])
                    .setPopupContent(`经纬度: ${clickedLat}, ${clickedLng}`)
                    .openPopup();
            } else {
                currentMarker = L.marker([clickedLat, clickedLng]).addTo(map)
                    .bindPopup(`经纬度: ${clickedLat}, ${clickedLng}`)
                    .openPopup();
            }

            const lon2560 = clickedLng * SECONDS_PER_DEGREE * MICRO2560_PER_SECOND;
            const lat2560 = clickedLat * SECONDS_PER_DEGREE * MICRO2560_PER_SECOND;
            updateAllInputs(lon2560, lat2560);
        });
        // 保存地图实例和标记
        currentMap = map;
        currentMarker = marker;

    } catch (error) {
        console.error('地图初始化失败:', error);
        alert('地图加载失败，请刷新页面重试');
    }
}

// 更新地图位置
function updateMapPosition(lat, lng) {
    if (!currentMap) {
        initMap(lat, lng);
        return;
    }

    // 更新地图中心点
    currentMap.setView([lat, lng], currentMap.getZoom());

    // 更新标记位置
    if (currentMarker) {
        currentMarker.setLatLng([lat, lng])
            .setPopupContent(`经纬度: ${lat}, ${lng}`)
            .openPopup();
    } else {
        currentMarker = L.marker([lat, lng]).addTo(currentMap)
            .bindPopup(`经纬度: ${lat}, ${lng}`)
            .openPopup();
    }
}

// 清空所有输入框
function clearAllInputs() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    });
}

// RGB颜色查询功能
function initRGBTool() {
    const redInput = document.getElementById('redInput');
    const greenInput = document.getElementById('greenInput');
    const blueInput = document.getElementById('blueInput');
    const hueInput = document.getElementById('hueInput');
    const saturationInput = document.getElementById('saturationInput');
    const valueInput = document.getElementById('valueInput');
    const colorDisplay = document.getElementById('colorDisplay');
    const hexValue = document.getElementById('hexValue');
    const showColorCodesBtn = document.getElementById('showColorCodes');
    const colorCodesList = document.getElementById('colorCodesList');

    // RGB转HSV
    function rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        let h = 0;
        let s = max === 0 ? 0 : delta / max;
        let v = max;

        if (delta !== 0) {
            if (max === r) {
                h = ((g - b) / delta) % 6;
            } else if (max === g) {
                h = (b - r) / delta + 2;
            } else {
                h = (r - g) / delta + 4;
            }

            h = Math.round(h * 60);
            if (h < 0) h += 360;
        }

        return {
            h: Math.round(h),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }

    // HSV转RGB
    function hsvToRgb(h, s, v) {
        h = h % 360;
        s = s / 100;
        v = v / 100;

        const c = v * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = v - c;

        let r, g, b;
        if (h >= 0 && h < 60) {
            [r, g, b] = [c, x, 0];
        } else if (h >= 60 && h < 120) {
            [r, g, b] = [x, c, 0];
        } else if (h >= 120 && h < 180) {
            [r, g, b] = [0, c, x];
        } else if (h >= 180 && h < 240) {
            [r, g, b] = [0, x, c];
        } else if (h >= 240 && h < 300) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }

        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }

    function updateColor() {
        const activeInput = document.activeElement;
        let r, g, b;

        // 根据当前输入框确定颜色值
        if (activeInput === hueInput || activeInput === saturationInput || activeInput === valueInput) {
            const h = parseInt(hueInput.value) || 0;
            const s = parseInt(saturationInput.value) || 0;
            const v = parseInt(valueInput.value) || 0;

            // 确保HSV值在有效范围内
            const validH = Math.min(Math.max(h, 0), 360);
            const validS = Math.min(Math.max(s, 0), 100);
            const validV = Math.min(Math.max(v, 0), 100);

            // 更新HSV输入框的值
            hueInput.value = validH;
            saturationInput.value = validS;
            valueInput.value = validV;

            // 转换为RGB
            const rgb = hsvToRgb(validH, validS, validV);
            r = rgb.r;
            g = rgb.g;
            b = rgb.b;

            // 更新RGB输入框
            redInput.value = r;
            greenInput.value = g;
            blueInput.value = b;
        } else {
            r = parseInt(redInput.value) || 0;
            g = parseInt(greenInput.value) || 0;
            b = parseInt(blueInput.value) || 0;

            // 确保RGB值在有效范围内
            r = Math.min(Math.max(r, 0), 255);
            g = Math.min(Math.max(g, 0), 255);
            b = Math.min(Math.max(b, 0), 255);

            // 更新RGB输入框的值
            redInput.value = r;
            greenInput.value = g;
            blueInput.value = b;

            // 转换为HSV
            const hsv = rgbToHsv(r, g, b);
            hueInput.value = hsv.h;
            saturationInput.value = hsv.s;
            valueInput.value = hsv.v;
        }

        // 更新颜色显示
        const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        colorDisplay.style.backgroundColor = hexColor;
        hexValue.textContent = hexColor.toUpperCase();
    }

    // 添加输入事件监听器
    redInput.addEventListener('input', updateColor);
    greenInput.addEventListener('input', updateColor);
    blueInput.addEventListener('input', updateColor);
    hueInput.addEventListener('input', updateColor);
    saturationInput.addEventListener('input', updateColor);
    valueInput.addEventListener('input', updateColor);

    // 显示/隐藏颜色代码列表
    showColorCodesBtn.addEventListener('click', () => {
        colorCodesList.classList.toggle('hidden');
        showColorCodesBtn.textContent = colorCodesList.classList.contains('hidden') ? 
            '显示常用颜色代码' : '隐藏常用颜色代码';
    });

    // 为每个颜色项添加点击事件
    const colorItems = colorCodesList.querySelectorAll('.color-code-item');
    colorItems.forEach(item => {
        item.addEventListener('click', () => {
            const hex = item.querySelector('.color-hex').textContent;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            
            redInput.value = r;
            greenInput.value = g;
            blueInput.value = b;
            
            updateColor();
        });
    });

    // 初始化显示
    updateColor();
} 