import { AndroidLogo } from "phosphor-react";
import P1 from "../assets/P1.jpg";
import P2 from "../assets/P2.jpg";
import P3 from "../assets/P3.jpg";
import P4 from "../assets/P4.jpg";
import P5 from "../assets/P5.jpg";
import P6 from "../assets/P6.jpg";

export default function UrubuyApp() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="pt-16 pb-44 sm:pt-24 sm:pb-40 lg:pb-48">
        <div className="relative px-4 mx-auto max-w-7xl sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 font sm:text-6xl">
              ¡Descarga nuestra nueva App!
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Continúa comprando tus artículos más deseados desde tu celular de manera fácil y cómoda.
            </p>
          </div>
          <div>
            <div className="mt-10">
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-2 lg:mx-auto lg:w-full lg:max-w-7xl "
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 overflow-hidden rounded-lg w-44 sm:opacity-0 lg:opacity-100">
                        <img src={P2} alt="" className="object-cover object-center w-full h-full" />
                      </div>
                      <div className="h-64 overflow-hidden rounded-lg w-44">
                        <img src={P1} alt="" className="object-cover object-center w-full h-full" />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 overflow-hidden rounded-lg w-44">
                        <img src={P4} alt="" className="object-cover object-center w-full h-full" />
                      </div>
                      <div className="h-64 overflow-hidden rounded-lg w-44">
                        <img src={P3} alt="" className="object-cover object-center w-full h-full" />
                      </div>
                      <div className="h-64 overflow-hidden rounded-lg w-44">
                        <img src={P6} alt="" className="object-cover object-center w-full h-full" />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 overflow-hidden rounded-lg w-44">
                        <img src={P5} alt="" className="object-cover object-center w-full h-full" />
                      </div>
                      <div className="h-64 overflow-hidden rounded-lg w-44">
                        <img
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-07.jpg"
                          alt=""
                          className="object-cover object-center w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <a href="https://drive.google.com/uc?id=1lvvzbJNy64CBMNJxIGlwk8XGJaSHXy-w&export=download&confirm=t">
                <button
                  type="button"
                  className="absolute flex px-5 py-3 items-center justify-center text-base font-medium text-white border border-transparent rounded-md bg-sky-900 bottom-70 left-60 hover:bg-indigo-700"
                >
                  <AndroidLogo className="mr-5" size={32} color="#ffffff" weight="fill" />
                  Descargar
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
