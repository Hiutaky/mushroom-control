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

#define HOURS_12 60 * 60 * 12 * 1000

DHT dht(DHT_P, DHTTYPE);

bool ledActive = false;
bool humActive = false;
int timer = 0;

void setup() {
  pinMode(LED_P, OUTPUT);
  pinMode(FAN_P, OUTPUT);
  pinMode(HUM_P, OUTPUT);
  Serial.begin(9600);
  dht.begin();
}
void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  
  checkHumidifier();
  checkLight();
  
  String payload = 
    "temperature:" + String(t) +
    ",humidity:" + String(h) +
    ",humidifier:" + String(humActive) +
    ",light:" + String(ledActive);
  Serial.println(payload);

  delay(UPDATE_INTERVAL);
}

void checkHumidifier(float humidity) {
  //activate humidifier if humidity <= minimum threshold
  if( ! humActive && humidity <= HUM_ON_THRESOLD ) {
    digitalWrite(FAN_P, HIGH);
    digitalWrite(HUM_P, HIGH);
    humActive = true;
  }
  //deactivate humidifier if humidity >= max threshold
  if( humActive && humidity >= HUM_OFF_THRESOLD ) {
    digitalWrite(FAN_P, LOW);
    digitalWrite(HUM_P, LOW);
    humActive = false;
  }
}

void checkLight() {
  //12 hours on - 12 hours off
  if( ! ledActive && timer >= HOURS_12 ) {
    digitalWrite(LED_P, HIGH);
    ledActive = true;
    timer = 0;
  }
  if( ledActive && timer >= HOURS_12 ) {
    digitalWrite(LED_P, LOW);
    ledActive = false;
    timer = 0;
  }
  timer += UPDATE_INTERVAL;
}