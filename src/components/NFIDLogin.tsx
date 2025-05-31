import React, { useState } from 'react';
import { NFIDAuth } from '../lib/nfid';

export const NFIDLogin: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const auth = NFIDAuth.getInstance();
            await auth.login();
            // Aquí puedes agregar la lógica después del login exitoso
            // Por ejemplo, redirigir al usuario o actualizar el estado de la aplicación
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <button
                onClick={handleLogin}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
                {isLoading ? 'Connecting...' : 'Login with NFID'}
            </button>
            {error && (
                <p className="text-red-500 mt-2">{error}</p>
            )}
        </div>
    );
}; 