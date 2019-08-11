// User service UUID: Change this to your generated service UUID
const USER_SERVICE_UUID         = '34ed6388-64d1-4852-842c-c6cd454e6a9d'; // LED, Button
// User service characteristics
const LED_CHARACTERISTIC_UUID   = 'E9062E71-9E62-4BC6-B0D3-35CDCD9B027B';
const BTN_CHARACTERISTIC_UUID   = '62FBD229-6EDD-4D1A-B554-5C4E1BB29169';

// PSDI Service UUID: Fixed value for Developer Trial
const PSDI_SERVICE_UUID         = 'e625601e-9e55-4597-a598-76018a0d293d'; // Device ID
const PSDI_CHARACTERISTIC_UUID  = '26e2b12b-85f0-4f3f-9fdd-91d114270e6e';

// UI settings
let ledState = false; // true: LED on, false: LED off
let clickCount = 0;
let allCnt = 0;
let doneCnt = 0;

// Max Btn 
const TABLE = 10
const MENBER = 4

// UI item
let gauge

// -------------- //
// On window load //
// -------------- //

window.onload = () => {
    mertarInit()
    uiComponetSetter()
    initializeApp();
};

// ----------------- //
// Handler functions //
// ----------------- //

function handlerToggleLed() {
    ledState = !ledState;

    liffToggleDeviceLedState(ledState);
}

// ------------ //
// UI functions //
// ------------ //

function mertarInit() {
    var opts = {
        angle: -0.2, // The span of the gauge arc
        lineWidth: 0.2, // The line thickness
        radiusScale: 1, // Relative radius
        pointer: {
            length: 0.6, // // Relative to gauge radius
            strokeWidth: 0.035, // The thickness
            color: '#000000' // Fill color
        },
        limitMax: false,     // If false, max value increases automatically if value > maxValue
        limitMin: false,     // If true, the min value of the gauge will be fixed
        colorStart: '#6F6EA0',   // Colors
        colorStop: '#C0C0DB',    // just experiment with them
        strokeColor: '#EEEEEE',  // to see which ones work best for you
        generateGradient: true,
        highDpiSupport: true,     // High resolution support
        
        };
        var target = document.getElementById('foo'); // your canvas element
        gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
        gauge.maxValue = 100; // set max gauge value
        gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
        gauge.animationSpeed = 32; // set animation speed (32 is default value)
        gauge.set(0); // set actual value      
}

function mertar(num) {
    gauge.set(num); // set actual value      
}

function uiComponetSetter() {
    calling = document.getElementById('calling')
    menber = document.getElementById('menber')
    table = document.getElementById('table')
    done = document.getElementById('doneCnt')

    calling.textContent = allCnt;
    done.textContent = doneCnt;
    menber.textContent = MENBER;
    table.textContent = TABLE;
}

function sound(per) {
    switch (true) {
        case per < 50:
            flush = new Audio('common/data/decision4.mp3');
            console.log("< 50");
            break;
        case per < 75:
            flush = new Audio('common/data/warning1.mp3');
            console.log("< 75");
            break;
        case per < 100:
            flush = new Audio('common/data/warning2.mp3');
            console.log("< 100");
            break;
        case per >= 100:
            flush = new Audio('common/data/cursor6.mp3');
            console.log(flush);
            break;
        default:
            console.log("def");
            flush = new Audio('common/data/decision4.mp3');
    }    
    flush.play();
}

function uiCountDoneButton() {
    if (clickCount > 0) {
        counter(-1)
        progressBar()
        takometar()
    }
}

function counter(num) {
    clickCount += num;

    if (num > 0) {
        allCnt += num;
    } else {
        doneCnt++;
    }

    if (clickCount > allCnt) {
        allCnt += allCnt;
    }

    uiComponetSetter()
}

function uiCountPressButton() {
    counter(1)
    progressBar()
    takometar()
}

function uiToggleStateButton(pressed) {
    const el = document.getElementById("btn-state");

    if (pressed) {
        el.classList.add("pressed");
        el.innerText = "反応中！";
    } else {
        el.classList.remove("pressed");
        el.innerText = "反応なし";
    }
}

function uiToggleDeviceConnected(connected) {
    const elStatus = document.getElementById("status");
    const elControls = document.getElementById("controls");

    elStatus.classList.remove("error");

    if (connected) {
        // Hide loading animation
        uiToggleLoadingAnimation(false);
        // Show status connected
        elStatus.classList.remove("inactive");
        elStatus.classList.add("success");
        elStatus.innerText = "Device connected";
        // Show controls
        elControls.classList.remove("hidden");
    } else {
        // Show loading animation
        uiToggleLoadingAnimation(true);
        // Show status disconnected
        elStatus.classList.remove("success");
        elStatus.classList.add("inactive");
        elStatus.innerText = "Device disconnected";
        // Hide controls
        elControls.classList.add("hidden");
    }
}

