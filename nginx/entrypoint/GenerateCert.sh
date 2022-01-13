#!/bin/bash
cd /etc/nginx/ssl

FILE="ca.key"
if [ ! -e $FILE ]; then
    echo "Generating CA certificates..."
    openssl genrsa 2048 > ca.key
    openssl req -new -key ca.key -sha256 -subj "/CN=Dummy Root CA" > ca.csr
    openssl x509 -req -in ca.csr -signkey ca.key -days 800 -out ca.crt -sha256
fi

FILE="server.key"
if [ ! -e $FILE ]; then
    echo "Generating server certificates..."
    openssl req -new -newkey rsa:2048 -nodes -out server.csr -keyout server.key -sha256 -config /docker-entrypoint.d/ca.conf -subj "/C=JP/ST=Aichi/O=Junki Tomatsu/CN=localhost"
    openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -days 800 -extensions v3_ext -extfile /docker-entrypoint.d/ca.conf -out server.crt -sha256
fi

echo "OK."