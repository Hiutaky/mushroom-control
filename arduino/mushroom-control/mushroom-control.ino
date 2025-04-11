/**
 * Fungando.Venafro Mushroom Arduino Control
 */
#include "DHT.h" //by adafruit (download entire library)
#include "Adafruit_SHT4x.h"
#include <Wire.h>
#include <SensirionI2cScd4x.h>

// Constants
#define UPDATE_INTERVAL 1000
#define HOURS_12 (uint32_t)(60 * 60 * 12)

// DHT Sensor Configuration
#define DHTTYPE DHT11
#define DHT_OUT_P 2

// Relay Module Pins
#define LED_P A1      // 12v, 0.5ah - 6w
#define FAN_P A2      // 12v, 0.5ah - 6w
#define HUM_P A3      // 24v, 0.8ah - 20w
#define INOUTFAN_P A4
// Total consumption = 32w/a

// Humidifier Thresholds
#define HUM_ON_THRESOLD 84
#define HUM_OFF_THRESOLD 94

// CO2 Threshold
#define CO2_HIGH_THRESHOLD 1000

// Timing Constants (in seconds)
#define IOFAN_ACTIVE_TIME 300
#define IOFAN_CYCLE_TIME 1800

// Sensor Objects
Adafruit_SHT4x sht4 = Adafruit_SHT4x();
SensirionI2cScd4x scd40;
DHT dht_out(DHT_OUT_P, DHTTYPE);

// Manual Control Flags (Override automatic)
struct {
  bool humidifier = false;
  bool fan = false;
  bool led = false;
  bool ioFan = false;
} manual;

// Automatic Control States
struct {
  bool led = false;
  bool humidifier = false;
  bool ioFan = false;
} active;

// Timers
float ledTimer = 0;
float ioFanTimer = 0;

// Sensor Data
struct {
  float humidity;
  float temperature;
  float humidityOut;
  float temperatureOut;
  uint16_t co2;
  float co2Temp;
  float co2Humidity;
} sensorData;

void setup() {
  // Initialize relay pins
  initRelays();
  
  // Initialize serial communication
  Serial.begin(9600);
  
  // Initialize SHT4x sensor
  initSHT4x();
  
  // Initialize CO2 sensor
  initCO2Sensor();
  
  // Initialize DHT sensors
  dht_out.begin();
}

void loop() {
  // Read sensor data
  readSensors();
  
  // Check and control devices
  checkHumidifier();
  checkLed();
  checkIOFan();
  
  // Handle serial communication
  processSerialCommands();
  sendSensorData();
  
  // Wait for next update
  delay(UPDATE_INTERVAL);
}

// Initialize all relay pins as output and disabled
void initRelays() {
  int relayPins[] = {LED_P, FAN_P, HUM_P, INOUTFAN_P};
  for (int pin : relayPins) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, HIGH); // Relays are active LOW
  }
}

// Initialize SHT4x temperature/humidity sensor
void initSHT4x() {
  if (!sht4.begin()) {
    Serial.println("Couldn't find SHT4x");
    while (1) delay(1);
  }
  sht4.setPrecision(SHT4X_MED_PRECISION);
  sht4.setHeater(SHT4X_NO_HEATER);
}

// Initialize CO2 sensor
void initCO2Sensor() {
  Wire.begin();
  scd40.begin(Wire, 0x62);
  scd40.startPeriodicMeasurement();
}

// Read all sensor data
void readSensors() {
  // Read SHT4x sensor
  sensors_event_t humidity, temp;
  sht4.getEvent(&humidity, &temp);
  sensorData.humidity = humidity.relative_humidity;
  sensorData.temperature = temp.temperature;
  
  // Read DHT sensors
  sensorData.humidityOut = dht_out.readHumidity();
  sensorData.temperatureOut = dht_out.readTemperature();
  
  // Read CO2 sensor
  bool co2ready = false;
  scd40.getDataReadyStatus(co2ready);
  if (co2ready) {
    scd40.readMeasurement(sensorData.co2, sensorData.co2Temp, sensorData.co2Humidity);
  }
}

