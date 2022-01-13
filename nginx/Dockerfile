FROM nginx:latest

ADD entrypoint/GenerateCert.sh /docker-entrypoint.d
ADD entrypoint/ca.conf /docker-entrypoint.d

RUN chmod a+x /docker-entrypoint.d/GenerateCert.sh