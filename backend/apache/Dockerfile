FROM php:7.4-apache-buster
COPY php.ini /usr/local/etc/php/

# Install PHP Modules
RUN docker-php-ext-install mysqli

# Generate Self Signed Certificate and enable ssl
RUN mkdir -p /etc/apache2/ssl/
RUN a2enmod ssl
WORKDIR /etc/apache2/ssl/
RUN openssl genrsa -out private.key 2048 && \
    openssl req -new -sha256 -key private.key -subj /CN=localhost -out ssl.csr && \
    echo "subjectAltName = DNS:localhost" > san.txt
RUN openssl x509 -req -sha256 -days 365 -signkey private.key -in ssl.csr -out server.crt -extfile san.txt
RUN sed -i -e 's/\/etc\/ssl\/certs\/ssl\-cert\-snakeoil\.pem/\/etc\/apache2\/ssl\/server\.crt/' \
    -i -e 's/\/etc\/ssl\/private\/ssl\-cert\-snakeoil\.key/\/etc\/apache2\/ssl\/private\.key/' \
    /etc/apache2/sites-available/default-ssl.conf
RUN sed -i -e 's/ServerTokens\sOS/ServerTokens Prod/' \
    /etc/apache2/conf-available/security.conf
RUN a2ensite default-ssl

    
# ADD ../www/ /var/www/html/