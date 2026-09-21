import React, { useState, useEffect } from "react";
import "./Loader.css";
import logoCapibara from "../iimg/CAPIBARA.png";

export default function Loader({ onReady }) {
    const [progress, setProgress] = useState(12);
    const [statusText, setStatusText] = useState("Iniciando entorno...");
    const [isExiting, setIsExiting] = useState(false);
    const [isUnmounted, setIsUnmounted] = useState(false);

    useEffect(() => {
        // Bloquear scroll mientras la cortina cubre la pantalla
        document.body.style.overflow = "hidden";

        // Medición real de recursos críticos de la aplicación
        const criticalImages = [logoCapibara];
        let loadedResources = 0;
        const totalResources = criticalImages.length + 2; // +1 fuentes +1 DOM ready

        let target = 25;

        const notifyLoaded = () => {
            loadedResources++;
            const computedTarget = Math.round((loadedResources / totalResources) * 85);
            target = Math.max(target, computedTarget);
        };

        // 1. Precarga de imágenes principales
        criticalImages.forEach((src) => {
            const img = new Image();
            img.src = src;
            img.onload = notifyLoaded;
            img.onerror = notifyLoaded;
        });

        // 2. Comprobación de fuentes del sistema
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(notifyLoaded).catch(notifyLoaded);
        } else {
            notifyLoaded();
        }

        // 3. Comprobación de estado del DOM
        if (document.readyState === "complete") {
            notifyLoaded();
        } else {
            window.addEventListener("load", notifyLoaded, { once: true });
        }

        // RED DE SEGURIDAD: Forzar que el target suba de forma controlada
        const safetyTimer = setTimeout(() => {
            target = 100;
        }, 2200);

        // Ticker ajustado para que la animación sea fluida y se alcance a apreciar el efecto visual
        const ticker = setInterval(() => {
            setProgress((prev) => {
                const step = 1; // Avance constante y suave de 1 en 1 para que se note la carga
                const next = Math.min(prev + step, 100);

                // Mensajes técnicos según la fase de preparación
                if (next < 35) {
                    setStatusText("Verificando constelaciones y magia...");
                } else if (next < 60) {
                    setStatusText("Sincronizando el bosque estelar...");
                } else if (next < 70) {
                    setStatusText("Preparando melodías y estrellas...");
                } else {
                    setStatusText("¡Bosque preparado!");
                }

                // UMBRAL DEL 70%: Se inicia la salida elegante de la cortina
                if (next >= 70 && !isExiting) {
                    setIsExiting(true);
                    // Restaurar el scroll de inmediato para no bloquear la navegación
                    document.body.style.overflow = "";
                    if (onReady) onReady();
                }

                if (next >= 100) {
                    clearInterval(ticker);
                    return 100;
                }
                return next;
            });
        }, 45); // Intervalo ligeramente mayor para que la barra avance de forma perceptible a la vista

        return () => {
            clearInterval(ticker);
            clearTimeout(safetyTimer);
            document.body.style.overflow = "";
        };
    }, [isExiting, onReady]);

    // Desmontar el componente una vez completada la transición CSS hacia arriba (850ms)
    useEffect(() => {
        if (isExiting) {
            const timer = setTimeout(() => {
                setIsUnmounted(true);
            }, 850);
            return () => clearTimeout(timer);
        }
    }, [isExiting]);

    if (isUnmounted) return null;

    return (
        <div className={`loader-screen ${isExiting ? "curtain-exit" : ""}`} role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <div id="container">

                <div className="loading-title">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                    <span>Inicializando Festival Estelar</span>
                </div>

                {/* CONTENEDOR DE LOGO CON AROS GIRATORIOS */}
                <div className="logo-container">
                    <div className="loading-circle sp1"></div>
                    <div className="loading-circle sp2"></div>
                    <div className="loading-circle sp3"></div>

                    {/* Logo principal CAPIBARA */}
                    <img
                        src={logoCapibara}
                        alt="Capibara"
                        className="loader-logo"
                    />
                </div>

                {/* IDENTIDAD PRINCIPAL */}
                <div className="brand-name">
                    CAPIBARA-CODEX
                </div>

                {/* SEGUNDA IDENTIDAD OFICIAL */}
                <div className="brand-secondary">
                    <span className="brand-secondary-text">[ ING. ALEJANDRO MARREROS ]</span>
                </div>

                {/* TEXTO DE ESTADO Y PORCENTAJE NUMÉRICO REAL */}
                <div className="loading-text">
                    <span>{statusText}</span>
                    <span className="loading-percentage">{progress}%</span>
                </div>

                {/* BARRA DE PROGRESO DINÁMICA */}
                <div className="loader-bar">
                    <div
                        className="loader-bar-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

            </div>
        </div>
    );
}