// Send sensor data via serial
void sendSensorData() {
  String payload = 
    "temperature:" + String(sensorData.temperature) +
    ",temperatureOut:" + String(sensorData.temperatureOut) +
    ",humidity:" + String(sensorData.humidity) +
    ",humidityOut:" + String(sensorData.humidityOut) +
    ",humidifier:" + String(active.humidifier || manual.humidifier) +
    ",fan:" + String(active.humidifier || manual.fan) +
    ",led:" + String(active.led || manual.led) +
    ",ledTimer:"+ String(ledTimer) +
    ",ioFan:" + String(active.ioFan || manual.ioFan) +
    ",co2:" + String(sensorData.co2) +
    ",co2Temp:" + String(sensorData.co2Temp) +
    ",co2Hum:" + String(sensorData.co2Humidity);
  Serial.println(payload);
}

// Process incoming serial commands
void processSerialCommands() {
  while(Serial.available()) {
    String command = Serial.readString();
    
    // Command dispatcher
    if (command == "ON_LED") setRelay(LED_P, true, manual.led);
    else if (command == "OFF_LED") setRelay(LED_P, false, manual.led);
    else if (command == "ON_FAN") setRelay(FAN_P, true, manual.fan);
    else if (command == "OFF_FAN") setRelay(FAN_P, false, manual.fan);
    else if (command == "ON_HUM") setRelay(HUM_P, true, manual.humidifier);
    else if (command == "OFF_HUM") setRelay(HUM_P, false, manual.humidifier);
    else if (command == "ON_IO_FAN") setRelay(INOUTFAN_P, true, manual.ioFan);
    else if (command == "OFF_IO_FAN") setRelay(INOUTFAN_P, false, manual.ioFan);
  }
}

// Set relay state and update manual control flag
void setRelay(int pin, bool turnOn, bool &manualFlag) {
  manualFlag = turnOn;
  digitalWrite(pin, turnOn ? LOW : HIGH); // LOW = ON, HIGH = OFF
}

// Control humidifier based on humidity level
void checkHumidifier() {
  if (!manual.humidifier) {
    if (!active.humidifier && sensorData.humidity <= HUM_ON_THRESOLD) {
      digitalWrite(FAN_P, LOW);
      digitalWrite(HUM_P, LOW);
      active.humidifier = true;
    }
    else if (active.humidifier && sensorData.humidity >= HUM_OFF_THRESOLD) {
      digitalWrite(FAN_P, HIGH);
      digitalWrite(HUM_P, HIGH);
      active.humidifier = false;
    }
  }
}

// Control in/out fan based on CO2 level or timer
void checkIOFan() {
  if (!manual.ioFan) {
    float secondsElapsed = UPDATE_INTERVAL / 1000.0;
    
    if (sensorData.co2 > CO2_HIGH_THRESHOLD) {
      // CO2 level is high, turn on fan if not already on
      if (!active.ioFan) {
        digitalWrite(INOUTFAN_P, LOW);
        active.ioFan = true;
      }
    } else {
      // Use timer-based control
      if (!active.ioFan && ioFanTimer == 0) {
        digitalWrite(INOUTFAN_P, LOW);
        active.ioFan = true;
      }
      else if (active.ioFan && ioFanTimer >= IOFAN_ACTIVE_TIME) {
        digitalWrite(INOUTFAN_P, HIGH);
        active.ioFan = false;
      }
      
      ioFanTimer += secondsElapsed;
      
      if (ioFanTimer >= IOFAN_CYCLE_TIME) {
        ioFanTimer = 0;
      }
    }
  }
}

// Control LED based on 12-hour cycle
void checkLed() {
  if (!manual.led) {
    float secondsElapsed = UPDATE_INTERVAL / 1000.0;
    
    if (!active.led && ledTimer >= HOURS_12) {
      digitalWrite(LED_P, LOW);
      active.led = true;
      ledTimer = 0;
    }
    else if (active.led && ledTimer >= HOURS_12) {
      digitalWrite(LED_P, HIGH);
      active.led = false;
      ledTimer = 0;
    }
    
    ledTimer += secondsElapsed;
  }
}