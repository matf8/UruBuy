import { Button } from "@mui/material";

function Success() {
  const handleNavigate = () => {
    window.location.replace("/homeseller");
  };

  return (
    <>
      <div className="mb-10 text-xl">Felicitaciones, haga click en el boton para comenzar a vender 💸💸</div>
      <Button variant="contained" color="success" onClick={handleNavigate}>
        Comenzar
      </Button>
      <div className="mt-8">
        <img
          src="https://img.freepik.com/vector-gratis/analistas-demanda-dandose-mano-pantallas-portatiles-planificando-demanda-futura-planificacion-demanda-analisis-demanda-ilustracion-concepto-pronostico-ventas-digitales_335657-2098.jpg?w=1380&t=st=1668133010~exp=1668133610~hmac=40ec9c4079a0a6671513e4ad28ced729eb8492e65cddfad77119ea760ec0c399 "
          className="block mx-auto rounded-full h-80 sm:mx-0 sm:shrink-0"
        />
      </div>
    </>
  );
}

export default Success;
