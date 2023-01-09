import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function FAQ() {
  return (
    <>
      <View className="h-full w-full bg-[#fff] dark:bg-dark-mode-bg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex flex-col items-center justify-center">
            <View className="flex flex-col items-center justify-center">
              <Text className="text-[#000] dark:text-[#fff] text-[22px] font-bold mt-5">¿Qué es UruBuy?</Text>
              <Text className="text-[#000] dark:text-[#fff] text-[17px] font-bold p-2">
                UruBuy es una plataforma de compra y venta de productos o popularmente conocida como una app de
                e-commerce. Desde ésta aplicación podrás comprar productos de manera segura y confiable, teniendo la
                seguridad que brinda UruBuy, que verifica la identidad de cada vendedor a traves del sistema de
                identificación confirmada, que utiliza los datos reales de la cedula de identidad uruguaya, y utilizando
                el método de pago más seguro y confiable de hoy en día, PayPal. Si te interesa vender productos, no
                dudes en ingresar a http://uru-buy.me y registrarte como vendedor.
              </Text>
              <Text className="text-[#000] dark:text-[#fff] text-[22px] font-bold mt-5">¿Cómo comprar?</Text>
              <Text className="text-[#000] dark:text-[#fff] text-[17px] font-bold p-2">
                En primera instancia, deberás registrarte en la plataforma, a través del formulario de registro de esta
                aplicación, o desde la pagina principal http://uru-buy.me/ {"\n"}
                Una vez registrado, deberás validar tu correo electrónico para iniciar sesión en UruBuy. Si te gustó un
                producto, lo puedes agregar al carrito desde la página del producto, ten en cuenta que podrás agregar
                varios productos al carrito, y elegir la dirección de retiro, o de delivery en caso de que el vendedor
                acepte el mismo. Una vez que tengas todos los productos que deseas comprar en el carrito, deberás
                proceder a la realizar el checkout, donde se te listará el detalle de tus productos con sus descuentos y
                costo de delivery aplicados en caso que corresponda, y el total a pagar. Paypal ofrece los métodos de
                pagos tradicionales de Visa y Mastercard para tarjetas de crédito o débito, como también otras tarjetas
                del exterior, además de su ya conocida transferencia paypal entre cuentas. Si tu pago se procesa
                correcamente, un email con la factura de compra será enviada, y el vendedor recibirá tu orden para
                preparar. Nosotros te avisaremos cuando tu compra cambie de estado!
              </Text>
              <Text className="text-[#000] dark:text-[#fff] text-[22px] font-bold mt-5">¿Cómo calificar?</Text>
              <Text className="text-[#000] dark:text-[#fff] text-[17px] font-bold p-2">
                Las calificaciones están habilitadas a aquellos usuarios que completen una compra, y que hayan recibido
                el producto en sus manos. Para realizar una reseña de un vendedor, en la página de tu perfil puedes
                acceder a tus compras, y allí se te listaran las mismas. Elige la que desees calificar y tendrás la
                posibilidad de calificar al vendedor y a los productos de esa compra. Ten en cuenta que solamente podrás
                calificar una vez por compra, y que las calificaciones son visibles para todos los usuarios de la
                plataforma. Además, puedes subir fotos a la reseña de productos.
              </Text>
              <Text className="text-[#000] dark:text-[#fff] text-[22px] font-bold mt-5">¿Tienes alguna duda?</Text>
              <Text className="text-[#000] dark:text-[#fff] text-[17px] font-bold p-2">
                No dudes en comunicarte con nosotros a través de nuestro email urubuying@gmail, estaremos encantados de
                ayudarte
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
