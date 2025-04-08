#!/bin/sh
set -e

cd ra/middleware/SSR-master-server-main
node app.js 3000 &
node app.js 3001 &
cd -

systemctl restart haproxy

curl http://10.100.0.119:5000/
curl http://10.100.0.119:5000/

wait
kill %1
kill %2