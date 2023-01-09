import { useKeycloak } from "@react-keycloak/web";

export default function DropdownComponent() {
    const { keycloak } = useKeycloak();

    return (
        <div className="inline-flex bg-blue-500 border rounded-md">
            {!keycloak.authenticated && (
                <a
                    href="#"
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-yellow-500 rounded-l-md"
                >
                    Menu  ({keycloak.tokenParsed?.preferred_username})
                </a>
            )}

            <div className="relative">
                <button
                    type="button"
                    className="inline-flex items-center justify-center h-full px-2 text-gray-600 border-l border-gray-100 hover:text-gray-700 rounded-r-md hover:bg-yellow-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                <div className="absolute right-0 z-10 w-56 mt-4 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg p-2 
            [&>a]:block [&>a]:px-4 [&>a]:py-2 [&>a]:text-sm [&>a]:text-gray-500 [&>a]:rounded-lg [&>a]:hover:bg-yellow-500 [&>a]:hover:text-gray-700">
                    {!keycloak.authenticated && (
                        <>
                            <a href="#">Mi perfil</a>
                            <a href="#">Reclamos</a>
                            <a href="#">Mis compras</a>
                            <a href="#">Salir</a>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
