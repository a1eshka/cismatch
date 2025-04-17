'use client';

import Modal from "./Modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSignUpModal from "@/app/hooks/useSingUpModal";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import apiService from "@/app/services/apiService";
import CustomButton from "../buttons/CustomButton";
import { Alert, AlertDescription } from "../../ui/alert";
import { OctagonAlert } from "lucide-react";
import { handleLogin } from "@/app/lib/actions";
import SteamLoginButton from "../buttons/SteamLoginButton";


const SignUpModal = () => {
    const router = useRouter();
    const signupModal = useSignUpModal();
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const submitSignUp = async () => {
        const formData = {
            email: email,
            password1: password1,
            password2: password2
        }

        const response = await apiService.postWithoutToken('/api/auth/register/', JSON.stringify(formData))

        if (response.access) {

            handleLogin(response.user.pk, response.access, response.refresh)

            signupModal.close();
            router.push('/')

        } else {
            const tmpErrors: string[] = Object.values(response).map((error: any) => {
                return error
            })
            setErrors(tmpErrors)
        }
    }

    const content = (
        <>

            <div className="flex flex-col items-center">
                <h2 className="mb-6 text-2xl text-center">Регистрация</h2>
                <form action={submitSignUp} className="space-y-4 w-full max-w-sm">
                    <div className="grid w-full items-center gap-1.5">
                        
                        <Input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            placeholder="Почта"
                            className="border-0 w-full"
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        
                        <Input
                            onChange={(e) => setPassword1(e.target.value)}
                            type="password"
                            placeholder="Пароль"
                            id="password1"
                            className="border-0 w-full"
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        
                        <Input
                            onChange={(e) => setPassword2(e.target.value)}
                            type="password"
                            placeholder="Повторить пароль"
                            id="password2"
                            className="border-0 w-full"
                        />
                    </div>
                    <div className="w-full flex flex-col items-center">
                        {errors.map((error, index) => (
                            <Alert variant="destructive" className="mb-2 w-full text-center" key={`error_${index}`}>
                                <OctagonAlert className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ))}
                    </div>
                    <div className="w-full flex justify-center">
                        <CustomButton label="Зарегистрироваться" onClick={submitSignUp} />
                    </div>
                    <SteamLoginButton />
                </form>
            </div>

        </>
    )

    return (
        <Modal
            isOpen={signupModal.isOpen}
            close={signupModal.close}
            label="Авторизация"
            content={content}
        />
    )
}

export default SignUpModal;