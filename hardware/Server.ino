/*#include <DHT.h>*/
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Wire.h>


#define DHTPIN 5
#define DHTTYPE DHT22
 
//const char* ssid     = "iPad Pro";
//const char* password = "i7q9jm4y5cwp4";
const char* ssid     = "iPhone";
const char* password = "AAABBBCCDDE";

const char* host = "http://172.20.10.7:5000/checkLocChange?id=1&length=100.5&lat=5.02&long=1.01";
WiFiClient client;
/*DHT dht(DHTPIN,DHTTYPE);*/
void setup() {
  Serial.begin(115200);
  Wire.begin(D1, D2);
  delay(10);
  
  // We start by connecting to a WiFi network
 
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
 
 
  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
 
 
  Serial.print("Connecting to ");
  Serial.println(host);
  
  // Use WiFiClient class to create TCP connections
 
//  const int httpPort = 5000;
//  if (!client.connect(host, httpPort)) {
//    Serial.println("connection failed");
//    return;
//  }
//  else Serial.println("Server connected!");
//  /*dht.begin();*/
}
void loop(){
  Wire.beginTransmission(8); /* begin with device address 8 */
  Wire.write("0");  /* sends hello string */
  Wire.endTransmission();
  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
 
    HTTPClient http;  //Declare an object of class HTTPClient
 
    http.begin("http://172.20.10.7:5000/checkLocChange?id=1a&length=5&lat=13.73589&long=100.53385");  //Specify request destination
    int httpCode = http.GET();                                                                  //Send the request
 
    if (httpCode > 0) { //Check the returning code
 
      String payload = http.getString();  //Get the request response payload
     // Serial.println(payload);
      if(payload == "ON"){
        Serial.println(payload);
        Wire.beginTransmission(8); /* begin with device address 8 */
        Wire.write("1");  /* sends hello string */
        Wire.endTransmission();
      }else {
        Serial.println(payload);
        Wire.beginTransmission(8); /* begin with device address 8 */
        Wire.write("0");  /* sends hello string */
        Wire.endTransmission();
      }
                        //Print the response payload
 
    }
 
    http.end();   //Close connection
    
  }  
  delay(5000); 
}
