// pages/tasks.js
import { useState, useEffect } from "react";
import axios from "axios";
import apiService from "@/app/services/apiService";
import { toast } from "react-toastify";
import { CheckCheck } from "lucide-react";
import useSWR, { mutate } from 'swr';

interface Task {
    id: number;
    title: string;
    description: string;
    reward: number;
    isDaily?: boolean;
    completedToday?: boolean;
}
interface CompletedTask {
    id: number;
    isDaily: boolean;
    completedToday: boolean;
}
const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [status, setStatus] = useState("");
    const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
    // Получение списка заданий
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await apiService.get("/api/raffles/tasks/"); // Поменяй путь на свой API для получения заданий
                setTasks(response);
                //console.log('tasks:', response)
            } catch (error) {
                //console.error("Ошибка при загрузке заданий:", error);
            }
        };
        fetchTasks();
    }, []);

    useEffect(() => {
        const fetchCompletedTasks = async () => {
            try {
                const response = await apiService.get("/api/raffles/tasks/completed/");
                setCompletedTasks(response.completedTasks);  // API должно возвращать массив ID выполненных задач
            } catch (error) {
                //console.error("Ошибка загрузки выполненных заданий:", error);
            }
        };

        fetchCompletedTasks();
    }, []);

    // Функция для проверки выполнения задания
    const handleCheckTask = async (taskId: number) => {
        try {
            const response = await apiService.post("/api/raffles/tasks/check/", JSON.stringify({ taskId }));
            if (response.success) {
                toast.success(response.success);
                setCompletedTasks(response.completedTasks); 
                if (response.redirect_url) {
                    window.open(response.redirect_url, "_blank");
                }
            } else if (response.error) {
                toast.error(response.error);
            } else {
                toast.info(response.data.info || "Непонятный ответ от сервера");
            }

            setStatus(response.success || response.error || response.info);
        } catch (error) {
            if (!axios.isAxiosError(error) || error.response?.status !== 400) {
                console.error("Ошибка при проверке задания:", error);
            }
            setStatus("Ошибка при проверке задания");
            //console.error("Ошибка при проверке задания:", error);
        }
    };


    return (
        <>
            {/*<h3 className="text-2xl font-bold text-center text-white mb-4">Задания</h3>*/}

            {/* Вывод списка заданий */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                {tasks && tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task.id} className='overflow-hidden bg-gray-600/20 text-gray-400 border border-gray-700 text-xs p-3 rounded-xl w-full md:w-auto hover:bg-gray-600/30 transform transition-all duration-300 hover:scale-105'>
                            {/* Фон с картинкой, который будет поверх всех других фонов */}
                            <div className="absolute inset-0 -top-40 -right-40 z-10" style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_API_HOST}/media/logos/card-fon-raffle.png)`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }}></div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white">{task.title}</h3>
                                <p className="text-gray-300">{task.description}</p>
                                <p className="mt-2 text-sm text-gray-500">Награда: {task.reward} ₽</p>
                                {/* Кнопка для проверки задания */}
                                <button
                                    onClick={() => handleCheckTask(task.id)}
                                    disabled={completedTasks?.some(taskItem => 
                                        taskItem.id === task.id && (!taskItem.isDaily || taskItem.completedToday)
                                    )}
                                    className={`mt-4 px-4 py-2 rounded-md transition ${completedTasks?.some(taskItem => taskItem.id === task.id && (!taskItem.isDaily || taskItem.completedToday))
                                            ? 'border border-gray-500 cursor-not-allowed text-gray-300'
                                            : 'border border-green-500 text-green-500 hover:bg-green-600/20'
                                        }`}
                                >
                                    {completedTasks?.some(taskItem => taskItem.id === task.id && (!taskItem.isDaily || taskItem.completedToday))
                                        ? <div className="flex">Выполнено <CheckCheck size={15} className="ml-1" /></div>
                                        : 'Проверить'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    ''
                )}
            </div>
        </>
    );
};

export default TaskList;
