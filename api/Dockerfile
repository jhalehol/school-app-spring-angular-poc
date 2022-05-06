FROM maven:3.8-openjdk-18

COPY docker/assets/*.sh /app/
COPY *.sh /app/
RUN chmod +x /app/*.sh

COPY target/api-spring-boot.jar /app/
COPY key /app/
COPY key_.pub /app/

WORKDIR /app

EXPOSE 9200

ENTRYPOINT ["./entrypoint.sh"]
