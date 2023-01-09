import { useState } from 'react'

import { sendDealsNtfy, sendNewsNtfy } from '../../services/Requests'

export default function MobileNif() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const send = () => {
        sendDealsNtfy()
    }
    return (
        <div className="bg-white isolate">
            <div className="">

            </div>
            <div className="px-6 pt-6 lg:px-8">
                <div>
                    <nav className="flex items-center justify-between h-9" aria-label="Global">
                        <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Urubuy</span>
                            </a>
                        </div>



                    </nav>

                </div>
            </div>
            <main>
                <div className="relative px-6 lg:px-8">
                    <div className="max-w-3xl pt-20 pb-32 mx-auto sm:pt-48 sm:pb-40">
                        <div>

                            <div>
                                <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                                    Notificaciones Push
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                                    Por favor, seleccione haciendo click la notificación a enviar.
                                </p>
                                <div className="flex mt-8 gap-x-4 sm:justify-center">
                                    <button
                                        onClick={() => sendDealsNtfy()}
                                        className="inline-block rounded-lg bg-blue-800 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1  "
                                    >
                                        Enviar ofertas
                                        <span className="text-indigo-200" aria-hidden="true">
                                            &rarr;
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => sendNewsNtfy()}
                                        className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                                    >
                                        Enviar noticias
                                        <span className="text-gray-400" aria-hidden="true">
                                            &rarr;
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div >

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
