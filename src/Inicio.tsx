import React from 'react';

type InicioProps = {
    onLoginClick: () => void;
    onSearchClick: () => void;
};

const Inicio: React.FC<InicioProps> = ({ onLoginClick, onSearchClick }) => {
    return (
        <div className="app-container">
            <div className="background-image"></div> {/* Div para la imagen de fondo */}
            <div className="inicio-container">
                <h1 className="text-4xl font-bold text-white mb-8">
                    Bienvenido al Sistema de Órdenes de Servicio
                </h1>
                <div className="flex flex-col items-center"> {/* Centra los botones */}
                    <button 
                        className="inicio-button mb-4" // Margen inferior para separar
                        onClick={onLoginClick}
                    >
                        Iniciar sesión  
                    </button>
                    <button 
                        className="inicio-button"
                        onClick={onSearchClick}
                    >
                        Buscar orden
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Inicio;
