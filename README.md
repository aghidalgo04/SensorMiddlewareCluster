# SensorMiddlewareCluster

SensorMiddlewareCluster is a distributed system designed to monitor, encrypt, and visualize environmental data such as temperature, humidity, CO2 levels, and volatile organic compounds. The architecture ensures secure data transmission from sensors to a central database using a combination of load balancers, custom middleware, and MQTT protocols.

## Overview

This project implements a complete IoT pipeline. Sensors send data via HTTP POST requests, which are distributed by a load balancer to middleware nodes. These nodes translate the HTTP requests into MQTT messages for a broker. A separate database middleware subscribes to the broker and persists the data into a MySQL database. Finally, the data is visualized using Grafana, and a specific "Personal Service" provides statistical analysis via a REST API.

## Architecture

The system consists of the following components:

1.  **Sensors**: Simulated edge devices that collect environmental data.
2.  **Load Balancer (HAProxy)**: Distributes incoming HTTP traffic from sensors to the middleware nodes using a Round-Robin algorithm.
3.  **Sensor Middleware**: Receives encrypted HTTP data, decrypts it, and publishes it to the MQTT broker.
4.  **MQTT Broker**: Acts as the central message bus.
5.  **Database Middleware**: Subscribes to MQTT topics and inserts the received data into the MySQL database.
6.  **Storage**: MySQL database for persistent data storage.
7.  **Visualization**: Grafana dashboard connected to the database.
8.  **Personal Service**: A REST API that queries the database for statistics (e.g., average CO2), protected by a Leaky Bucket rate limiter.

## Security Features

The system prioritizes security through several layers:

-   **Encryption**: Communication between sensors and middleware is encrypted using AES-128 in CTR mode with a unique Initialization Vector (IV) for each message.
-   **IP Whitelisting**: Access to the load balancer and middleware is restricted to a configured list of allowed IP addresses.
-   **Rate Limiting**: The Personal Service implements a Leaky Bucket algorithm to prevent abuse and manage traffic spikes.

## Usage Guide

To use the project, follow these simple steps:

### Step 1: Download
Clone the project to your desired directory using the following command:

```bash
git clone [https://gitlab.etsisi.upm.es/bt0106/ra.git](https://gitlab.etsisi.upm.es/bt0106/ra.git)
```

### Step 2: Access Directory
Enter the project folder:

```bash
cd ra
```

### Step 3: Execution
Once inside the folder, execute the startup script:

```bash
sudo sh start.sh
```

### System Status
Once executed, the project will be running, and you will see a TMux terminal divided into four panes:

* **Left (2 panes):** These belong to the sensor middleware, running on ports **3000** and **3001**.
* **Top Right:** This pane belongs to the database middleware.
* **Bottom Right:** This executes the service that connects the client to the database and enables the use of the implemented requests.

---

### Manual Testing & Commands
All components can also be tested individually once all services have been started.

#### Test Sensor Middlewares
To send a record, use the following command:

```bash
curl "http://10.100.0.119:5000/record?id_nodo={ID}&temperatura={NUM}&humedad={NUM}&co2={NUM}&volatiles={NUM}"
```

#### MQTT Subscription
To subscribe to a "channel":

```bash
mosquitto_sub -h 10.100.0.119:1883 -t node/#
```

#### MQTT Publishing
To publish to a "channel":

```bash
mosquitto_pub -h 10.100.0.119:1883 -t node/{ID} -m {MENSAJE}
```

#### Test Personal Service
To test the personal service endpoints:

**Get CO2 Average:**
```bash
curl "http://10.100.0.119:4000/media_co2?fecha_inicio={UNIX}&fecha_fin={UNIX}"
```

**Get High CO2 Date:**
```bash
curl "http://10.100.0.119:4000/fecha_co2_alto?fecha_inicio={UNIX}&fecha_fin={UNIX}"
```
