#include "DHT.h"

#define DHT_P 8
#define DHTTYPE DHT11
#define UPDATE_INTERVAL 6000 //in ms

DHT dht(DHT_P, DHTTYPE);

void setup() {
  Serial.begin(9600); // Starts the serial communication

  dht.begin();
}
void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  String payload = "temperature:" + String(t) +",humidity:" + String(h);
  Serial.println(payload);

  delay(6000);
}