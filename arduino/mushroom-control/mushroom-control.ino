#include "DHT.h"

#define DHT_P 8
#define LED_P A1//12v, 0.5ah - 6w
#define FAN_P A2//12v, 0.5ah - 6w
#define HUM_P A3//24v, 0.8ah - 20w
//total consume = 32w/a

#define DHTTYPE DHT11
#define UPDATE_INTERVAL 10000

#define HUM_ON_THRESOLD 75
#define HUM_OFF_THRESOLD 90

enum Actions { ON_LIGHT };

DHT dht(DHT_P, DHTTYPE);

uint32_t HOURS_12 = (uint32_t) 60 * 60 * 12;
//manual
bool manualHum = false;
bool manualFan = false;
bool manualLed = false;

//automated
bool ledActive = false;
bool humActive = false;


float timer = 0;

void setup() {
  initPin(LED_P);
  initPin(FAN_P);
  initPin(HUM_P);
  Serial.begin(9600);
  dht.begin();
}

void initPin(int pin) {
  pinMode(pin, OUTPUT);
  digitalWrite(pin, HIGH);
}
void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  checkHumidifier(h);
  checkLight();

  readSerial();
  
  String payload = 
    "temperature:" + String(t) +
    ",humidity:" + String(h) +
    ",humidifier:" + String(humActive || manualHum) +
    ",fan:" + String(humActive || manualFan) +
    ",light:" + String(ledActive || manualLed) +
    ",lightTimer:"+ String(timer);
  Serial.println(payload);

  delay(UPDATE_INTERVAL);
}

void readSerial() {
  while(Serial.available()) {
    String command = (String) Serial.readString();
    if( command == "ON_LED" ) 
      on_led();
    if( command == "OFF_LED" ) 
      off_led();
    if( command == "ON_FAN" ) 
      on_fan();
    if( command == "OFF_FAN" ) 
      off_fan();
    if( command == "ON_HUM" ) 
      on_hum();
    if( command == "OFF_HUM" ) 
      off_hum();
  }
}

void on_led() {
  if( ! manualLed )
    manualLed = true;
  digitalWrite(LED_P, LOW); 
}
void off_led() {
  if( manualLed )
    manualLed = false;
  digitalWrite(LED_P, HIGH); 
}

void on_fan() {
  if( ! manualFan )
    manualFan = true;
  digitalWrite(FAN_P, LOW); 
}
void off_fan() {
  if( manualFan )
    manualFan = false;
  digitalWrite(FAN_P, HIGH); 
}


void on_hum() {
  if( ! manualHum )
    manualHum = true;
  digitalWrite(HUM_P, LOW); 
}
void off_hum() {
  if( manualHum )
    manualHum = false;
  digitalWrite(HUM_P, HIGH); 
}


void checkHumidifier(float humidity) {
  if( ! manualHum ) {
    //activate humidifier if humidity <= minimum threshold
    if( ! humActive && humidity <= HUM_ON_THRESOLD ) {
      digitalWrite(FAN_P, LOW);
      digitalWrite(HUM_P, LOW);
      humActive = true;
    }
    //deactivate humidifier if humidity >= max threshold
    if( humActive && humidity >= HUM_OFF_THRESOLD ) {
      digitalWrite(FAN_P, HIGH);
      digitalWrite(HUM_P, HIGH);
      humActive = false;
    }
  }
}

void checkLight() {
  //12 hours on - 12 hours off
  if( ! manualLed ) {
    if( ! ledActive && timer >= HOURS_12 ) {
      digitalWrite(LED_P, LOW);
      ledActive = true;
      timer = 0;
    }
    if( ledActive && timer >= HOURS_12 ) {
      digitalWrite(LED_P, HIGH);
      ledActive = false;
      timer = 0;
    }
    timer += UPDATE_INTERVAL / 1000;//calculate seconds
  }
}
