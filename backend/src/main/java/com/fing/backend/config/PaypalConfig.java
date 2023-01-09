package com.fing.backend.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;

@Configuration
public class PaypalConfig {

	@Value("${paypal.client.id}")
	private String clientId;
	@Value("${paypal.client.secret}")
	private String clientSecret;
	@Value("${paypal.mode}")
	private String mode;
	@Value("${nvp.user}")
	private String userNvp;
	@Value("${nvp.pass}")
	private String passNvp;
	@Value("${nvp.signature}")
	private String firmaNvp;

	@Bean
	public APIContext apiContext() throws PayPalRESTException {
		return new APIContext(clientId, clientSecret, mode);
	}

	@Bean
	public Map<String,String> getAcctAndConfig(){
		Map<String,String> configMap = new HashMap<String,String>();
		configMap.put("mode", "sandbox");
		// Account Credential
		configMap.put("acct1.UserName", userNvp);
		configMap.put("acct1.Password", passNvp);
		configMap.put("acct1.Signature", firmaNvp);
		return configMap;
	}
}
