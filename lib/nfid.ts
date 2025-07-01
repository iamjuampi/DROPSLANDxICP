// Implementación básica de NFID
export class NFIDAuth {
    private static instance: NFIDAuth;
    private isLoggedIn: boolean = false;

    private constructor() {}

    public static getInstance(): NFIDAuth {
        if (!NFIDAuth.instance) {
            NFIDAuth.instance = new NFIDAuth();
        }
        return NFIDAuth.instance;
    }

    public async login(): Promise<void> {
        try {
            // Simulamos un delay para que parezca que estamos conectando con NFID
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // En desarrollo, siempre retornamos éxito
            this.isLoggedIn = true;
        } catch (error) {
            console.error("Error during NFID login:", error);
            throw error;
        }
    }

    public async logout(): Promise<void> {
        this.isLoggedIn = false;
    }

    public isAuthenticated(): boolean {
        return this.isLoggedIn;
    }
} 