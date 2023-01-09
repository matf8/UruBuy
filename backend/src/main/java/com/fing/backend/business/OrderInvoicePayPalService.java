package com.fing.backend.business;

import com.fing.backend.business.interfaces.IOrderInvoicePayPalService;
import com.fing.backend.dao.IOrderPayPalRepositoryJpa;
import com.fing.backend.dao.mongo.IOrderPayPalRepositoryNsql;
import com.fing.backend.dao.mongo.IPayoutPayPalRepositoryNsql;
import com.mongodb.client.result.UpdateResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.fing.backend.entity.OrderInvoicePayPal;
import com.fing.backend.entity.OrderPayPal;
import com.paypal.api.payments.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@Slf4j
@EnableMongoRepositories(basePackages = "com.fing.backend.dao.mongo")
public class OrderInvoicePayPalService implements IOrderInvoicePayPalService {

    @Autowired private IOrderPayPalRepositoryNsql orderNsql;
    @Autowired private IPayoutPayPalRepositoryNsql payoutNsql;
    @Autowired private MongoTemplate mongoTemplate;
    @Autowired private IOrderPayPalRepositoryJpa paypalJpa;
    private OrderPayPal tmpOrder;

    public void saveOrderUntilSuccess(OrderPayPal order) {
        if (order != null)
            tmpOrder = order;
    }

    public OrderPayPal saveOrder(Payment payment) {
        if (Objects.nonNull(tmpOrder) && (Objects.nonNull(payment))) {
            OrderInvoicePayPal invoice = new OrderInvoicePayPal();
            invoice.setInvoice(payment);
            orderNsql.save(invoice);
            tmpOrder.setInvoiceIdMongo(invoice.getId());
            paypalJpa.save(tmpOrder);
            String tmpOrderId = tmpOrder.getId();
            invoice.setOrderId(tmpOrderId);
            updateOrderInvoice(invoice);
            return tmpOrder;
        }
        return null;
    }

    // básicamente agrega el idOrder al invoice despues de persistir para tener bidireccionalidad
    private void updateOrderInvoice(OrderInvoicePayPal invoice) {
        try {
            Query query = new Query(Criteria.where("id").is(invoice.getId()));
            Update update = new Update();
            update.set("orderId", invoice.getOrderId());
            UpdateResult result = mongoTemplate.updateFirst(query, update, OrderInvoicePayPal.class);
            if (Objects.isNull(result))
                log.warn("No documents updated");
            else
                log.info(result.getModifiedCount() + " document(s) updated..");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // bora una orden y su factura
    public void deleteOrder(String idOrder) {
        OrderPayPal order = paypalJpa.findById(idOrder).orElse(null);
        if (Objects.nonNull(order)) {
            OrderInvoicePayPal invoice = orderNsql.findItemById(order.getId());
            orderNsql.delete(invoice);
            paypalJpa.delete(order);
        }
    }
}
