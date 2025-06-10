import { HeroUIProvider } from "@heroui/react";
import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <HeroUIProvider>
                <App {...props} />
                <ToastContainer
                    theme="light"
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                />
            </HeroUIProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
