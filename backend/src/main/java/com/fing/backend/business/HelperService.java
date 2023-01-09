package com.fing.backend.business;

import com.fing.backend.business.interfaces.IHelperService;
import com.fing.backend.converter.PriceConverter;
import com.fing.backend.dto.ExchangeDTO;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.Transaction;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.InputStream;
import java.util.Objects;
import java.util.Properties;

@Service
public class HelperService implements IHelperService {
    public void pdfConverter(Payment payment) {
        try {
            PDPage page = new PDPage();

            String transactionId = payment.getId();
            Transaction transaction = payment.getTransactions().get(0);
            String totalUY;

            String uyu = ((ExchangeDTO) PriceConverter.getLocalExchange(Float.valueOf(transaction.getAmount().getTotal()))).getResult(); // call api exchange
            if (Objects.nonNull(uyu) && !uyu.contains("abcdefghijklmopqrstvywzABCDEFGHIJKLMNOPQRSTVYWZ!#,/*?¿"))
                totalUY = uyu;
            else totalUY = String.valueOf(Float.valueOf(transaction.getAmount().getTotal()) * 42.5);   // API CAIDA set manual

            String description = transaction.getDescription();

            String payerEmail = payment.getPayer().getPayerInfo().getEmail();
            String payerName = payment.getPayer().getPayerInfo().getFirstName();
            String payerLastName = payment.getPayer().getPayerInfo().getLastName();
            String country;
            try {
                country = payment.getPayer().getPayerInfo().getShippingAddress().getCountryCode();
            } catch (Exception e) {
                country = "Desconocido";
            }

            String city = transaction.getItemList().getShippingAddress().getCity();
            String state = transaction.getItemList().getShippingAddress().getState();
            String street1 = transaction.getItemList().getShippingAddress().getLine1();
            String street2 = transaction.getItemList().getShippingAddress().getLine2();
            String phone = payment.getPayer().getPayerInfo().getShippingAddress().getPhone();

            PDDocument document = new PDDocument();
            document.addPage(page);

            PDImageXObject pdImage = PDImageXObject.createFromByteArray(document, getBytesArrays(),"logo");
            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            contentStream.drawImage(pdImage, 475, 675);

            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 15);
            contentStream.beginText();
            // title
            contentStream.addComment("Invoice Paypal @ URUBUY");
            contentStream.setLeading(14.5f);
            contentStream.newLineAtOffset(25, 755);
            contentStream.setFont(PDType1Font.HELVETICA, 12);
            contentStream.newLine();
            contentStream.newLine();
            contentStream.newLine();
            contentStream.newLine();
            contentStream.newLine();
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
            contentStream.showText("¡Gracias por su compra en URUBUY!");
            contentStream.newLine();
            contentStream.newLine();
            contentStream.setFont(PDType1Font.HELVETICA, 12);
            contentStream.showText(payerName + ", su compra se ha realizado");
            contentStream.newLine();
            contentStream.showText("satisfactoriamente.");
            contentStream.newLine();
            contentStream.showText("Guarde este recibo en caso de algún problema.");
            contentStream.newLine();
            contentStream.showText("Por reembolsos comunicarse con la administración (urubuying@gmail.com).");
            contentStream.newLine();
            contentStream.newLine();
            contentStream.newLine();

            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 15);
            // billing
            contentStream.showText("Dirección de facturación");
            contentStream.setFont(PDType1Font.HELVETICA, 12);
            contentStream.newLine();
            contentStream.newLine();

            contentStream.showText("País: " + country + ", Departamento: " + state + ", Ciudad: " + city);
            contentStream.newLine();
            contentStream.newLine();

            contentStream.showText((Objects.isNull(street1)?"":street1) + " " + (Objects.isNull(street2)?"":street2));
            contentStream.newLine();
            contentStream.newLine();

            contentStream.showText("Telefóno: " + (Objects.isNull(phone)?"Sin telefono":phone));
            contentStream.newLine();
            contentStream.newLine();

            contentStream.showText("Email: " + payerEmail);
            contentStream.newLine();
            contentStream.newLine();
            contentStream.newLine();

            // total
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 15);
            contentStream.showText("Total: $U " + totalUY);
            contentStream.setFont(PDType1Font.HELVETICA, 12);
            contentStream.newLine();
            contentStream.newLine();
            contentStream.showText("Transacción: " + transaction.getRelatedResources().get(0).getSale().getId());
            contentStream.newLine();
            contentStream.newLine();
            contentStream.showText("Descripción de compra: " + (Objects.isNull(description)?"Sin descripción":description));

            contentStream.endText();
            contentStream.close();

            PDDocumentInformation pdd = document.getDocumentInformation();

            //Setting the author of the document
            pdd.setAuthor("Urubuy");
            // Setting the title of the document
            pdd.setTitle("Factura - UruBuy");
            document.save(transactionId + ".pdf");
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendInvoice(String correo, String name) {

        String to = correo; //Email address of the recipient
        final String user="urubuying@gmail.com"; //Email address of sender
        final String password="emjuahjtoiqnldqq";  //Password of the sender's email

        //Get the session object
        Properties p = new Properties();

        //Here pass your smtp server url
        p.put("mail.smtp.host", "smtp.gmail.com");
        p.setProperty("mail.smtp.starttls.enable", "true");
        p.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        p.setProperty("mail.smtp.port", "587");
        p.setProperty("mail.smtp.user", "correo");
        p.setProperty("mail.smtp.auth", "true");

        Session session = Session.getDefaultInstance(p, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(user,password);
            }
        });
        //Compose message
        try{
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(user));
            message.addRecipient(Message.RecipientType.TO,new InternetAddress(to));
            message.setSubject("Invoice paypal - Urubuy");

            //Create MimeBodyPart object and set your message text
            BodyPart messageBodyPart1 = new MimeBodyPart();
            messageBodyPart1.setText("Gracias por su compra");

            //Create new MimeBodyPart object and set DataHandler object to this object
            MimeBodyPart messageBodyPart2 = new MimeBodyPart();
            String filename = name + ".pdf";
            DataSource source = new FileDataSource(filename);
            messageBodyPart2.setDataHandler(new DataHandler(source));
            messageBodyPart2.setFileName(filename);

            //Create Multipart object and add MimeBodyPart objects to this object
            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(messageBodyPart1);
            multipart.addBodyPart(messageBodyPart2);

            //Set the multiplart object to the message object
            message.setContent(multipart);

            //Send message
            Transport t = session.getTransport("smtp");
            t.connect(user,password);
            t.sendMessage(message, message.getAllRecipients());
            t.close();

            System.out.println("message sent....");
        } catch (MessagingException ex) {
            ex.printStackTrace();
        }
    }

    private byte[] getBytesArrays() throws Exception {
        InputStream icon = getClass().getClassLoader().getResourceAsStream("icon.png");
        return icon.readAllBytes();
    }
}