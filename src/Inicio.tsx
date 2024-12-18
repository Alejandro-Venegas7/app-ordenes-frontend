import React from 'react';

type InicioProps = {
    onLoginClick: () => void;
    onSearchClick: () => void;
    onScheduleAppointmentClick: () => void; // Nuevo prop
};

const Inicio: React.FC<InicioProps> = ({ 
    onLoginClick, 
    onSearchClick, 
    onScheduleAppointmentClick // Añadir este parámetro
}) => {
    return (
        <div className="app-container">
            <div className="background-image"></div>
            <div className="inicio-container">
                <h1 className="text-4xl font-bold text-white mb-8">
                    Bienvenido al Sistema de Órdenes de Servicio
                </h1>
                <div className="flex flex-col items-center">
                    <button 
                        className="inicio-button mb-10"
                        onClick={onLoginClick}
                    >
                        Iniciar sesión  
                    </button>
                    <button 
                        className="inicio-button mb-4"
                        onClick={onSearchClick}
                    >
                        Buscar orden
                    </button>
                    <button 
                        className="inicio-button mb-4"
                        onClick={onScheduleAppointmentClick} // Nuevo botón
                    >
                        Agendar Cita
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Inicio;