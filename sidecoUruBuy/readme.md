# SIDECO URUBUY

Dos tipos de cédulas puden ser validadas.

- Cédulas anteriores al año 2014 (idCardOld)
Para validar la identidad de una persona se utiliza el NÚMERO DE IDENTIFICACIÓN, la SERIE y el FOLIO. 

- Cédulas posteriores al año 2014 (idCardNew)
Para validar la identidad de una persona se utiliza el NÚMERO DE IDENTIFICACIÓN y el SECRET CODE.


# Spring-boot MAVEN Project

* mvn install
* mvn spring-boot:run

# Cloud deploy
* aws s3 cp ./target/sidecoUruBuy.jar s3://elasticbeanstalk-eu-west-1-225418768382/

### https://sideco.uru-buy.me/
