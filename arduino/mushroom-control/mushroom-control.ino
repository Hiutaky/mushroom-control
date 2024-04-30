#include "DHT.h"

#define DHT_P 8//d
#define LED_P A1
#define FAN_P A2
#define HUM_P A3
#define DHTTYPE DHT11
#define UPDATE_INTERVAL 6000 //in ms

DHT dht(DHT_P, DHTTYPE);

bool ledActive = false;
bool fanActive = false;
bool humActive = false;

void setup() {
  Serial.begin(9600); // Starts the serial communication
  pinMode(LED_P, OUTPUT);
  pinMode(FAN_P, OUTPUT);
  pinMode(HUM_P, OUTPUT);
  dht.begin();
}
void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  String payload = "temperature:" + String(t) +",humidity:" + String(h);
  Serial.println(payload);
  
  if( humActive ) {
    digitalWrite(HUM_P, LOW);
    humActive = false;
  } else {
    digitalWrite(HUM_P, HIGH);
    humActive = true;
  }
  
  if( ledActive ) {
    digitalWrite(LED_P, LOW);
    ledActive = false;
  } else {
    digitalWrite(LED_P, HIGH);
    ledActive = true;
  }
  
  if( fanActive ) {
    digitalWrite(FAN_P, LOW);
    fanActive = false;
  } else {
    digitalWrite(FAN_P, HIGH);
    fanActive = true;
  }
  
  delay(6000);
  

  
}