function uiToggleLoadingAnimation(isLoading) {
    const elLoading = document.getElementById("loading-animation");

    if (isLoading) {
        // Show loading animation
        elLoading.classList.remove("hidden");
    } else {
        // Hide loading animation
        elLoading.classList.add("hidden");
    }
}

function uiStatusError(message, showLoadingAnimation) {
    uiToggleLoadingAnimation(showLoadingAnimation);

    const elStatus = document.getElementById("status");
    const elControls = document.getElementById("controls");

    // Show status error
    elStatus.classList.remove("success");
    elStatus.classList.remove("inactive");
    elStatus.classList.add("error");
    elStatus.innerText = message;

    // Hide controls
    elControls.classList.add("hidden");
}

function makeErrorMsg(errorObj) {
    return "Error\n" + errorObj.code + "\n" + errorObj.message;
}

function progressBar() {
    // 残呼び出し数 / 人数
    per = ((allCnt - doneCnt) / MENBER * 100)
    document.getElementById('bussy').setAttribute('aria-valuenow', per.toFixed(1))
    document.getElementById('bussy').setAttribute('style', 'width: '+per.toFixed(1)+'%;')
    document.getElementById('bussy').textContent = per.toFixed(1) + '%'
    sound(per)
}

function takometar() {
    // 残呼び出し数 * テーブル数
    per = ((allCnt - doneCnt) / TABLE * 100)
    console.log('tako: '+per+' MENBER:'+MENBER+' allCnt:'+allCnt+' doneCnt:'+doneCnt)
    mertar(per)
}

// -------------- //
// LIFF functions //
// -------------- //

function initializeApp() {
    liff.init(() => initializeLiff(), error => uiStatusError(makeErrorMsg(error), false));
}

function initializeLiff() {
    liff.initPlugins(['bluetooth']).then(() => {
        liffCheckAvailablityAndDo(() => liffRequestDevice());
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffCheckAvailablityAndDo(callbackIfAvailable) {
    // Check Bluetooth availability
    liff.bluetooth.getAvailability().then(isAvailable => {
        if (isAvailable) {
            uiToggleDeviceConnected(false);
            callbackIfAvailable();
        } else {
            uiStatusError("Bluetooth not available", true);
            setTimeout(() => liffCheckAvailablityAndDo(callbackIfAvailable), 10000);
        }
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });;
}

function liffRequestDevice() {
    liff.bluetooth.requestDevice().then(device => {
        liffConnectToDevice(device);
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffConnectToDevice(device) {
    device.gatt.connect().then(() => {
        // Show status connected
        uiToggleDeviceConnected(true);

        // Get service
        device.gatt.getPrimaryService(USER_SERVICE_UUID).then(service => {
            liffGetUserService(service);
        }).catch(error => {
            uiStatusError(makeErrorMsg(error), false);
        });
        device.gatt.getPrimaryService(PSDI_SERVICE_UUID).then(service => {
            liffGetPSDIService(service);
        }).catch(error => {
            uiStatusError(makeErrorMsg(error), false);
        });

        // Device disconnect callback
        const disconnectCallback = () => {
            // Show status disconnected
            uiToggleDeviceConnected(false);

            // Remove disconnect callback
            device.removeEventListener('gattserverdisconnected', disconnectCallback);

            // Reset LED state
            ledState = false;
            // Reset UI elements
            uiToggleStateButton(false);

            // Try to reconnect
            initializeLiff();
        };

        device.addEventListener('gattserverdisconnected', disconnectCallback);
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffGetUserService(service) {
    // Button pressed state
    service.getCharacteristic(BTN_CHARACTERISTIC_UUID).then(characteristic => {
        liffGetButtonStateCharacteristic(characteristic);
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });

    // Toggle LED
    service.getCharacteristic(LED_CHARACTERISTIC_UUID).then(characteristic => {
        window.ledCharacteristic = characteristic;

        // Switch off by default
        liffToggleDeviceLedState(false);
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffGetPSDIService(service) {
    // Get PSDI value
    service.getCharacteristic(PSDI_CHARACTERISTIC_UUID).then(characteristic => {
        return characteristic.readValue();
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffGetButtonStateCharacteristic(characteristic) {
    // Add notification hook for button state
    // (Get notified when button state changes)
    characteristic.startNotifications().then(() => {
        characteristic.addEventListener('characteristicvaluechanged', e => {
            const val = (new Uint8Array(e.target.value.buffer))[0];
            if (val > 0) {
                // press
                uiToggleStateButton(true);
            } else {
                // release
                uiToggleStateButton(false);
                uiCountPressButton();
                handlerToggleLed()
            }
        });
    }).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}

function liffToggleDeviceLedState(state) {
    // on: 0x01
    // off: 0x00
    window.ledCharacteristic.writeValue(
        state ? new Uint8Array([0x01]) : new Uint8Array([0x00])
    ).catch(error => {
        uiStatusError(makeErrorMsg(error), false);
    });
}