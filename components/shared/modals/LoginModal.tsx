'use client';

import Modal from "./Modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useLoginModal from "@/app/hooks/useLoginModal";
import { Input } from "../../ui/input";
import useSingUpModal from "@/app/hooks/useSingUpModal";
import CustomButton from "../buttons/CustomButton";
import { handleLogin } from "@/app/lib/actions";
import { Alert, AlertDescription } from "../../ui/alert";
import { OctagonAlert } from "lucide-react";
import apiService from "@/app/services/apiService";
import SteamLoginButton from "../buttons/SteamLoginButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

// Схема валидации с использованием zod
const loginSchema = z.object({
    email: z.string().email("Введите корректный email"),
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginModal = () => {
    const router = useRouter();
    const loginModal = useLoginModal();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const {
        control,
        handleSubmit,
        formState: { errors: formErrors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const handleSteamLogin = async () => {
        setLoading(true);
        try {
            const response = await apiService.postWithoutToken('/api/auth/login/steam/', {});
            const { access, refresh, user_id } = response;

            await handleLogin(user_id, access, refresh);
            console.log('Steam login successful');
        } catch (error) {
            console.error('Steam login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const submitLogin = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const response = await apiService.postWithoutToken('/api/auth/login/', JSON.stringify(data));

            if (response.access) {
                await handleLogin(response.user.pk, response.access, response.refresh);
                loginModal.close();
                router.push('/');
            } else {
                setErrors(response.non_field_errors || []);
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors(["Произошла ошибка при входе. Пожалуйста, попробуйте снова."]);
        } finally {
            setLoading(false);
        }
    };

    const signUpModal = useSingUpModal();  // Функция переключения на регистрацию
    const handleOpenSignUp = () => {
            loginModal.close();  // Закрываем окно логина
            signUpModal.open();  // Открываем окно регистрации
        };

    const content = (
        <>
            <form className="space-y-4 mt-4">
                <div className="grid w-full items-center gap-1.5">
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="email"
                                id="email"
                                placeholder="Почта"
                                className="border-0"
                            />
                        )}
                    />
                    {formErrors.email && (
                        <Alert variant="destructive" className="border-none -mt-4 -ml-4">
                            <AlertDescription className="text-xs">{formErrors.email.message}</AlertDescription>
                        </Alert>
                    )}
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="password"
                                placeholder="Пароль"
                                id="password"
                                className="border-0"
                            />
                        )}
                    />
                    {formErrors.password && (
                        <Alert variant="destructive" className="border-none -mt-4 -ml-4">
                            <AlertDescription className="text-xs">{formErrors.password.message}</AlertDescription>
                        </Alert>
                    )}
                </div>
                <div>
                    {errors.map((error, index) => (
                        <Alert variant="destructive" className="border-none -mt-4 -ml-4" key={`error_${index}`}>
                            <AlertDescription className="text-xs">{error}</AlertDescription>
                        </Alert>
                    ))}
                </div>
                <CustomButton
                    label="Войти"
                    onClick={handleSubmit(submitLogin)} // Валидация перед вызовом submitLogin
                    className="w-full" // Растягиваем кнопку на всю ширину
                />
                <SteamLoginButton />
            </form>
            {/* Кнопка "Нет аккаунта? Зарегистрироваться" */}
            <button 
                onClick={handleOpenSignUp} 
                className="text-sm text-gray-400 hover:underline w-full text-center mt-6"
            >
                Нет аккаунта? Зарегистрироваться
            </button>
        </>
    );

    return (
        <Modal
            isOpen={loginModal.isOpen}
            close={loginModal.close}
            label="Авторизация"
            content={
                <div className="max-w-sm mx-auto"> {/* Ограничиваем ширину модального окна и центрируем */}
                    {content}
                </div>
            }
        />
    );
};

export default LoginModal;