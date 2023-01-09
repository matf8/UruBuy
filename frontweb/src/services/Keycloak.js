import Keycloak from "keycloak-js";

const keycloakCfg = new Keycloak({
  url: "http://urubuy.ddns.net:8080",
  realm: "Urubuy",
  clientId: "urubuyWeb2",
});

export default keycloakCfg;
