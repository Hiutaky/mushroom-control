#include "DHT.h" //by adafruit (download entire library)
#include "Adafruit_SGP40.h"
#include "Adafruit_SHT4x.h"

// to-do: add support for sht40 sensor
// inside sht40
// outside dht11

Adafruit_SGP40 sgp;
Adafruit_SHT4x sht4;

#define UPDATE_INTERVAL 10000

//temperature pin, type dht11
#define DHT_P 8
#define DHT_OUT_P 2

//relé module
#define LED_P A1//12v, 0.5ah - 6w
#define FAN_P A2//12v, 0.5ah - 6w
#define HUM_P A3//24v, 0.8ah - 20w
//total consume = 32w/a

#define DHTTYPE DHT11

//humidifier settings
#define HUM_ON_THRESOLD 75
#define HUM_OFF_THRESOLD 90

// DHT dht_in(DHT_P, DHTTYPE);
DHT dht_out(DHT_OUT_P, DHTTYPE);

uint32_t HOURS_12 = (uint32_t) 60 * 60 * 12;

//manual controls - Override automatic
bool manualHum = false;
bool manualFan = false;
bool manualLed = false;

//automatic controls
bool ledActive = false;
bool humActive = false;

float ledTimer = 0;

void setup() {
  initRele(LED_P);
  initRele(FAN_P);
  initRele(HUM_P);
  Serial.begin(9600);

  //set sht4 precision to med and enable heater for self-decontamination
  sht4.setPrecision(SHT4X_MED_PRECISION);
  // sht4.setHeater(SHT4X_MED_HEATER_100MS);  
  sht4.setHeater(SHT4X_NO_HEATER);


  if( ! sht4.begin() )
    Serial.println("Unable to find SHT4 sensor");

  // dht_in.begin();
  dht_out.begin();
}

void loop() {
  /**
    Legacy DHT11 in temperature
   */
  // float h = dht_in.readHumidity();
  // float t = dht_in.readTemperature();
  sensors_event_t humidity, temp;
  sht4.getEvent(&humidity, &temp);
  float h = humidity.relative_humidity;
  float t = temp.temperature;

  float h_out = dht_out.readHumidity();
  float t_out = dht_out.readTemperature();
  checkHumidifier(h);
  checkLed();

  readSerial();
  writeSerial(h, t, h_out, t_out);
  
  delay(UPDATE_INTERVAL);
}

//set rele pins as output and disabled
void initRele(int pin) {
  pinMode(pin, OUTPUT);
  digitalWrite(pin, HIGH);
}

void writeSerial(float h, float t,float h_out, float t_out) {
  String payload = 
    "temperature:" + String(t) +
    ",temperatureOut:" + String(t_out) +
    ",humidity:" + String(h) +
    ",humidityOut:" + String(h_out) +
    ",humidifier:" + String(humActive || manualHum) +
    ",fan:" + String(humActive || manualFan) +
    ",led:" + String(ledActive || manualLed) +
    ",ledTimer:"+ String(ledTimer);
  Serial.println(payload);
}

void readSerial() {
  while(Serial.available()) {
    String command = (String) Serial.readString();
    //serial commands dispatcher
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

//manual actions
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

//automated actions
void checkHumidifier(float humidity) {
  //if manual control over LED then skip
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

void checkLed() {
  //12 hours on - 12 hours off
  //if manualLed is on (you tanking over of controls) then skip
  if( ! manualLed ) {
    if( ! ledActive && ledTimer >= HOURS_12 ) {
      digitalWrite(LED_P, LOW);
      ledActive = true;
      ledTimer = 0;
    }
    if( ledActive && ledTimer >= HOURS_12 ) {
      digitalWrite(LED_P, HIGH);
      ledActive = false;
      ledTimer = 0;
    }
    ledTimer += UPDATE_INTERVAL / 1000;//in seconds
  }
}
