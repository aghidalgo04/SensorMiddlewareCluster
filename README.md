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

## Prerequisites

Before running the project, ensure you have the following installed:

-   Git
-   A Linux-based environment (or WSL on Windows)
-   Basic tools: `curl` and `mosquitto-clients` (for testing)

## Getting Started and Setup

Follow these steps to deploy the system locally.

### 1. Clone the Repository

Download the project source code:

```bash
git clone [https://github.com/aghidalgo04/SensorMiddlewareCluster.git](https://github.com/aghidalgo04/SensorMiddlewareCluster.git)
cd SensorMiddlewareCluster
```

### 2. Launch the System

The project includes a shell script that automates the initialization of all services. Run the following command from the project root:

```bash
sudo sh start.sh
```

### 3. Verify Deployment

After running the start script, the system will launch a TMux session divided into four panes:

-   **Left Panes**: Sensor Middleware instances running on ports 3000 and 3001.
-   **Top Right Pane**: Database Middleware.
-   **Bottom Right Pane**: Personal Service running on port 4000.

The Load Balancer (HAProxy) will be listening on port 5000.

## Usage

You can interact with the system components using command-line tools.

### Simulating Sensor Data

To send a data packet (simulating a sensor), use `curl` to target the load balancer. Note that in a real scenario, this payload should be encrypted, but for testing the endpoint:

```bash
curl http://10.100.0.119:5000/record?id_nodo={ID}&temperatura={VAL}&humedad={VAL}&co2={VAL}&volatiles={VAL}"
```

### MQTT Interaction

You can subscribe to the broker to observe the data flow:

```bash
mosquitto_sub -h 10.100.0.119 -p 1883 -t node/#
```

To manually publish a message to a specific node topic:

```bash
mosquitto_pub -h 10.100.0.119 -p 1883 -t node/{ID} -m "{MESSAGE}"
```

### Personal Service

The Personal Service provides specific data insights. You can query it using standard GET requests:

**Get Average CO2:**

```bash
curl "http://10.100.0.119:4000/media_co2?fecha_inicio={TIMESTAMP}&fecha_fin={TIMESTAMP}"
```

**Get Date of Highest CO2:**

```bash
curl "http://10.100.0.119:4000/fecha_co2_alto?fecha_inicio={TIMESTAMP}&fecha_fin={TIMESTAMP}"
```
